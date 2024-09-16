const express = require('express');
const { session } = require('../db/neo4j');
const { s3, bucketName, PutObjectCommand, CopyObjectCommand } = require('../db/s3');
const generateHTML = require('../generateHTML');

const router = express.Router();

router.post('/compile', async (req, res) => {
  const { websiteId, homePageId } = req.body;

  try {
    console.log('Compiling website with ID:', websiteId);
    console.log('Home Page ID:', homePageId);

    const result = await session.run(`
      MATCH (w:Website {id: $websiteId})<-[:BELONGS_TO]-(p:Page)
      OPTIONAL MATCH (p)<-[:BELONGS_TO]-(widget:Widget)
      RETURN w, p, collect(widget) AS widgets
    `, { websiteId });

    if (result.records.length === 0) {
      console.error('No records found for the given website ID');
      return res.status(404).json({ message: 'No data found for the given website ID' });
    }

    const websiteData = result.records.map(record => {
      const page = record.get('p').properties;
      const widgets = record.get('widgets').map(widgetRecord => {
        const widget = widgetRecord.properties;
        try {
          widget.data = JSON.parse(widget.data.replace(/\\\"/g, '"').slice(1, -1));
          widget.position = JSON.parse(widget.position.replace(/\\\"/g, '"').slice(1, -1));
          widget.size = JSON.parse(widget.size.replace(/\\\"/g, '"').slice(1, -1));
        } catch (e) {
          console.error('Error parsing widget data:', e);
          widget.data = {};
          widget.position = { x: 0, y: 0 };
          widget.size = { width: 100, height: 100 };
        }
        return widget;
      });
      return { ...page, widgets };
    });

    const uploadPromises = websiteData.map(page => {
      const htmlContent = generateHTML(page);
      const fileName = `page_${page.id}.html`;
      const fileContent = Buffer.from(htmlContent, 'utf8');

      const params = {
        Bucket: bucketName,
        Key: `${websiteId}/${fileName}`,
        Body: fileContent,
        ContentType: 'text/html'
      };

      return s3.send(new PutObjectCommand(params));
    });

    await Promise.all(uploadPromises);

    const homePagePath = `${websiteId}/page_${homePageId}.html`;
    const indexParams = {
      Bucket: bucketName,
      CopySource: `${bucketName}/${homePagePath}`,
      Key: `${websiteId}/index.html`
    };
    await s3.send(new CopyObjectCommand(indexParams));

    res.status(200).json({ message: 'Website compiled and uploaded successfully', websiteId });
  } catch (error) {
    console.error('Error compiling website:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
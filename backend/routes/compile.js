const express = require('express');
const fs = require('fs');
const path = require('path');
const { session } = require('../db/neo4j');

const router = express.Router();

router.post('/compile', async (req, res) => {
  const { websiteId, homePageId } = req.body;

  try {
    console.log('Compiling website with ID:', websiteId);
    console.log('Home Page ID:', homePageId);

    // Fetch website data
    const result = await session.run(`
      MATCH (w:Website {id: $websiteId})<-[:BELONGS_TO]-(p:Page)
      OPTIONAL MATCH (p)-[:HAS_WIDGET]->(widget:Widget)
      RETURN w, p, collect(widget) AS widgets
    `, { websiteId });

    console.log('Database Query Result:', result);

    if (result.records.length === 0) {
      console.error('No records found for the given website ID');
      return res.status(404).json({ message: 'No data found for the given website ID' });
    }

    const websiteData = result.records.map(record => {
      const page = record.get('p').properties;
      const widgets = record.get('widgets').map(widgetRecord => {
        const widget = widgetRecord.properties;
        try {
          widget.data = JSON.parse(widget.data);
        } catch (e) {
          console.error('Error parsing widget data:', e);
          widget.data = {};
        }
        try {
          widget.position = JSON.parse(widget.position);
        } catch (e) {
          console.error('Error parsing widget position:', e);
          widget.position = { x: 0, y: 0 };
        }
        try {
          widget.size = JSON.parse(widget.size);
        } catch (e) {
          console.error('Error parsing widget size:', e);
          widget.size = { width: 100, height: 100 };
        }
        return widget;
      });
      return { ...page, widgets };
    });

    console.log('Website Data:', websiteData);

    if (websiteData.length === 0) {
      return res.status(404).json({ message: 'No data found for the given website ID' });
    }

    // Generate HTML for each page
    const htmlFiles = websiteData.map(page => {
      const pageHtml = generatePageHtml(page, homePageId === page.id);
      console.log(`Generated HTML for page ${page.id}:`, pageHtml);
      return { filename: `page_${page.id}.html`, content: pageHtml };
    });

    // Save HTML files to the directory
    const outputDir = path.join(__dirname, '../compiled-websites', websiteId);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log('Output Directory:', outputDir);

    htmlFiles.forEach(file => {
      console.log(`Writing file ${file.filename} to ${outputDir}`);
      fs.writeFileSync(path.join(outputDir, file.filename), file.content);
    });

    // Create an index.html file for the home page
    const homePage = websiteData.find(page => page.id === homePageId);
    if (homePage) {
      const homePageHtml = generatePageHtml(homePage, true);
      console.log('Generated HTML for home page:', homePageHtml);
      fs.writeFileSync(path.join(outputDir, 'index.html'), homePageHtml);
    }

    const compiledUrl = `http://localhost:5001/compiled-websites/${websiteId}/index.html`;
    res.status(200).json({ compiledUrl });
  } catch (error) {
    console.error('Error compiling website:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Function to generate HTML for a page
function generatePageHtml(page, isHomePage) {
  const widgetsHtml = page.widgets.map(widget => generateWidgetHtml(widget)).join('');
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${page.name}</title>
      <style>
        .widget-container { position: absolute; }
      </style>
    </head>
    <body>
      <div class="boundary-box" style="width: 1200px; height: 800px; border: 2px solid black; position: relative; overflow: hidden;">
        ${widgetsHtml}
      </div>
    </body>
    </html>
  `;
}

// Function to generate HTML for a widget
function generateWidgetHtml(widget) {
  let widgetHtml = '';
  switch (widget.type) {
    case 'form':
      widgetHtml = `<form>${widget.data.text}</form>`;
      break;
    case 'chart':
      widgetHtml = `<div>Chart: ${widget.data.text}</div>`;
      break;
    case 'text':
      widgetHtml = `<p style="font-size: ${widget.data.fontSize}px; color: ${widget.data.fontColor};">${widget.data.text}</p>`;
      break;
    case 'image':
      widgetHtml = `<img src="${widget.data.imageUrl}" alt="Image" style="width: ${widget.size.width}px; height: ${widget.size.height}px;" />`;
      break;
    case 'button':
      widgetHtml = `<button>${widget.data.text}</button>`;
      break;
    case 'shape':
      widgetHtml = `<div style="width: ${widget.size.width}px; height: ${widget.size.height}px; background-color: ${widget.data.color};"></div>`;
      break;
    default:
      widgetHtml = `<div>Unknown widget type</div>`;
  }
  return `<div class="widget-container" style="left: ${widget.position.x}px; top: ${widget.position.y}px;">${widgetHtml}</div>`;
}

module.exports = router;
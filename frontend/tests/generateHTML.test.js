const generateHTML = require('../../backend/generateHTML.js');

describe('generateHTML function', () => {
  it('should generate HTML for a clickable text widget', () => {
    const page = {
      name: 'Test Page',
      widgets: [
        {
          type: 'text',
          data: { text: 'Click me', fontSize: '24', fontFamily: 'Arial', clickable: true, link: 'https://example.com' },
          position: { x: 100, y: 100 },
          size: { width: 200, height: 50 }
        }
      ]
    };

    const result = generateHTML(page);

    const widgetMatch = result.match(/<div class="widget".*?>.*?<\/div>/s);
    
    if (!widgetMatch) {
      throw new Error("Widget HTML not found");
    }

    const widgetSnippet = widgetMatch[0];

    const expectedSnippet = `<div class="widget" style="left: 100px; top: 100px; width: 200px; height: 50px; font-size: 24px; font-family: Arial, sans-serif;"> Click me </div>`;

    expect(widgetSnippet.replace(/\s+/g, ' ').trim()).toBe(expectedSnippet.replace(/\s+/g, ' ').trim());
  });

  it('should generate HTML for an image widget', () => {
    const page = {
      name: 'Image Page',
      widgets: [
        {
          type: 'image',
          data: { imageUrl: 'https://example.com/image.jpg' },
          position: { x: 150, y: 150 },
          size: { width: 300, height: 200 },
          clickable: false
        }
      ]
    };

    const result = generateHTML(page);
    console.log(result);

    const imageMatch = result.match(/<img.*?src="https:\/\/example.com\/image.jpg".*?>/s);
    
    if (!imageMatch) {
      throw new Error("Image HTML not found");
    }

    const imageSnippet = imageMatch[0];

    const expectedSnippet = `<img class="widget" src="https://example.com/image.jpg" style="left: 150px; top: 150px; width: 300px; height: 200px;" alt="">`;

    expect(imageSnippet.replace(/\s+/g, ' ').trim()).toBe(expectedSnippet.replace(/\s+/g, ' ').trim());
  });
});
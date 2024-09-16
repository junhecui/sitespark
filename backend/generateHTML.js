const generateHTML = (page) => {
  let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${page.name}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
        }
        .widget {
          position: absolute;
        }
      </style>
    </head>
    <body>
  `;

  page.widgets.forEach(widget => {
    const { type, data, position, size } = widget;

    switch (type) {
      case 'text':
        html += `
          <div class="widget" style="left: ${position.x}px; top: ${position.y}px; width: ${size.width}px; height: ${size.height}px; font-size: ${data.fontSize || '16'}px; font-family: ${data.fontFamily || 'Arial'}, sans-serif;">
            ${data.text || ''}
          </div>
        `;
        break;

      case 'image':
        html += `
          <img class="widget" src="${data.imageUrl}" style="left: ${position.x}px; top: ${position.y}px; width: ${size.width}px; height: ${size.height}px;" alt="">
        `;
        break;

      case 'shape':
        html += `
          <div class="widget" style="left: ${position.x}px; top: ${position.y}px; width: ${size.width}px; height: ${size.height}px; background-color: ${data.color || 'gray'};">
          </div>
        `;
        break;

      case 'button':
        html += `
          <a href="${data.link || '#'}" class="widget" style="left: ${position.x}px; top: ${position.y}px; width: ${size.width}px; height: ${size.height}px;">
            <button style="width: 100%; height: 100%;">${data.text || 'Click'}</button>
          </a>
        `;
        break;

      default:
        console.warn(`Unknown widget type: ${type}`);
    }
  });

  html += `
    </body>
    </html>
  `;

  return html;
};

module.exports = generateHTML;
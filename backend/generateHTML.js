function generateHTML(page) {
    const pageTitle = page.name || 'Untitled Page';
    const widgetsHtml = page.widgets.map(widget => {
      switch (widget.type) {
        case 'text':
          return `<div class="widget-container" style="left: ${widget.position.x}px; top: ${widget.position.y}px;">
            <p style="font-size: ${widget.data.fontSize || 16}px; color: ${widget.data.fontColor || '#000'};">${widget.data.text || ''}</p>
          </div>`;
        case 'image':
          return `<div class="widget-container" style="left: ${widget.position.x}px; top: ${widget.position.y}px;">
            <img src="${widget.data.imageUrl || ''}" alt="Image" style="width: ${widget.size.width}px; height: ${widget.size.height}px;" />
          </div>`;
        case 'shape':
          return `<div class="widget-container" style="left: ${widget.position.x}px; top: ${widget.position.y}px; width: ${widget.size.width}px; height: ${widget.size.height}px; background-color: ${widget.data.color || '#ccc'};"></div>`;
        default:
          return '';
      }
    }).join('\n');
  
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${pageTitle}</title>
        <style>
          .widget-container { position: absolute; }
          a { text-decoration: none; }
        </style>
      </head>
      <body>
        <div style="width: 100%; height: 100%; position: relative; overflow: hidden;">
          ${widgetsHtml}
        </div>
      </body>
      </html>
    `;
  }
  
  module.exports = generateHTML;  
const generateHTML = (page) => {
  let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${page.name}</title>
      <style>
        body, html {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }
        .page-container {
          position: relative;
          width: 100%;
          max-width: 1200px;
          height: 675px;
          transform-origin: top left;
        }
        .widget {
          position: absolute;
        }
        /* Scale based on viewport width */
        @media screen and (min-width: 800px) {
          .page-container {
            transform: scale(calc(100vw / 1200));
          }
        }
        @media screen and (max-width: 800px) {
          .page-container {
            transform: scale(calc(100vw / 1200));
          }
        }
      </style>
    </head>
    <body>
      <div class="page-container">
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
        let imageTag = `<img class="widget" src="${data.imageUrl}" style="left: ${position.x}px; top: ${position.y}px; width: ${size.width}px; height: ${size.height}px;" alt="">`;

        if (data.clickable) {
          if (data.link) {
            imageTag = `<a href="${data.link}" target="_blank">${imageTag}</a>`;
          } else if (data.pageLink) {
            imageTag = `<a href="page_${data.pageLink}.html">${imageTag}</a>`;
          }
        }

        html += imageTag;
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
      </div>
    </body>
    </html>
  `;

  return html;
};

module.exports = generateHTML;
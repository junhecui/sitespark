module.exports = function generateHTML(pageTitle, widgetsHtml) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${pageTitle}</title>
        <style>
          body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
          }
          .widget-container { position: absolute; }
          .boundary-box {
            width: 100%;
            height: 100%;
            position: relative;
            overflow: hidden;
          }
        </style>
      </head>
      <body>
        <div class="boundary-box">
          ${widgetsHtml}
        </div>
      </body>
      </html>
    `;
  };  
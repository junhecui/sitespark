# SiteSpark

SiteSpark is an introductory[^1], user-friendly web application that will allow interested or aspiring website builders to get a feel for designing web pages. It has basic and clear features and buttons to allow beginners to create and host their first website!

[^1]: *SiteSpark is NOT a robust low code website builder; it is advised that users look into other platforms if they wish to build a website for commercial purposes.*

## Features

### Website Creation

SiteSpark enables users to natively launch their designed website for others to view. Using a basic username-password system, SiteSpark users can make private websites that they can publicly display after completion, as well as provide live updates.

### Widget Creation

SiteSpark has a variety of widgets, including text, shapes, images, and charts. These widgets are customizable and users can create hyperlinks for other pages in their website.

## Technologies Used

* **JavaScript** was used to create an interactive **React** frontend and **Node.js** and **Express.js** server.
* **Neo4j**, a graph database system was used to store websites, pages, and widgets, as well as map their relationships.
* **AWS S3** buckets were used to store images and other data to prevent bloating of the Neo4j database.

## How to Use

1. [Clone repository](https://github.com/junhecui/sitespark)
2. Create a `.env` file for the following elements: `AWS_SECRET_ACCESS_KEY`, `AWS_ACCESS_KEY_ID`, `AWS_REGION`, `NEO4J_PASSWORD`, `S3_BUCKET_NAME`.
3. Run `npm install`.
4. Run `cd frontend` and `npm start`, create another terminal and run `cd backend` and `npm start`.
5. The application will be ready to function.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact Information

For support, please contact `cjunhe05@gmail.com`.

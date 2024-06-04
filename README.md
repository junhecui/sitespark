# Low Code Platform Builder

This low code website builder is an introductory, user-friendly web application that will allow interested or aspiring website builders to get a feel for designing web pages.

## Technologies Used

* **JavaScript** was used to create an interactive **React** frontend and **Node.js** and **Express.js** server.
* **Neo4j**, a graph database system was used to map the relationships between pages and widgets.
* **AWS S3** buckets were used to store images and other data to prevent bloating of the Neo4j database.

## How to Use

1. [Clone repository](https://github.com/junhecui/low-code-platform-builder)
2. Create a `.env` file for the following elements: `AWS_SECRET_ACCESS_KEY`, `AWS_ACCESS_KEY_ID`, `AWS_REGION`, `NEO4J_PASSWORD`, `S3_BUCKET_NAME`.
3. Run `npm install`.
4. Run `cd frontend` and `npm start`, create another terminal and run `cd backend` and `npm start`.
5. The application will be ready to function.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact Information

For support, please contact `cjunhe05@gmail.com`.

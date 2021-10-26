const { app } = require('./app');
const server = require('http').createServer(app);
require('dotenv').config();
const connectDb = require("./config/db");
connectDb();

process.on('uncaughtException', (error) => {
    console.log(error);
    process.exit(1);
});

const port = process.env.PORT;

server.listen(port, () => {
    console.log(`App is running on port ${port}`)
});

process.on('unhandledRejection', (error) => {
    console.log(error.name, error.message);
    server.close(() => {
        process.exit(1);
    });
});

process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Process terminated!');
    });
});
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const rateLimit = require("express-rate-limit");
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const globalErrorHandler = require('./src/middleware/globalErrorHandler');

/** ------------- NGROK ----------------- */
const ngrok = require('ngrok');

/** Templating Engine */
app.set('view engine', 'pug');
// app.set('views', `${__dirname}/views`) /**One Mehtod of doing it */
app.set('views', path.join(__dirname, 'views'));
/** ----------- Static Files ------------ */
app.use(express.static(path.join(__dirname, 'public')));

/** Set Security HTTP headers */
app.use(helmet());
/** ------------------------- */

app.use(express.urlencoded({ extended: false }));

/** Rate Limiting Middleware */
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, /** 1 hour - 1000 * 60 = 1 minute in Javascript */
    max: 100 // Limit each IP to 100 requests per windowMs
});

app.use('/v1', limiter);
/** ------------------------ */

/** Import Router */
const router = require('./src/routes/index');

/** Middlewares */
app.use(express.json({ limit: '20000kb' }));
app.use(router);
app.use(cors());
app.use("*", cors());
/** Global Error Handler */
app.use(globalErrorHandler);

/** Data Sanitization againt NoSQL query Injection
 * & Data Sanitization against XSS
 */
app.use(mongoSanitize());
app.use(xss());

/** Prevent Parameter Pollution - Use on Fields in Schema Definition */
app.use(hpp({
    whitelist: [
        'duration',
        'ratingsQuantity',
        'ratingsAverage'
    ],
})); 

module.exports = { app };
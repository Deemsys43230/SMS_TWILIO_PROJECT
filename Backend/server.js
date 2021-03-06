'use strict'

const component = "server";
const fs = require('fs');
const http = require('http');
const https = require('https');
const { mainStory, chalk } = require('storyboard');
const config = require('config');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const ERR = require('./errors.json');
const  multer = require('multer');
const cors = require('cors');
const expressSession = require('express-session');
const errorHandler=require('./middleware/error-handler');


// custom middleware
require('./middleware/logging');
require('./middleware/environment')();
const datastore = require('./middleware/datastore');

// app setup
var app = express();


// common middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(helmet());
app.use(expressSession({
    secret: process.env.COOKIE_SECRET
}));
// app.use(compression());//enable it for certain paths only e.g. compressed /transactions might take longer

// routes
app.use("/v1/user",require('./routes/user'));
app.use("/v1/common",require('./routes/siteinfo'));
app.use("/v1/user/contacts",require('./routes/contacts'));
app.use("/v1/user/groups",require('./routes/group'));
app.use("/v1/user/templates",require('./routes/template'));

//app.use(errorHandler);

app.use(function (req, res, next) {
    const log = require('./util/logger').log(component, ___filename);
    log.error(component, `${req.method} ${req.originalUrl} ${ERR.NOT_FOUND}`);
    log.close();
    res.status(404).send('Not Found');
});

// env vars
var port = process.env.PORT || config.http.port || '3000'
app.set('port', port);

// start server
var server;
if (config.http.secure) {
    var privateKey = fs.readFileSync('cert/key.pem', 'utf8');
    var certificate = fs.readFileSync('cert/cert.pem', 'utf8');
    var credentials = { key: privateKey, cert: certificate };
    server = https.createServer(credentials, app);
} else {
    server = http.createServer(app);
}
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// server event handlers
function onError(error) {
    const log = require('./util/logger').log(component, ___filename);
    if (error.syscall !== 'listen') {
         datastore.disconnect();
        log.close();
        throw error;
    }
    switch (error.code) {
        case 'EACCES':
            log.error(component, `${port} requires elevated privileges`);
             datastore.disconnect();
            log.close();
            process.exit(1);
            break;
        case 'EADDRINUSE':
            log.error(component, `${port} is already in use`);
             datastore.disconnect();
            log.close();
            process.exit(1);
            break;
        default:
            log.error(component, 'server error', { attach: error });
            log.close();
            throw error;
    }
}

function onListening() {
    const log = require('./util/logger').log(component, ___filename);
    if (!config.http.secure) log.warn('starting non-secure server');
    log.info(component, `${chalk.green.bold(require('./package.json').name + ' server ver ' + require('./package.json').version + ' started on port ' + app.get('port') + ' [env:' + process.env.NODE_ENV + ']')}`);
    log.close();
    datastore.connect();
}

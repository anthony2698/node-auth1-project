const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const authRouter = require('./auth/authRouter');
const dbConnection = require('./data/dbConfig');
const authenticate = require('./auth/authentication-middleware');

const server = express();

const sessionConfig = {
    name: 'sid', // deafault value sid
    secret: 'hi', // key for encryption
    cookie: {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        secure: false, // send cookie over https (secure connection)
        httpOnly: true, // prevent JS code from accessing cookie through client
    },
    resave: false,
    saveUninitialized: false, // read docs, it's related to GDPR compliance
    store: new KnexSessionStore({
        knex: dbConnection,
        tablename: 'sessions',
        sidfieldname: 'sid',
        createtable: true,
        clearInterval: 1000 * 60 * 30, // time to check and remove expired sessions from database
    }),
}

server.use(session(sessionConfig));
server.use(express.json());
server.use(cors());
server.use(helmet());
server.use(morgan());

server.use('/api/', authRouter);

server.get('/', (req, res) => {
    res.status(200).json({ API: 'RUNNING...' });
});

server.get('/api/users/', authenticate, (req, res) => {
    dbConnection('users')
        .then(users => {
            res.status(200).json({ users })
        })
        .catch(err => {
            res.status(500).json({ message: 'error connecting to database. '});
        });
})

module.exports = server;
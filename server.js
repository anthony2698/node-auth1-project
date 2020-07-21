const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRouter = require('./auth/authRouter');

const server = express();

server.use(express.json());
server.use(cors());
server.use(helmet());
server.use(morgan());

server.use('/api/', authRouter);

server.get('/', (req, res) => {
    res.status(200).json({ API: 'RUNNING...' });
});

module.exports = server;
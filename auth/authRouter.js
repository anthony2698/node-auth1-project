const express = require('express');
const bcrypt = require('bcryptjs');

const Users = require('./authModel');

const router = express.Router();

router.post('/register/', (req, res) => {
    const credentials = req.body;
    const hash = bcrypt.hashSync(credentials.password, 6);
    credentials.password = hash;

    if ( credentials.username && credentials.password ) {
        Users.add(credentials)
            .then(response => {
                res.status(200).json({ message: 'Successfully created account!' });
            })
            .catch(err => {
                res.status(500).json({ message: 'Error when adding account to database.' });
            })
    } else {
        res.status(400).json({ message: 'Make sure username and password are filled in.' });
    }
});

router.post('/login/', (req, res) => {
    const { username, password } = req.body;

    Users.findBy({ username })
        .then(user => {
            if ( user &&  bcrypt.compareSync(password, user.password)) {
                req.session.loggedIn = true;
                req.session.username = user.username;

                res.status(200).json({ message: `Loggen In, Welcome ${username}!`, session: req.session });
            } else {
                res.status(401).json({ message: 'Invalid credentials.' });
            }
        })
        .catch(err => {
            res.status(500).json({ message: err });
        })
});

module.exports = router;
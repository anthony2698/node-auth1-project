const express = require('express');
const bcrypt = require('bcryptjs');

const Users = require('../data/dbConfig');

const router = express.Router();

router.post('/register/', (req, res) => {
    const credentials = req.body;
    const hash = bcrypt.hashSync(credentials.password, 6);
    credentials.password = hash;

    if ( credentials.username && credentials.password ) {
        Users('users').insert(credentials)
            .then(response => {
                res.status(200).json({ message: 'Successfully created account!' });
            })
            .catch(err => {
                res.status(500).json({ message: 'Error when adding account to database.' });
            })
    } else {
        
    }

})

module.exports = router;
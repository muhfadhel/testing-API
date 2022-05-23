var express = require('express');
var router = express.Router();

var authRoutes = require('./authRoutes');
var userRoutes = require('./userRoutes');

router.get('/', function(req, res, next) {
    const ready = {
        status: "Server is ready"
    }

    res.status(200).send(ready);
});

router.use('/auth', authRoutes);
router.use('/user', userRoutes);

module.exports = router;
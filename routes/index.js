var express = require('express');
var router = express.Router();
let mcib = require('../micb_fixture.json');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'This is mister Mr. Pumpkin' });
});


router.post('/', function (req, res, next) {
	res.status(200).json(mcib)
});

module.exports = router;

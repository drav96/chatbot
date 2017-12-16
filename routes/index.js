const express = require('express');
const router = express.Router();
let actions = require('./actions');

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', {title: 'This is mister Mr. Pumpkin API'});
});

router.post('/', function (req, res, next) {
	switch (req.body.result.action) {
		case "showAllAccounts":
			actions.showAllAccounts(res);
			break;
		case "account.status":
			actions.accountStatus(res, req.body.result.parameters.currency_code || null);
		default :
			console.log("No function")
	}


});


module.exports = router;

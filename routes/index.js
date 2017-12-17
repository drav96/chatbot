const express = require('express');
const router = express.Router();
const moment=require('moment');
let actions = require('./actions');

router.get('/', function (req, res) {
	res.render('index', {title: 'This is mister Mr. Pumpkin API'});
});

router.post('/', (req, res) => {
	let currency = req.body.result.parameters.currency_code || null;
	switch (req.body.result.action) {
		case "showAllAccounts":
			actions.showAllAccounts(res);
			break;
		case "account.status":
			actions.accountStatus(res, currency);
			break;
		case "total.transactions":
			actions.totalTransactions(res);
			break;
		case "create.chart":
			let lastTransactions = req.body.result.parameters.lastTransactions || -15;
			actions.createChart(res, currency || 'USD', lastTransactions);
			break;
		case "create.general.chart":
			actions.createGeneralChart(res);
			break;
		case "show_in_one_currency":
			actions.showInOneCurrency(res, req);
			break;
		case "show_all_categories":
			actions.showAllCategories(res);
			break;
		case "money_on_category":
			actions.moneyOnCategory(res, req);
			break;
		default :
			console.log("No function")
	}

});

module.exports = router;

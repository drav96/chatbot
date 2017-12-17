let mcib = require('../micb_fixture.json');
let charts = require('./charts');
var request = require('request');

module.exports = {
	showAllAccounts: (res) => {
		let accounts = [];
		mcib.data.accounts.map(el => {
			accounts.push(el.name);
		});
		let response = accounts.join("\n").toString();
		res.status(200).json({"speech": response})
	},
	accountStatus: (res, currencyCode) => {
		let result;
		let accounts = [];
		mcib.data.accounts.map(el => {
			accounts.push(
				{
					name: el.name,
					currency: el.currency_code,
					balance: el.balance
				});
		});

		if (!currencyCode) {
			result = balance(accounts)
		} else {
			result = balance(accounts.filter(el => el.currency === currencyCode))
		}
		res.status(200).json({"speech": result})
	},
	totalTransactions: (res, currencyCode) => {

		let result;
		let accounts = [];
		mcib.data.accounts.map(el => {
			accounts.push(
				{
					name: el.name,
					currency: el.currency_code,
					balance: el.balance
				});
		});

		if (!currencyCode) {
			result = balance(accounts)
		} else {
			result = balance(accounts.filter(el => el.currency === currencyCode))
		}
		res.status(200).json({"speech": result})
	},
	createChart: (res, currency, timeFrame) => {
		let selectedTransactions = [];
		let selectedAmount = [];
		let filterTransactions = mcib.data.accounts.filter(el => el.currency_code === currency)[0];
		let initialBalance = filterTransactions.balance;
		let lastTransactions = filterTransactions.transactions.slice(-timeFrame).reverse();

		lastTransactions.map(el => {
			selectedTransactions.push(el.made_on);
		});

		lastTransactions.map(el => {
			selectedAmount.push(el.amount);
		});
		let amount = selectedAmount.reverse().map(x => {
			initialBalance -= x;
			return initialBalance;
		});

		charts.plot(res, selectedTransactions.reverse(), amount);

	},
	createGeneralChart: (res, currency, timeFrame) => {
		let selectedTransactions = [];
		let selectedTransactions2 = [];
		let selectedAmount2 = [];

		let selectedAmount = [];
		let filterTransactions = mcib.data.accounts.filter(el => el.currency_code === "USD")[0];
		let filterTransactions2 = mcib.data.accounts.filter(el => el.currency_code === "MDL")[0];

		let initialBalance = filterTransactions.balance;
		let initialBalance2 = filterTransactions.balance;

		let lastTransactions = filterTransactions.transactions.slice(-timeFrame);
		let lastTransactions2 = filterTransactions2.transactions.slice(-timeFrame);

		lastTransactions.map(el => {
			selectedTransactions.push(el.made_on);
		});
		lastTransactions2.map(el => {
			selectedTransactions2.push(el.made_on);
		});


		lastTransactions.map(el => {
			selectedAmount.push(el.amount);
		});

		lastTransactions2.map(el => {
			selectedAmount2.push(el.amount);
		});


		let amount = selectedAmount.reverse().map(x => {
			initialBalance -= x;
			return initialBalance;
		});
		let amount2 = selectedAmount2.reverse().map(x => {
			initialBalance2 -= x;
			return initialBalance2;
		});

		charts.plotTwo(res, selectedTransactions.reverse(), amount, selectedTransactions2.reverse(),amount2);

	},
	showInOneCurrency: (res1) => {
		let usd = parseFloat(mcib.data.accounts.find(x => x.currency_code === 'USD').balance);
		let mdl = parseFloat(mcib.data.accounts.find(x => x.currency_code === 'MDL').balance);

		request.get('https://xe.md/currency/17.12.2017?organisation=all', function (err, res, body) {
			let usdCost = parseFloat(JSON.parse(body, null, 2).BNM.USD.buy);
			let result = (usd + mdl / usdCost).toFixed(2);

			res1.status(200).json({"speech": result.toString() + " USD"})
		});
	},

};

let balance = (accounts) => {
	return accounts.map(el => {
		return `${el.name.toString()}: ${el.balance.toString()} ${el.currency.toString()} `
	}).join('\n');
}

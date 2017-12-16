let mcib = require('../micb_fixture.json');
let charts = require('./charts');

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
		let lastTransactions = filterTransactions.transactions.slice(-timeFrame);

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
		charts.plot(res, selectedTransactions, amount);

	}

};

let balance = (accounts) => {
	return accounts.map(el => {
		return `${el.name.toString()}: ${el.balance.toString()} ${el.currency.toString()} `
	}).join('\n');
}

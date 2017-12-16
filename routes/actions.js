let mcib = require('../micb_fixture.json');

module.exports = {
	showAllAccounts: async (res) => {
		let accounts = [];
		mcib.data.accounts.map(el => {
			accounts.push(el.name);
		});
		let response = accounts.join("\n").toString();
		await res.status(200).json({"speech": response})
	},
	accountStatus: async (res, currencyCode) => {
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
		await res.status(200).json({"speech": result})
	}
};

let balance = (accounts) => {
	return accounts.map(el => {
		return `${el.name.toString()}: ${el.balance.toString()} ${el.currency.toString()} `
	}).join('\n');
}

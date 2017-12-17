let mcib = require('../micb_fixture.json');
let charts = require('./charts');
var request=require('request');

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
    showInOneCurrency: (res1, req) => {
        let usd = parseFloat(mcib.data.accounts.find(x => x.currency_code === 'USD').balance);
        let mdl = parseFloat(mcib.data.accounts.find(x => x.currency_code === 'MDL').balance);

        request.get('https://xe.md/currency/17.12.2017?organisation=all', function(err,res,body) {
            let requiredCurency = req.body.result.parameters.currency_name;
        	let usdCost = parseFloat(JSON.parse(body, null, 2).BNM.USD.buy);

        	let result = "";
        	if (requiredCurency === 'USD')
        		result = (usd + mdl / usdCost).toFixed(2).toString() + " " + requiredCurency;
        	else
            	result = (mdl + usd * usdCost).toFixed(2).toString() + " " + requiredCurency;

            res1.status(200).json({"speech": result})
        });
	},
	showAllCategories: (res) => {
        let result = getAllCategories().join('\n');
        res.status(200).json({"speech": result});
	},
	moneyOnCategory: (res, req) => {
        let allTransactions = getAllTransactions();
        let requiredCurency = req.body.result.parameters.currency_name;
        let targetCategory = req.body.result.parameters.category_name;

        if (requiredCurency === "")
        	requiredCurency = "MDL";

        let filteredTransactions = allTransactions
			.filter(x => x.extra.original_category.toUpperCase() === targetCategory.toUpperCase());

        if (filteredTransactions.length === 0)
		{
            res.status(200).json({"speech": "No such category '" + targetCategory + "'"});
			return;
		}

        request.get('https://xe.md/currency/17.12.2017?organisation=all', function(err,_res,body) {
            let usdCost = parseFloat(JSON.parse(body, null, 2).BNM.USD.buy);

            let sum = 0;
            filteredTransactions.forEach(x =>
			{
				if (x.currency_code !== requiredCurency)
				{
					if (requiredCurency === 'USD')
						sum += parseFloat(x.amount) / usdCost;
					else
						sum += parseFloat(x.amount) * usdCost;
				}
				else
					sum += parseFloat(x.amount);
			});

            sum *= -1;
            let result = "Money spent on " + targetCategory + ": " + sum.toFixed(2).toString()
				+ " " + requiredCurency;

            res.status(200).json({"speech": result})
        });
	},
    availableAmount: (res) => {
        let result = mcib.data.accounts.map(x =>
            x.extra.available_amount + " " + x.currency_code).join('\n');
        res.status(200).json({"speech": result})
    },
    lastTransactions: (res, req) => {
	    let transactionCount = req.body.result.parameters.transactionCount;
	    if (transactionCount === "")
	        transactionCount = "1";
	    transactionCount = parseInt(transactionCount);

        let allTransactions = getAllTransactions();
        allTransactions.sort(function(a, b) {
            return Date.parse(a.made_on) - Date.parse(b.made_on);
        });

        allTransactions = allTransactions.slice(Math.max(1, allTransactions.length - transactionCount))
            .reverse();

        result = allTransactions.map(x => x.amount.toString() + " " + x.currency_code +
            " on " + x.made_on + " for " + x.extra.original_category).join('\n');

        res.status(200).json({"speech": result})
    },
    plotMoneySpent: (res) => {
	    let allCategories = getAllCategories();
	    let categoriesAndValues = {};
        allCategories.forEach(x => {
            let name = x.replace('&', ' ');
            categoriesAndValues[name] = 0;
        });

	    let allTransactions = getAllTransactions();
        request.get('https://xe.md/currency/17.12.2017?organisation=all', function(err,_res,body) {
            let usdCost = parseFloat(JSON.parse(body, null, 2).BNM.USD.buy);

            allTransactions.forEach(x => {
               let money = parseFloat(x.amount);
               if (x.currency_code === 'USD')
                   money *= usdCost;

               let name = x.extra.original_category.replace('&', ' ');
                categoriesAndValues[name] += money;
            });
            Object.keys(categoriesAndValues).forEach(k => {
               if (categoriesAndValues[k] > 0)
                   categoriesAndValues[k] = 0;
               else
                   categoriesAndValues[k] *= -1;
            });
            charts.plotMoneySpent(res, categoriesAndValues);
        });
    },
    plotIncome: (res) => {
        let allCategories = getAllCategories();
        let categoriesAndValues = {};
        allCategories.forEach(x => {
            let name = x.replace('&', ' ');
            categoriesAndValues[name] = 0;
        });

        let allTransactions = getAllTransactions();
        request.get('https://xe.md/currency/17.12.2017?organisation=all', function(err,_res,body) {
            let usdCost = parseFloat(JSON.parse(body, null, 2).BNM.USD.buy);

            allTransactions.forEach(x => {
                let money = parseFloat(x.amount);
                if (x.currency_code === 'USD')
                    money *= usdCost;

                let name = x.extra.original_category.replace('&', ' ');
                categoriesAndValues[name] += money;
            });

            Object.keys(categoriesAndValues).forEach(k => {
                if (categoriesAndValues[k] < 0)
                    categoriesAndValues[k] = 0;
            });

            charts.plotMoneySpent(res, categoriesAndValues);
        });
    }

};

let balance = (accounts) => {
	return accounts.map(el => {
		return `${el.name.toString()}: ${el.balance.toString()} ${el.currency.toString()} `
	}).join('\n');
}

function getAllTransactions() {
    return mcib.data.accounts[0].transactions.concat(
        mcib.data.accounts[1].transactions
    );
}

function getAllCategories() {
    let allTransactions = getAllTransactions();
    let allCategoriesSet = new Set(allTransactions.map(x => x.extra.original_category));
    return Array.from(allCategoriesSet);

}

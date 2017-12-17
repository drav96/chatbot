var plotly = require('plotly')("sezghin314", "B90jFmbfCWgxrd8AmfCj");
var _=require('loadash');
module.exports = {

	plot: (res, transactionTime, amount) => {
		let data = [
			{
				x: transactionTime,
				y: amount,
				type: "scatter"
			}
		];
		var graphOptions = {filename: "date-axes", fileopt: "overwrite"};
		plotly.plot(data, graphOptions, (err, msg) => {
			res.status(200).json({"messages": [{imageUrl: msg.url+`?id=${_.uniqueId()}`, type: 3}]})
			// res.status(200).json({"messages": [
			// 	{
			//             "imageUrl": msg.url + '.png',
			//             "platform": "telegram",
			//             "type": 3
			// 	}
			// ]})
		});
	},
	plotTwo: (res, array1, amount, array2, amount2) => {
		var trace1 = {
			x: array1,
			y: amount,
			name: "USD account",
			type: "scatter"
		};
		var trace2 = {
			x: array2,
			y: amount2,
			name: "MDL account",
			yaxis: "y2",
			type: "scatter"
		};
		var data = [trace1, trace2];
		var layout = {
			title: "Account check",
			yaxis: {title: "Time"},
			yaxis2: {
				title: "Amount",
				titlefont: {color: "rgb(148, 103, 189)"},
				tickfont: {color: "rgb(148, 103, 189)"},
				overlaying: "y",
				side: "right"
			}
		};
		var graphOptions = {layout: layout, filename: "multiple-axes-double", fileopt: "overwrite"};
		plotly.plot(data, graphOptions, function (err, msg) {
			res.status(200).json({"speech": msg.url})
		});
	},
	plotMoneySpent: (res, categoryAndMoney) => {
		console.log();

		let labels = Array.from(Object.keys(categoryAndMoney));
		let values = labels.map(k => parseFloat(categoryAndMoney[k]));

		let data = [{
			values: values,
			labels: labels,
			type: 'pie'
		}];
		console.log(data);
		var layout = {
			height: 1000,
			width: 1200,
			fileopt: 'overwrite',
			filename: 'multiple-axes-double',
		};

		plotly.plot(data, layout, function (err, msg) {
			res.status(200).json({"speech": msg.url});
		});
	}

}

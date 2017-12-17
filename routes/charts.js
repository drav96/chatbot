var plotly = require('plotly')("sezghin314", "B90jFmbfCWgxrd8AmfCj");

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
			res.status(200).json({"speech": msg.url})
		});

	},
	plotTwo: (res, array1,amount,array2,amount2) => {
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
	}

}

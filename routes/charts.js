var plotly = require('plotly')("lupei.dragos", "OacdbMJOXJdOChje3S8u");

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

	}
}

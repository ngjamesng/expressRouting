const express = require("express");
const app = express();
const ExpressError = require("./errors");

app.use((req, res, next) => {
	try {
		if (!("nums" in req.query)) {
			throw new ExpressError("nums are required", 400);
		}

		let nums = req.query.nums.split(",");

		if (nums.some((num) => isNaN(num))) {
			let badInput = nums.find((num) => isNaN(num));
			throw new ExpressError(`${badInput} is not a number.`, 400);
		}
		return next();
	} catch (err) {
		return next(err);
	}
});


app.use((err, req, res, next) => {
	let { status, msg } = err;
	return res.status(status).json({ error: { msg, status } });
});

app.get("/mean", (req, res) => {
	let nums = req.query.nums.split(",");
	let mean = nums.reduce((sum, val) => sum + +val, 0) / nums.length;
	return res.json({
		response : {
			operation : "mean",
			value     : mean
		}
	});
});

app.get("/median", (req, res) => {
	let nums = req.query.nums.split(",").map((x) => +x).sort((a, b) => a - b);

	let median =
		nums.length % 2 === 0 ? (nums[nums.length / 2] + nums[nums.length / 2 - 1]) / 2 : nums[Math.floor(nums.length / 2)];

	return res.json({
		response : {
			operation : "median",
			value     : median
		}
	});
});

app.get("/mode", (req, res) => {
	let nums = req.query.nums.split(",").map((x) => +x);
	let counter = {};
	nums.forEach((num) => {
		counter[num] = counter[num] + 1 || 1;
	});

	let mode;
	let highestCount = 0;
	for (let num in counter) {
		if (counter[num] > highestCount) {
			highestCount = counter[num];
			mode = num;
		}
	}

	return res.json({
		response : {
			operation : "mode",
			value     : +mode
		}
	});
});



app.listen(5000, () => {
	console.log("listening on port 5000");
});

// 0, 1, 2 math.floor(0 + 2)/2
// 0, 1

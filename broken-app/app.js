const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');

const app = express();

const limiter = rateLimit({
	windowMs : 60 * 60 * 1000,
	max      : 60,
	message  : 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

app.use(express.json());

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: 'Internal Server Error' });
});

app.post('/', async (req, res) => {
	try {
		const { developers } = req.body;

		if (!developers || !Array.isArray(developers) || developers.length === 0) {
			return res.status(400).json({ error: 'Invalid request body' });
		}

		const results = await Promise.all(
			developers.map(async (username) => {
				const response = await axios.get(`https://api.github.com/users/${username}`);
				return response.data;
			})
		);

		const formattedResults = results.map((data) => ({
			name : data.name,
			bio  : data.bio
		}));

		return res.json(formattedResults);
	} catch (e) {
		console.error(e);
		return res.status(500).json({ error: 'An error occurred' });
	}
});

app.listen(3000, () => {
	console.log('Server listening on port 3000');
});

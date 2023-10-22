const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');

const app = express();

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 60,
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.get('/', async (req, res) => {
  try {
    const developers = req.query.developers;

    if (!developers || typeof developers !== 'string') {
      return res.status(400).json({ error: 'Invalid request query parameters' });
    }

    const developerUsernames = developers.split(',');

    if (developerUsernames.length === 0) {
      return res.status(400).json({ error: 'No developer usernames provided' });
    }

    const results = await Promise.all(
      developerUsernames.map(async (username) => {
        try {
          const response = await axios.get(`https://api.github.com/users/${username}`);
          return response.data;
        } catch (e) {
          console.error(`Error fetching GitHub data for ${username}: ${e.message}`);
          return { name: 'Unknown', bio: 'Profile not found' };
        }
      })
    );

    const formattedResults = results.map((data) => ({
      name: data.name || 'Name not available',
      bio: data.bio || 'Bio not available',
    }));

    return res.json(formattedResults);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'An error occurred' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


// const express = require('express');
// const axios = require('axios');
// const rateLimit = require('express-rate-limit');



// const app = express();

// const limiter = rateLimit({
// 	windowMs : 60 * 60 * 1000,
// 	max      : 60,
// 	message  : 'Too many requests from this IP, please try again later.'
// });
// app.use(limiter);

// app.use(express.json());

// app.use((err, req, res, next) => {
// 	console.error(err.stack);
// 	res.status(500).json({ error: 'Internal Server Error' });
// });

// app.get('/', async (req, res) => {
// 	try {
// 		const { developers } = req.body;

// 		if (!developers || !Array.isArray(developers) || developers.length === 0) {
// 			return res.status(400).json({ error: 'Invalid request body' });
// 		}

// 		const results = await Promise.all(
// 			developers.map(async (username) => {
// 			  try {
// 				const response = await axios.get(`https://api.github.com/users/${username}`);
// 				return response.data;
// 			  } catch (e) {
// 				console.error(`Error fetching GitHub data for ${username}: ${e.message}`);
// 				return { name: 'Unknown', bio: 'Profile not found' };
// 			  }
// 			})
// 		  );

// 		  const formattedResults = results.map((data) => ({
// 			name: data.name || 'Name not available',
// 			bio: data.bio || 'Bio not available'
// 		  }));

// 		return res.json(formattedResults);
// 	} catch (e) {
// 		console.error(e);
// 		return res.status(500).json({ error: 'An error occurred' });
// 	}
// });

// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });


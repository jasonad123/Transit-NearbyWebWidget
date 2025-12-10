import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/api/nearby', async function (req, res, next) {
  const {lat, lon, max_distance} = req.query;

  try {
    const response = await axios({
      url: `https://external.transitapp.com/v3/public/nearby_routes?lat=${lat}&lon=${lon}&max_distance=${max_distance}`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'apiKey': process.env.API_KEY,
      }
    });

    res.send(response.data);
  } catch (err) {
    next(err);
  }
});

router.get('/api/stops', async function (req, res, next) {
  const {lat, lon, query} = req.query;

  try {
    const response = await axios({
      url: `https://external.transitapp.com/v3/public/search_stops?lat=${lat}&lon=${lon}&query=${query}&max_num_results=10`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'apiKey': process.env.API_KEY,
      }
    });

    res.send(response.data);
  } catch (err) {
    next(err);
  }
});

router.get('/images/:name.svg', function (req, res) {
  const name = req.params.name;
  const filename = name + '-mono.svg';
  const url = 'https://transitapp-data.com/images/svgx/' + filename;

  res.redirect(url);
});


router.get('/', function(req, res) {
  res.sendFile('index.html', { root: './public' });
});

export default router;

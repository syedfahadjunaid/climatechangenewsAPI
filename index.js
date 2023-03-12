const PORT = process.env.PORT || 8000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();

app.use(cors());

const newspapers = [
  {
    name: 'thetimes',
    address: 'https://www.thetimes.co.uk/environment/climate-change',
    base: '',
  },
  {
    name: 'guardian',
    address: 'https://www.theguardian.com/environment/climate-crisis',
    base: '',
  },
  {
    name: 'telegraph',
    address: 'https://www.telegraph.co.uk/climate-change',
    base: 'https://www.telegraph.co.uk',
  },
  {
    name: 'bbc',
    address: 'https://www.bbc.com/news/science-environment-56837908',
    base: 'https://www.bbc.com',
  },
  {
    name: 'nytimes',
    address: 'https://www.nytimes.com/international/section/climate',
    base: 'https://www.nytimes.com',
  },
  {
    name: 'foxnews',
    address: 'https://www.foxnews.com/category/us/environment/climate-change',
    base: 'https://www.foxnews.com',
  },
  {
    name: 'msnbc',
    address: 'https://www.msnbc.com/environment',
    base: '',
  },
  {
    name: 'cnn',
    address: 'https://edition.cnn.com/specials/world/cnn-climate',
    base: 'https://edition.cnn.com',
  },
  {
    name: 'skynews',
    address: 'https://news.sky.com/climate',
    base: '',
  },
];

const articles = [];

newspapers.forEach((newspaper) => {
  const climateNews = async () => {
    const response = await axios.get(newspaper.address);
    const html = response.data;
    const $ = cheerio.load(html);

    $('a:contains("climate")', html).each(function () {
      const title = $(this).text();
      const url = $(this).attr('href');

      articles.push({
        title: title,
        url: newspaper.base + url,
        source: newspaper.name,
      });
    });
  };
  climateNews().catch((error) => console.log(error));
});

app.get('/', (req, res) => {
  res.json('Welcome to my Climate Change News api');
});

app.get('/news', (req, res) => {
  res.json(articles);
});

app.get('/news/:newspaperId', async (req, res) => {
  const newspaperId = req.params.newspaperId;

  const newspaperAddress = newspapers.filter((newspaper) => {
    return newspaper.name === newspaperId;
  })[0].address;
  const newsPaperBase = newspapers.filter((newspaper) => {
    return newspaper.name === newspaperId;
  })[0].base;

  const climateNewspaperById = async () => {
    const response = await axios.get(newspaperAddress);
    const html = response.data;
    const specificArtilcles = [];

    const $ = cheerio.load(html);
    $('a:contains("climate")', html).each(function () {
      const title = $(this).text();
      const url = $(this).attr('href');

      specificArtilcles.push({
        title: title,
        url: newsPaperBase + url,
        source: newspaperId,
      });
    });
    res.json(specificArtilcles);
  };
  climateNewspaperById().catch((error) => console.log(error));
});

app.listen(PORT, () => console.log(`Server is running at PORT: ${PORT}`));

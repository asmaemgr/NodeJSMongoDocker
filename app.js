const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios').default;
const mongoose = require('mongoose');

const Favorite = require('./models/favorite');

const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/favorites', async (req, res) => {
  const favorites = await Favorite.find();
  /*res.status(200).json({
    favorites: favorites,
  });*/
  res.send(showFavorites(favorites))
});

function showFavorites(data){
  htmlcontent = `<!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Favorites</title>
  <style>
  .favorite {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 20px;
  }
  .favorite h2 {
    font-size: 1.2em;
    margin-bottom: 5px;
  }
  .favorite p {
    margin: 5px 0;
  }
</style>
  </head>
  <body>`;
  data.forEach(favorite => {
    htmlcontent+=`<div class="favorite">
      <h2>Name: ${favorite.name}</h2>
      <p>Type: ${favorite.type}</p>
      <p>URL: ${favorite.url}</p>
  </div>`;
  });
  
htmlcontent += `
</body>
</html>`
return htmlcontent;
}

app.post('/favorites', async (req, res) => {
  const favName = req.body.name;
  const favType = req.body.type;
  const favUrl = req.body.url;
  console.log(favType);

  try {
    if (favType != 'movie' && favType != 'character') {
      throw new Error('"type" should be "movie" or "character"!');
    }
    const existingFav = await Favorite.findOne({ name: favName });
    if (existingFav) {
      throw new Error('Favorite exists already!');
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  const favorite = new Favorite({
    name: favName,
    type: favType,
    url: favUrl,
  });

  try {
    await favorite.save();
    res
      .status(201)
      .json({ message: 'Favorite saved!', favorite: favorite.toObject() });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

app.get('/movies', async (req, res) => {
  try {
    const response = await axios.get('https://swapi.dev/api/films');
    // res.status(200).json({ movies: response.data });
    res.send(showMovies(response.data));
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

app.get('/people', async (req, res) => {
  try {
    const response = await axios.get('https://swapi.dev/api/people');
    //res.status(200).json({ people: response.data });
    res.send(showPeople(response.data));
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

function showMovies(data){
  htmlcontent = `<!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Movies</title>
  <style>
  .movie {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 20px;
  }
  .movie h2 {
    font-size: 1.2em;
    margin-bottom: 5px;
  }
  .movie p {
    margin: 5px 0;
  }
</style>
  </head>
  <body>`;
  data.results.forEach(movie => {
    htmlcontent+=`<div class="movie">
    <form action="/favorites" method="POST">
      <h2>Title: ${movie.title}</h2>
      <input type="hidden" name="name" value="${movie.title}">
      <p>Episode ID: ${movie.episode_id}</p>
      <p>Producer: ${movie.producer}</p>
      <p>Director: ${movie.director}</p>
      <p>Release Date: ${movie.release_date}</p>
      <input type="hidden" name="type" value="movie">
      <input type="hidden" name="url" value="${movie.url}">
      <button type="submit">Add to Favorites</button>
    </form>
  </div>`;
  });
  
htmlcontent += `
</body>
</html>`
return htmlcontent;
}


function showPeople(data){
  htmlcontent = `<!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>People</title>
  <style>
  .people {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 20px;
  }
  .people h2 {
    font-size: 1.2em;
    margin-bottom: 5px;
  }
  .people p {
    margin: 5px 0;
  }
</style>
  </head>
  <body>`;
  data.results.forEach(people => {
    htmlcontent+=`<div class="people">
    <form action="/favorites" method="POST">
      <h2>Name: ${people.name}</h2>
      <input type="hidden" name="name" value="${people.name}">
      <p>Height: ${people.height}</p>
      <p>Mass: ${people.mass}</p>
      <p>Gender: ${people.gender}</p>
      <input type="hidden" name="type" value="character">
      <input type="hidden" name="url" value="${people.url}">
      <button type="submit">Add to Favorites</button>
    </form>
  </div>`;
  });
  
htmlcontent += `
</body>
</html>`
return htmlcontent;
}



app.get('/favorites', async (req, res) => {
  await Favorite.find({}, (err, favorites) => {
      if (err) {
          return res.status(400).json({ success: false, error: err })
      }
      if (!favorites.length) {
          return res
              .status(404)
              .json({ success: false, error: `Favorite not found` })
      }
      return res.status(200).json({ success: true, data: favorites })
  }).catch(err => console.log(err))});

mongoose.connect(
  'mongodb://mongo:27017/swfavorites',
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      app.listen(3000);
    }
  }
);

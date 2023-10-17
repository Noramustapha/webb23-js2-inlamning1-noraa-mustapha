

const fs = require('fs');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


let highscoreData = loadHighscores();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


app.get('/api/highscores', (req, res) => {
  const sortedHighscores = highscoreData.slice(0, 5);
  res.json(sortedHighscores);
});


app.post('/api/highscores', (req, res) => {
  const { name, score } = req.body;


  highscoreData.push({ name, score });


  highscoreData.sort((a, b) => b.score - a.score);

  
  highscoreData.splice(5);

 
  saveHighscores(highscoreData);

  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

function loadHighscores() {
  try {
    const data = fs.readFileSync('backend/data/highscores.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading highscores:', error);
    return [];
  }
}

function saveHighscores(highscores) {
  try {
    fs.writeFileSync('backend/data/highscores.json', JSON.stringify(highscores, null, 2));
  } catch (error) {
    console.error('Error saving highscores:', error);
  }
}


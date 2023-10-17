let userScore = 0;
let computerScore = 0;
let userName = '';
let currentWinStreak = 0;
let highscore = 0;

const userScore_span = document.getElementById('user-score');
const result_div = document.querySelector('.result');
const playerName_span = document.getElementById('playerInfo');
const restartButton = document.getElementById('restart-button');
const highscoreList = document.getElementById('highscore-list');

const highscores = [];

const rock_div = document.getElementById('rock');
const paper_div = document.getElementById('paper');
const scissors_div = document.getElementById('scissors');

function updatePlayerInfo() {
  playerName_span.textContent = `Spelare: ${userName} | Poäng: ${userScore}`;
}

function submitForm() {
  const nameInput = document.getElementById('nameInput');
  userName = nameInput.value;
  alert('Hej, ' + userName + '!');
  nameInput.disabled = true;
  document.body.style.display = 'block';
  updatePlayerInfo();
  startGame();
}

function startGame() {
  updatePlayerInfo();
}

function win(user, computer) {
  userScore++;
  userScore_span.textContent = userScore;
  result_div.innerHTML = `<p>${convertCase(user)} ${userName} besegrar ${convertCase(computer)}. Du vinner!</p>`;
  currentWinStreak++;
  if (currentWinStreak > highscore) {
    highscore = currentWinStreak;
    highscores.push({ name: userName, score: highscore });
  }
  updatePlayerInfo();
  updateHighscoreList();
}

function getAndDisplayHighscores() {
  fetch('http://localhost:3000/api/highscores')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Något gick fel');
      }
      return response.json();
    })
    .then((data) => {
      highscores.length = 0; 
      highscores.push(...data); 
      updateHighscoreList();
    })
    .catch((error) => {
      console.error('Fel vid GET-förfrågan:', error);
    });
}

function updateHighscoreList() {
  highscores.sort((a, b) => b.score - a.score); 
  highscoreList.innerHTML = ''; 

  
  highscores.slice(0, 5).forEach((entry, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${index + 1}. ${entry.name}: ${entry.score}`;
    highscoreList.appendChild(listItem);
  });
}

function getComputerChoice() {
  const choices = ['rock', 'paper', 'scissors'];
  const weights = [0.1, 0.8, 0.1]; 
  
  
  const random = Math.random();
  

  let cumulativeWeight = 0;
  for (let i = 0; i < choices.length; i++) {
    cumulativeWeight += weights[i];
    if (random < cumulativeWeight) {
      return choices[i];
    }
  }
  

  return choices[Math.floor(Math.random() * choices.length)];
}


function convertCase(choice) {
  switch (choice) {
    case 'rock':
      return 'Rock';
    case 'paper':
      return 'Paper';
    case 'scissors':
      return 'Scissors';
    default:
      return '';
  }
}



function showChoiceImages(userChoice, computerChoice) {
  const playerChoiceImg = document.getElementById('player-choice-img');
  const computerChoiceImg = document.getElementById('computer-choice-img');

  playerChoiceImg.src = getChoiceImage(userChoice);
  playerChoiceImg.alt = convertCase(userChoice) + userName;

  computerChoiceImg.src = getChoiceImage(computerChoice);
  computerChoiceImg.alt = convertCase(computerChoice) + 'Computer';
}

function getChoiceImage(choice) {
  switch (choice) {
    case 'rock':
      return 'jpeg/Rock.svg';
    case 'paper':
      return 'jpeg/Paper.svg';
    case 'scissors':
      return 'jpeg/Scissors.svg';
    default:
      return '';
  }
}

function draw(user, computer) {
  result_div.innerHTML = `<p>It's a draw! You both chose ${convertCase(user)}.</p>`;
  updateRoundStatus(user, 'drawingStyles');
  updatePlayerInfo();
}


const startButton = document.getElementById('start-button');
startButton.addEventListener('click', () => {
  submitForm();
});



window.onload = getAndDisplayHighscores;

function lose(user, computer) {
computerScore++;
 userScore = 0; 
currentWinStreak = 0; 
userScore_span.textContent = userScore;
result_div.innerHTML = `<p>${convertCase(computer)} beats ${convertCase(user)}${userName}. You lose!</p>`;
updateRoundStatus(user, 'losingStyles');
endGame(false);
getAndDisplayHighscores();
updatePlayerInfo();
}

function game(userChoice) {
  const computerChoice = getComputerChoice();
  showChoiceImages(userChoice, computerChoice);
  switch (userChoice + computerChoice) {
    case 'paperrock':
    case 'rockscissors':
    case 'scissorspaper':
      win(userChoice, computerChoice);
      break;
    case 'rockpaper':
    case 'scissorsrock':
    case 'paperscissors':
      lose(userChoice, computerChoice);
      break;
    case 'rockrock':
    case 'scissorsscissors':
    case 'paperpaper':
      draw(userChoice, computerChoice);
      break;
  }
}

const nameInput = document.getElementById('nameInput');


nameInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
   
    submitForm();
  }
});


function endGame() {
  const postData = {
    name: userName,
    score: highscore,
  };

  fetch('http://localhost:3000/api/highscores', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  })
    .then((response) => {
      if (response.ok) {
        getAndDisplayHighscores();
      }
    })
    .catch((error) => console.error('Fel vid POST-förfrågan:', error));
}

  

function restartGame() {
  userScore = 0;
  computerScore = 0;
  userScore_span.textContent = userScore;
  result_div.innerHTML = '';
  restartButton.disabled = true;
  enableButtons();
}
function enableButtons() {
  rock_div.addEventListener('click', rockClickHandler);
  paper_div.addEventListener('click', paperClickHandler);
  scissors_div.addEventListener('click', scissorsClickHandler);
}

function updateRoundStatus(choice, statusClass) {
  const roundStatus = document.getElementById(choice);
  roundStatus.classList.add(statusClass);
  setTimeout(() => roundStatus.classList.remove(statusClass), 300);
}

{
  rock_div.removeEventListener('click', rockClickHandler);
  paper_div.removeEventListener('click', paperClickHandler);
  scissors_div.removeEventListener('click', scissorsClickHandler);
}

function disableButtons() {
  rock_div.removeEventListener('click', rockClickHandler);
  paper_div.removeEventListener('click', paperClickHandler);
  scissors_div.removeEventListener('click', scissorsClickHandler);
}

function rockClickHandler() {
  game('rock');
}

function paperClickHandler() {
  game('paper');
}

function scissorsClickHandler() {
  game('scissors');
}

enableButtons();

const postData = {
  name: userName,
  score: userScore,
};

fetch('http://localhost:3000/api/highscores')
.then((response) => {
  if (!response.ok) {
    throw new Error('Något gick fel');
  }
  return response.json();
})
.then((highscores) => {
  console.log(highscores);
})
.catch((error) => {
  console.error('Fel vid GET-förfrågan:', error);
});




 fetchHighscoresButton.addEventListener('click', getAndDisplayHighscores);



































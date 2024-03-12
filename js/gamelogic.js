const boardElement = document.querySelector('.scrabble-board');
  
const specialCells = {
  TW: ['A1', 'H1', 'O1', 'A8', 'O8', 'A15', 'H15', 'O15'],
  DL: ['D1', 'L1', 'G3', 'I3', 'A4', 'H4', 'O4', 'C7', 'G7', 'I7', 'M7', 'D8', 'L8', 'C9', 'G9', 'I9', 'M9', 'A12', 'H12', 'O12', 'G13', 'I13', 'D15', 'L15'],
  DW: ['B2', 'N2', 'C3', 'M3', 'D4', 'L4', 'E5', 'K5', 'E11', 'K11', 'D12', 'L12', 'C13', 'M13', 'B14', 'N14'],
  TL: ['F2', 'J2', 'B6', 'F6', 'J6', 'N6', 'B10', 'F10', 'J10', 'N10', 'F14', 'J14'],
  STAR: ['H8'] // Add this line
};

function createCell(row, col) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  const colLetter = String.fromCharCode('A'.charCodeAt(0) + col ); // Adjusted to correct column letter calculation
  cell.setAttribute('data-col', colLetter); // Use the letter for columns
  cell.setAttribute('data-row', row + 1); // Rows are 1-indexed

  // Initialize label text as empty
  let labelText = '';

  // Add class based on specialCells mapping
  const cellNotation = `${colLetter}${row + 1}`;
  for (const [type, cells] of Object.entries(specialCells)) {
    if (cells.includes(cellNotation)) {
      cell.classList.add(type);
      labelText = type; // Set the label text to the special cell type
      break; // Exit the loop once a match is found
    }
  }

  // Special condition for H8 cell
  if (cellNotation === "H8") {
    cell.classList.add('STAR'); // Use a class that you will define in CSS
    labelText = '★'; // Star symbol
  }

  // If the cell is a special cell or the H8 cell, append the label
  if (labelText) {
    // Create a span element for the label
    const label = document.createElement('span');
    label.textContent = labelText; // Set the text to the special cell type or star symbol
    label.classList.add('cell-label'); // Add a class for styling (optional)
    cell.appendChild(label);
  }

  return cell;
}


// Create the board
for (let row = 0; row < 15; row++) {
  for (let col = 0; col < 15; col++) {
    boardElement.appendChild(createCell(row, col));
  }
}

const letters = [
  'අ', 'ඉ', 'උ', 'එ', 'ඔ', 'ක', 'ඛ', 'ග', 'ඝ', 'ත', 'ර', 'ම', 'ස්', 'ති', 'ණ', 'තූ', 'ස', 'ය', 'ට', 'න', 'යි', 'සු', 'ප', 'හ', 'ව', 'ල', 'රා', 'වි', 'වා', 'ද', 'ව', 'යු', 'ය', 'ර', 'ව', 'ර', 'ය', 'ස', 'ය'
];
const letterValues = {
  'අ': 1, 'ඉ': 2, 'උ': 3, 'එ': 4, 'ඔ': 5,
  'ක': 6, 'ඛ': 7, 'ග': 8, 'ඝ': 9, 'ත': 10,
  'ර': 6, 'ම': 2, 'ස්': 3, 'ති': 4, 'ණ': 5,
  'තූ': 6, 'ස': 8, 'ය': 9, 'ට': 9, 'න': 10,
  'යි': 1, 'සු': 2, 'ප': 3, 'හ': 4, 'ව': 5,
  'ල': 6, 'රා': 7, 'වි': 8, 'වා': 9, 'ද': 10,
  'යු': 2
};

const letterBoard = document.querySelector('.letter-board');
let draggableLetter = null;

function createLetterTile(letter) {
  const tile = document.createElement('div');
  tile.classList.add('letter', 'draggable');
  tile.setAttribute('draggable', true);

  // Create a span for the letter itself
  const letterSpan = document.createElement('span');
  letterSpan.classList.add('letter-text'); // Add class to identify the letter
  letterSpan.textContent = letter;
  tile.appendChild(letterSpan);

  // Create a span for the letter value, this will be the subscript
  const valueSpan = document.createElement('span');
  valueSpan.textContent = letterValues[letter];
  valueSpan.classList.add('letter-value'); // A class to style the value span
  tile.appendChild(valueSpan);

  // Drag events
  tile.addEventListener('dragstart', (e) => {
    draggableLetter = e.target;
  });

  tile.addEventListener('dragend', () => {
    draggableLetter = null;
  });

  return tile;
}

function populateLetterBoard() {
letterBoard.innerHTML = ''; // Clear the letter board
const shuffledLetters = letters.sort(() => 0.5 - Math.random());
for (let i = 0; i < 5; i++) {
letterBoard.appendChild(createLetterTile(shuffledLetters[i]));
}
}

// Initial population of the letter board
populateLetterBoard();

// Drag over event for the scrabble board
boardElement.addEventListener('dragover', (e) => {
e.preventDefault(); // This allows us to drop.
});

let placedLetters = {};
boardElement.addEventListener('drop', (e) => {
  e.preventDefault();
  const targetCell = e.target.closest('.cell'); // Ensure we're targeting a cell

  if (draggableLetter && targetCell && !targetCell.classList.contains('occupied')) {
    // Extract the letter and value from the draggable letter
    const letter = draggableLetter.querySelector('.letter-text').textContent;
    const value = draggableLetter.querySelector('.letter-value').textContent;

    // Clear the cell's text content first
    targetCell.textContent = ''; // Clear the cell's text content first
    targetCell.classList.add('occupied'); // Mark the cell as occupied

    // Record the placed letter
  const cellNotation = getCellNotation(targetCell); // Assuming you have implemented this function
  placedLetters[cellNotation] = letter;

  // Check if this drop completes and correctly fills any block
    checkBlockCompletionAndCorrectness();

    function checkBlockCompletionAndCorrectness() {
      Object.entries(predefinedBlocks).forEach(([blockName, cells]) => {
        const isComplete = cells.every(cell => cell in placedLetters);
        if (isComplete) {
          const isCorrect = cells.every(cell => predefinedCells[cell]?.letter === placedLetters[cell]);
          if (!isCorrect) {
            alert(`Warning: Letters you dropped does not match for the predefined words.`);
          }
        }
      });
    }

    

    // Create and append the letter span
    const letterSpan = document.createElement('span');
    letterSpan.textContent = letter;
    targetCell.appendChild(letterSpan);

      // Create and append the value span for the subscript
    const valueSpan = document.createElement('span');
    valueSpan.classList.add('letter-value');
    valueSpan.textContent = value;
    targetCell.appendChild(valueSpan); // Append the value span to the target cell



    draggableLetter.remove(); // Remove the original tile from the letter board
  } else {
    console.log('This cell is already occupied or not a valid drop target.');
  }
});

function populatePredefinedCells() {
  const predefinedCells = {
    "D3": {"letter": "ති", "value": 4},
    "E3": {"letter": "ර", "value": 6},
    "F3": {"letter": "ස", "value": 8},
  };

  Object.keys(predefinedCells).forEach(cellNotation => {
    const cell = document.querySelector(`.cell[data-col="${cellNotation[0]}"][data-row="${cellNotation.substring(1)}"]`);
    if (cell) {
      const { letter, value } = predefinedCells[cellNotation];
      console.log(`Populating ${cellNotation} with letter ${letter} and value ${value}`); // Debug log

      // Reset the cell's inner HTML
      cell.innerHTML = `<span class="letter-text">${letter}</span><span class="letter-value">${value}</span>`;

      cell.classList.add('occupied');
    } else {
      console.log(`Cell ${cellNotation} not found.`); // Debug log for missing cells
    }
  });
}

populatePredefinedCells();


// Button to get new tiles
document.getElementById('new-tiles').addEventListener('click', populateLetterBoard);

import { predefinedCells } from './predefinedCellsData.js';



const predefinedBlocks = {
  Block1: ['B1', 'C1'],
  Block2: ['C2', 'D2', 'E2'],
  Block3: ['A2', 'A3'],
  Block4: ['A3', 'B3', 'E2'],
  Block5: ['F11', 'G11', 'H11','I11', 'J11'],
  Block6: ['D3', 'E3', 'F3'],
  Block7: ['K1', 'K2', 'K3', 'K4'],
  // Add more blocks here
};



  


let userScore = 0;
let computerScore = 0;
let currentPlayer = "user"; // Initialize the turn to user

function updateScore(player, score) {
  if (player === "user") {
    userScore += score;
    document.getElementById("user-score").textContent = userScore;
  } else {
    computerScore += score;
    document.getElementById("computer-score").textContent = computerScore;
  }
}


function switchTurn() {
  currentPlayer = (currentPlayer === "user") ? "computer" : "user";
  updateTurnIndicator(currentPlayer);
  document.getElementById('switchToAITurn').disabled = (currentPlayer === "computer");
}

if (currentPlayer === "user") {
  document.getElementById('switchToAITurn').disabled = false;
}
// Assuming your button has the ID 'switchToAITurn'
document.getElementById('switchToAITurn').addEventListener('click', function() {
  switchTurn(); // Switch turns when the button is clicked
  if (currentPlayer === "computer") {
    setTimeout(computerTurn, 5000); // Trigger the computer's turn with a delay
  }
  this.disabled = true; // Optionally disable the button
});


boardElement.addEventListener('drop', (e) => {
  updateScore("user", 10);
}
);
function updateScoreboardAppearance() {
  const userScoreboard = document.getElementById('scoreboard').children[0]; // User's scoreboard
  const aiScoreboard = document.getElementById('scoreboard').children[1]; // AI's scoreboard

  if (currentPlayer === "user") {
      userScoreboard.classList.add('active-player');
      userScoreboard.classList.remove('inactive-player');
      aiScoreboard.classList.remove('active-player');
      aiScoreboard.classList.add('inactive-player');
  } else {
      aiScoreboard.classList.add('active-player');
      aiScoreboard.classList.remove('inactive-player');
      userScoreboard.classList.remove('active-player');
      userScoreboard.classList.add('inactive-player');
  }
}

function checkGameOver() {
  const unoccupiedCells = document.querySelectorAll('.cell:not(.occupied)');
  if (unoccupiedCells.length === 0) {
      console.log('Game over!');
      // Here, implement any end-of-game logic, such as displaying a message
      return true;
  }
  return false;
}


function computerTurn() {
  console.log("Computer's turn started");
  const unoccupiedCells = Array.from(document.querySelectorAll('.cell:not(.occupied)'));
  if (unoccupiedCells.length === 0) {
    console.log('Game over, no more moves!');
    return;
  }

  // Generate a random cell from predefinedCellspredefinedCells
  const predefinedCellKeys = Object.keys(predefinedBlocks);
  const randomCellIndex = Math.floor(Math.random() * predefinedCellKeys.length);
  const randomCellKey = predefinedCellKeys[randomCellIndex];
  const cellData = predefinedBlocks[randomCellKey];

  cellData?.map((item) =>{
    predefinedCells[`${item}`]
    console.log("wow", predefinedCells[`${item}`])
    let letter = predefinedCells[`${item}`]
    const cellElement = document.querySelector(`[data-col="${item[0]}"][data-row="${item.substring(1)}"]`);
    if (cellElement && !cellElement.classList.contains('occupied')) {
      cellElement.textContent = ''; // Clear any existing content
  
      // Create and append the letter span
      const letterSpan = document.createElement('span');
      letterSpan.textContent = letter.letter;
      cellElement.appendChild(letterSpan);
  
      // Create and append the value span for the subscript
      const valueSpan = document.createElement('span');
      valueSpan.classList.add('letter-value');
      valueSpan.textContent = letter.value;
      cellElement.appendChild(valueSpan);
  
      cellElement.classList.add('occupied');
      updateScore("computer", 10);
      console.log(`Computer's turn placed ${letter.letter} on ${item} and scored 10 points.`);
    }

    
  })
 

  if (!checkGameOver()) {
    switchTurn();
    document.getElementById('switchToAITurn').disabled = false;
  }
}

function updateTurnIndicator(currentPlayer) {
  const userTurnElement = document.getElementById('user-turn');
  const aiTurnElement = document.getElementById('ai-turn');

  if (currentPlayer === "user") {
    userTurnElement.classList.add('turn-active');
    userTurnElement.classList.remove('turn-inactive');
    aiTurnElement.classList.remove('turn-active');
    aiTurnElement.classList.add('turn-inactive');
  } else {
    aiTurnElement.classList.add('turn-active');
    aiTurnElement.classList.remove('turn-inactive');
    userTurnElement.classList.remove('turn-active');
    userTurnElement.classList.add('turn-inactive');
  }
}




boardElement.addEventListener('drop', (e) => {
  e.preventDefault();
  if (currentPlayer !== "user") return; // Only proceed if it's the user's turn

  const targetCell = e.target.closest('.cell');
  if (targetCell && !targetCell.classList.contains('occupied')) {
      const letter = draggableLetter.querySelector('.letter-text').textContent;
      const randomScore = Math.floor(Math.random() * 10) + 1; // Random score between 1-10

      // Update the cell with the dropped letter
      targetCell.innerHTML = `<span>${letter}</span><span class="letter-value">${randomScore}</span>`; // Also show the score on the board
      targetCell.classList.add('occupied');

      // Update user's score with the random score
      updateScore("user", randomScore);

      draggableLetter.remove(); // Remove the letter from the board

      // Enable the switchToAITurn button to allow manual switch to AI turn
      document.getElementById('switchToAITurn').disabled = false;
  }

  // Do not automatically switch turns. The turn will now only switch when the button is clicked.
  // Removed switchTurn() from here to prevent automatic turn switching
});






function getCellNotation(cell) {
  const col = cell.getAttribute('data-col');
  const row = cell.getAttribute('data-row');
  return `${col}${row}`;
}



// Existing call to populateLetterBoard and other initialization code
populateLetterBoard();

document.getElementById('view-instructions').addEventListener('click', function() {
  var instructionsContainer = document.getElementById('instructions-container');
  if (instructionsContainer.style.display === "none") {
    instructionsContainer.style.display = "block"; // Show instructions
  } else {
    instructionsContainer.style.display = "none"; // Hide instructions
  }
});

let timeLeft = 10 * 60; // 10 minutes in seconds
const timerElement = document.getElementById('timer');

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerElement.textContent = `Time Left: ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    if (timeLeft <= 0) {
        clearInterval(timerInterval); // Stop the timer
        determineWinner(); // Determine the winner
    } else {
        timeLeft--; // Decrement the timer
    }
}

const timerInterval = setInterval(updateTimer, 1000); // Update the timer every second

function determineWinner() {
    const userScore = parseInt(document.getElementById('user-score').textContent, 10);
    const computerScore = parseInt(document.getElementById('computer-score').textContent, 10);
    let winnerMessage = "It's a tie!";
    if (userScore > computerScore) {
        winnerMessage = "User wins!";
    } else if (computerScore > userScore) {
        winnerMessage = "Computer wins!";
    }
    // Display the winner message
    alert(winnerMessage); // Or update the DOM with the winner message
}

// Predefined dictionary of words and their meanings
const dictionary = {
  "අපේ": "Our",
  "ගෙදර": "පෞද්ගලික වාසස්ථානය",
  // Add more words and meanings here
};

function findMeaning() {
  const wordInput = document.getElementById("wordInput").value; // Get the input value
  const meaningDiv = document.getElementById("meaning"); // Get the div where the meaning will be displayed

  if (wordInput in dictionary) {
      // If the word is found in the dictionary, display its meaning
      meaningDiv.textContent = `Meaning: ${dictionary[wordInput]}`;
  } else {
      // If the word is not found, inform the user
      meaningDiv.textContent = "එවැනි වචනයක් ශබ්දකෝෂයේ නොමැත.";
  }
}

// Initialize the turn indicator to reflect the starting player
updateTurnIndicator("user");

document.getElementById('cheat-sheet-btn').addEventListener('click', function(event) {
  var cheatSheetContainer = document.getElementById('cheat-sheet-container');
  var isDisplayed = cheatSheetContainer.style.display === "block";
  cheatSheetContainer.style.display = isDisplayed ? "none" : "block";
  event.stopPropagation(); // Prevent the document click handler from immediately hiding the cheat sheet
});

document.addEventListener('click', function() {
  var cheatSheetContainer = document.getElementById('cheat-sheet-container');
  if (cheatSheetContainer.style.display === "block") {
    cheatSheetContainer.style.display = "none";
  }
});

// Prevent hiding when clicking within the cheat sheet container
document.getElementById('cheat-sheet-container').addEventListener('click', function(event) {
  event.stopPropagation();
});



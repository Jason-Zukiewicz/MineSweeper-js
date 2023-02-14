let bombCount = 0;
let flagCount = 0;
let score = 0;
let shownCount = 0;

let board;
let ROWS;
let COLS;
let DIFF;

function clickEvent(event) {  
  switch (event.button){
    case 0: // left mouse 
      console.log("LeftMouse");
      leftClick(event.target.id);
      break;
    case 1: // middle mouse
      console.log("MiddleMouse");
      break;
    case 2: // right mouse
      console.log("RightMouse");
      rightClick(event.target.id);
      break;
    default:
      console.log('Unknown button: ' + event.button);
      return;
  }
}



function leftClick(id){
  let cell = document.getElementById(id);
  switch(cell.classList[0]) {
    case 'shown':
      return;
    case 'flag':
      return;
    case 'hidden':
      console.log("cell was hidden");
      cell.setAttribute('class', 'shown');
      let value = parseInt(cell.textContent);
      if(value == -1){
        if (shownCount == 0){ // this is the first click
          console.log("first click"); 
          clearContent();
          startGame();
          // todo: remove first board
        }
        else
          endGame(false);
      }
      else{
        updateScore(value);
        shownCount++;
        if(shownCount == bombCount)
          endGame(true);
      }
      break;
    default:
      console.log('Unknown cell class');
      break;
  }
}

function rightClick(id){
  let cell = document.getElementById(id);
  switch(cell.classList[0]) {
    case 'shown':
      return;
    case 'flag':
      cell.setAttribute('class', 'hidden');
      flagCount--;
      break;
    case 'hidden':
      cell.setAttribute('class', 'flag');
      flagCount++;
      if(flagCount == bombCount)
        endGame(true);
      break;
    case 'bomb':
      break;
    default:
      console.log('Unknown cell class');
      break;
  }
}

function updateScore(value){
  score += value;
  document.getElementById('score').textContent = "Score: " + score;
}

function updateBombs(){
  document.getElementById('bombs').textContent = "Bombs: " + bombCount;
}

function clearContent(){
  let content = document.getElementById('content');
  while(content.firstChild)
    content.removeChild(content.firstChild);
}

function createTable(){
  let table = document.createElement('table');
  
  ROWS = board.length;
  COLS = board[0].length;
  for(let r = 0; r < ROWS; r++){
    let row = document.createElement('tr');// TODO: dont like this name
      
    for(let c = 0; c < COLS; c++){
      let cell = document.createElement('td');
      let value = board[r][c];
      cell.setAttribute('id', `${r}-${c}`);
      cell.classList.add("hidden")
      cell.textContent = value;
      cell.onclick = clickEvent;
      row.appendChild(cell);
    }
    table.appendChild(row);
  }
  let content = document.getElementById('content');
  content.appendChild(table);
} 


// NOT WORKING CORRECTLY
function createBoard(ROWS, COLS, diff=20) {
  board = new Array(ROWS);
  for (let i = 0; i < ROWS; i++) {
    board[i] = new Array(COLS).fill(0);
  }
  // TODO: Fill in board
  for(let r = 0; r < ROWS; r++) {
    for(let c = 0; c < COLS; c++) {
      let randomNum = Math.random() * (100 - 0) + 0;
      if(randomNum < diff ) {
        board[r][c] = -1;
        bombCount++;
        // Calculate neighbors
        for(let rOff = -1; rOff < 2; rOff++){
          let rCell = r + rOff;
          if(rCell >= 0 && rCell < ROWS){
            for(let cOff = -1; cOff < 2; cOff++){
              let cCell = c + cOff;
              if(cCell >= 0 && cCell < COLS){
                let value = board[rCell][cCell];
                if(value != -1)
                  board[rCell][cCell]++; 
                
              }
            }
          }
        }
      }
    }
  }
  return board;
}

function showBoard(){
  for(let r = 0; r < ROWS; r++) {
    for(let c = 0; c < COLS; c++) {
      let cell = document.getElementById(`${r}-${c}`);
      cell.setAttribute('class', 'shown');
    }
  }
}

function showScoreBoard(win){
  let popup = document.createElement('div');
  popup.setAttribute('class', 'popup');
  popup.setAttribute('id', 'popup');

  let victory = document.createElement('h1');
  victory.textContent = win? "You Win!" : "You Lose!";
  popup.appendChild(victory);

  let score = document.createElement('h1');
  score.textContent = "Score: " + score;
  popup.appendChild(score);

  document.body.appendChild(popup);
}

function endGame(win){
  showBoard();
  showScoreBoard(win);  
}

function startGame(){
  createBoard(10,10,20);
  createTable();
  updateBombs();
}

document.addEventListener('DOMContentLoaded', () => {
  startGame();
})

window.addEventListener('contextmenu', (event) => {
  event.preventDefault()
  clickEvent(event);
})


// Dont need to a seperate class for board
// just store it as an array
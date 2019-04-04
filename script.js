class Game {
  constructor({ element }) {
    this.allLabyrinth = Array(20).fill('').map(el => Array(20).fill('').map(_ => {
      return {
        start: false,
        finish: false,
        block: false,
        empty: false,
        number: '',
        passed: false,
      }
    }));
    this.setButton = { play: false, start: false, finish: false, block: false }
    this.element = element;
    this.pS = { Y: 7, X: 9 };
    this.pF = { Y: 0, X: 5 }; // для возврата
    this.pFb = { Y: 15, X: 9 }; // для текущего положения финиш
    this.numberInPosition = 0; // цифра финиша

    this.allLabyrinth[this.pS.Y][this.pS.X].start = true;
    this.allLabyrinth[this.pS.Y][this.pS.X].number = 0;
    this.allLabyrinth[this.pFb.Y][this.pFb.X].finish = true;

    //this.allLabyrinth[0][3].block = true;
   
    this.allLabyrinth[10][4].block = true;
    this.allLabyrinth[10][5].block = true;
    this.allLabyrinth[10][6].block = true;
    this.allLabyrinth[10][7].block = true;
    this.allLabyrinth[10][8].block = true;
    this.allLabyrinth[10][9].block = true;
    this.allLabyrinth[10][10].block = true;
    this.allLabyrinth[10][11].block = true;
    this.allLabyrinth[10][12].block = true;
    this.allLabyrinth[10][13].block = true;
    this.allLabyrinth[10][14].block = true;
    this.allLabyrinth[10][15].block = true;

    this.render();
    
  
    element.addEventListener('click', event => {
      if (event.target.id === 'play') { 
        this.setButton = { play: false, start: false, finish: false, block: false }

        for (let i = 0; i < this.allLabyrinth.length; i++) {
          for (let ii = 0; ii < this.allLabyrinth[i].length; ii++) {
            this.allLabyrinth[i][ii].number = ''
            this.allLabyrinth[i][ii].passed = false;
            this.allLabyrinth[i][ii].finish = false;
          }
        }
        this.allLabyrinth[this.pS.Y][this.pS.X].number = 0;
        this.allLabyrinth[this.pFb.Y][this.pFb.X].finish = true;

        this.startGame(); 
      }
      if (event.target.id === 'block') {
        this.setButton = { play: false, start: false, finish: false, block: true }
      }
      if (event.target.id === 'start') {
        this.setButton = { play: false, start: true, finish: false, block: false }
      }
      if (event.target.id === 'finish') {
        this.setButton = { play: false, start: false, finish: true, block: false }
      }

//////////////////////////////////////////////////////////////////////////////////////
      if (this.setButton.block && event.target.dataset.number) {
        let [Y, X] = event.target.dataset.number.split(' '); 
        this.allLabyrinth[Y][X].block = true;
      }

      if (this.setButton.start && event.target.dataset.number) {
        let [Y, X] = event.target.dataset.number.split(' '); 
        this.allLabyrinth[this.pS.Y][this.pS.X].start = false;
        this.allLabyrinth[this.pS.Y][this.pS.X].number = '';
        this.pS.Y = Y;
        this.pS.X = X;

        this.allLabyrinth[Y][X].start = true;
        this.allLabyrinth[Y][X].number = 0;
      }
      //console.log(event.target.dataset.finish)
      if (this.setButton.finish && event.target.dataset.number) {
        
        let [Y, X] = event.target.dataset.number.split(' '); 
        this.allLabyrinth[this.pFb.Y][this.pFb.X].finish = false;
       
        this.pFb.Y = Y;
        this.pFb.X = X;

        this.allLabyrinth[Y][X].finish = true;
      }

      this.render()
     })
  }
 
  render() {
    let string = `
      <button id="play">find</button>
      <button id="block">block</button>
      <button id="start">start</button>
      <button id="finish">finish</button>
      <div id="game">`;
    
    for (let i = 0; i < this.allLabyrinth.length; i++) {
      for (let ii = 0; ii < this.allLabyrinth[i].length; ii++) {
        let setClass = 'square ';
        
        this.allLabyrinth[i][ii].start ? setClass += ' start' : '';
        this.allLabyrinth[i][ii].finish ? setClass += ' finish' : '';
        this.allLabyrinth[i][ii].block ? setClass += ' block' : '';
        this.allLabyrinth[i][ii].empty ? setClass += ' empty' : '';
        this.allLabyrinth[i][ii].passed ? setClass += ' passed' : '';
        string += `<div data-number="${i} ${ii}" class="${setClass}">${this.allLabyrinth[i][ii].number}</div>`
      }
    }
    this.element.innerHTML = string + `</div>`
  }

  setNumber() { // оцифровуем поле
    for (let i = 0; i < this.allLabyrinth.length; i++) {
      for (let ii = 0; ii < this.allLabyrinth[i].length; ii++) {
        if (this.allLabyrinth[i][ii].finish === true) this.pF = { Y: i, X: ii };
        let resolutionSquare = this.checkSquareAround(i, ii);
        for (let key of resolutionSquare) {
          switch (key) {
            case 'left': this.allLabyrinth[i][ii - 1].number = this.allLabyrinth[i][ii].number + 1;
              break;
            case 'right': this.allLabyrinth[i][ii + 1].number = this.allLabyrinth[i][ii].number + 1;
              break;
            case 'bottom': this.allLabyrinth[i + 1][ii].number = this.allLabyrinth[i][ii].number + 1;
              break;
            case 'top': this.allLabyrinth[i - 1][ii].number = this.allLabyrinth[i][ii].number + 1;
              break;
          }
        }
      }
    }
    if (this.checkClearSquare() === true) {
      this.setNumber()
    } else {
      this.backToStart()
    }
  }

  backToStart() { // возврат с финиша к началу и походу помечаем путь
    while(true) {
      if (this.allLabyrinth[this.pF.Y][this.pF.X].number === 0) break;
      
      this.numberInPosition = this.allLabyrinth[this.pF.Y][this.pF.X].number;
     
        if (this.pF.X !== 0 && this.allLabyrinth[this.pF.Y][this.pF.X - 1].number === this.numberInPosition - 1) {
          this.pF.X = this.pF.X - 1;
        }
        if (this.pF.X !== 19 && this.allLabyrinth[this.pF.Y][this.pF.X + 1].number === this.numberInPosition - 1) {
          this.pF.X = this.pF.X + 1;
        }
        if (this.pF.Y !== 19 && this.allLabyrinth[this.pF.Y + 1][this.pF.X].number === this.numberInPosition - 1) {
          this.pF.Y = this.pF.Y + 1;
        }
        if (this.pF.Y !== 0 && this.allLabyrinth[this.pF.Y - 1][this.pF.X].number === this.numberInPosition - 1) {
          this.pF.Y = this.pF.Y - 1;
      }
      if ( this.numberInPosition > 1) this.allLabyrinth[this.pF.Y][this.pF.X].passed = true;
    }
    this.render()
  }

  checkClearSquare() { // проверка поля на пустые ячейки для заполнения чисел
    let count = 0;
    for (let i = 0; i < this.allLabyrinth.length; i++) {
      for (let ii = 0; ii < this.allLabyrinth[i].length; ii++) {
        if (this.allLabyrinth[i][ii].number === ''
          && this.allLabyrinth[i][ii].block === false) {
          count++;
        }
      }
    }
    return count > 0;
  }

  checkSquareAround(Y, X) { // получаем список возможных ходов для одной ячейки 
    let arrCheck = []
    if (this.allLabyrinth[Y][X].block === true
      || this.allLabyrinth[Y][X].number === '') {
      return [];
    }
    if (X !== 0) {
      if (this.allLabyrinth[Y][X - 1].number === ''
        && this.allLabyrinth[Y][X - 1].block === false
        && this.allLabyrinth[Y][X - 1].number === '')
        arrCheck.push('left')
    }
    if (X !== 19) {
      if (this.allLabyrinth[Y][X + 1].number === ''
        && this.allLabyrinth[Y][X + 1].block === false
        && this.allLabyrinth[Y][X + 1].number === '')
        arrCheck.push('right')
    }
    if (Y !== 19) {
      if (this.allLabyrinth[Y + 1][X].number === ''
        && this.allLabyrinth[Y + 1][X].block === false
        && this.allLabyrinth[Y + 1][X].number === '')
        arrCheck.push('bottom')
    }
    if (Y !== 0) {
      if (this.allLabyrinth[Y - 1][X].number === ''
        && this.allLabyrinth[Y - 1][X].block === false
        && this.allLabyrinth[Y - 1][X].number === '')
        arrCheck.push('top')
    }
    return arrCheck || [];
  }

  startGame() {
    this.setNumber()
    this.render()
  }
}

let game = new Game({ element: document.querySelector('#root') })



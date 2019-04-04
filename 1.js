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
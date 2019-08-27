import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import {GameService} from '../game.service';
import {MatchService} from '../match.service';
import * as $ from 'jquery';
import {PairGame} from '../models/PairGame';
import { pairs } from 'rxjs';
import {User} from '../user.model';

@Component({
  selector: 'app-game-pairs',
  templateUrl: './game-pairs.component.html',
  styleUrls: ['./game-pairs.component.css']
})
export class GamePairsComponent implements OnInit {

  @Input() pairGames : PairGame[];
  @Input() rightColumns : string[][];
  @Input() isBlue : boolean;
  @Output() notify = new EventEmitter<any>();
  pairs  : string[][] = [];
  solutions : string[] = [];
  currentRow : number = 0;
  myPoints : number = 0;
  opponentPoints : number = 0;
  timePercent : number = 0;
  counterID : any;
  description : string;
  socket : any;
  redPlayer : User;
  bluePlayer : User;
  scoredLeft : boolean[] = [];
  scoredRight : boolean[] = [];
  myGame : boolean;
  onTurn : boolean;

  constructor(private gameService : GameService, private matchService : MatchService) { }

  ngOnInit() {
    if (this.isBlue) {
      this.myGame = true;
      this.onTurn = true;
    }
    else {
      this.myGame = false;
      this.onTurn = false;
    }
    this.setSocketReceiveMethods();
    this.setPairsForNewGame(true);
    this.setScoredRowsForNewGame();
  }

  ngAfterViewInit() {
    this.setButtonValuesForNewGame();
    this.setButtonStylesForNewGame(true);
    this.setTimer();
  }

  setScoredRowsForNewGame() {
    this.currentRow = 0;
    for (var i = 0; i < 10; i++) {
      this.scoredLeft[i] = false;
      this.scoredRight[i] = false;
    }
  }

  findNextRowToScore() {
    var i = this.currentRow + 1;
    for (i = this.currentRow + 1; i < 10; i++)
      if (this.scoredLeft[i] == false)
        break;
    this.currentRow = i;
  }

  setCurrentRowForGameContinue() {
    var i = 0;
    for (i = 0; i < 10; i++)
      if (this.scoredLeft[i]  == false)
        break;
    this.currentRow = i;
    $('#left' + this.currentRow).addClass('current');
  }

  enableButtonsForGameContinue() {
    for (var i = 0; i < 10; i++)
      if (this.scoredRight[i] == false) {
        $('#right' + i).prop('disabled', false);
      }
  }

  removeCurrent() {
    $('#left' + this.currentRow).removeClass('current');
  }

  setSocketReceiveMethods() {
    this.socket = this.matchService.getSocket();
    this.bluePlayer = this.matchService.getBluePlayer();
    this.redPlayer = this.matchService.getRedPlayer();

    this.socket.on("pairsGameTry", data => {
      if (data.correct == true) {
        this.opponentPoints++;
        this.scoredLeft[data.indexLeft] = true;
        this.scoredRight[data.indexRight] = true;
        $('#left' + data.indexLeft).removeClass('btn-secondary');
        $('#right' + data.indexRight).removeClass('btn-secondary');
        if (this.isBlue) {
          $('#left' + data.indexLeft).addClass('btn-danger');
          $('#right' + data.indexRight).addClass('btn-danger');
        }
        else {
          $('#left' + data.indexLeft).addClass('btn-primary');
          $('#right' + data.indexRight).addClass('btn-primary');
        }
      }
      $('#left' + this.currentRow).removeClass('current');
      //this.currentRow++;
      this.findNextRowToScore();
      $('#left' + this.currentRow).addClass('current');
    });

    this.socket.on("startNewPairsGame", data => {
      clearInterval(this.counterID);
      this.removeCurrent();
      this.setEverythingForNewRedGame();
      this.setTimer();
    });

    this.socket.on("pairsGameOver", data => {
      clearInterval(this.counterID);
      this.removeCurrent();
      this.notify.emit(data);
    });

    this.socket.on("continuePairsGame", data => {
      clearInterval(this.counterID);
      this.removeCurrent();
      this.myGame = false;
      this.onTurn = true;
      this.setCurrentRowForGameContinue();
      this.enableButtonsForGameContinue();
      this.setTimer();
    });
  }

  setPairsForNewGame(blueOnTurn : boolean) {
    this.currentRow = 0;
    var pairIndex = 0;
    if (!blueOnTurn)
      pairIndex = 1;
    this.description = this.pairGames[pairIndex].description;
    for (var i = 0; i < this.pairGames[pairIndex].pairs.length; i++) {
      this.pairs[i] = [];
      this.pairs[i][0] = this.pairGames[pairIndex].pairs[i].left;
      this.pairs[i][1] = this.pairGames[pairIndex].pairs[i].right;
      this.solutions[i] = this.pairs[i][1];
      this.pairs[i][1] = this.rightColumns[pairIndex][i];
    }
  }

  setButtonValuesForNewGame() {
    for (var i = 0; i < this.pairs.length; i++) {
      $('#left' + i).html(this.pairs[i][0]);
      $('#right' + i).html(this.pairs[i][1]);
    }
  }

  setButtonStylesForNewGame(blueOnTurn : boolean) {
    $('.left').removeClass("btn-primary btn-danger");
    $('.right').removeClass("btn-primary btn-danger");
    $('.left').prop('disabled', true);
    $('.left').addClass('btn-secondary');
    $('.right').addClass('btn-secondary');
    $('.right').prop('disabled', true);
    $('#left0').addClass('current');
    if ((this.isBlue && blueOnTurn) || (!this.isBlue && !blueOnTurn)) {
      $('.right').prop('disabled', false);
    }
  }

  setEverythingForNewRedGame() {
    this.setPairsForNewGame(false);
    this.setScoredRowsForNewGame();
    this.setButtonValuesForNewGame();
    this.setButtonStylesForNewGame(false);
    if (this.isBlue) {
      this.myGame = false;
      this.onTurn = false;
    }
    else {
      this.myGame = true;
      this.onTurn = true;
    }
    //this.setTimer()
  }

  onButtonClicked(event : Event, i : number) {
    const data = {
      indexLeft : this.currentRow,
      indexRight : i,
      bluePlayer : this.bluePlayer.username,
      redPlayer : this.redPlayer.username,
      correct : false,
      isBlue : this.isBlue
    };
    var $rightButton = $(event.target);
    var $leftButton = $('#left' + this.currentRow);
    if (this.pairs[i][1] == this.solutions[this.currentRow]) {
      this.scoredLeft[this.currentRow] = true;
      this.scoredRight[i] = true;
      this.myPoints++;
      $rightButton.removeClass("btn-secondary");
      $rightButton.prop('disabled', true);
      $leftButton.removeClass("btn-secondary");
      if(this.isBlue) {
        $rightButton.addClass("btn-primary");
        $leftButton.addClass("btn-primary");
      }
      else {
        $rightButton.addClass("btn-danger");
        $leftButton.addClass("btn-danger");
      }
      data.correct = true;
    }
    else {

    }
    $leftButton.removeClass('current');
    this.findNextRowToScore();
    this.socket.emit("pairsGameTry", data);
    if (this.currentRow == 10) {
      this.finishGame();
      return;
    }
    $leftButton = $('#left' + this.currentRow);
    $leftButton.addClass('current');
  }

  finishGame() {
    clearInterval(this.counterID);
    this.removeCurrent();
    $('.left').prop('disabled', true);
    $('.right').prop('disabled', true);
    this.onTurn = false;
    if (this.myGame) {
      this.myGame = false;
      this.onTurn = false;
      if (this.finishedSuccessfuly()) {
        if (this.isBlue) {
          //tell red to start new Game
          const data = {
            username : this.redPlayer.username
          }
          this.setEverythingForNewRedGame();
          this.socket.emit("startNewPairsGame", data);
          this.setTimer();
        }
        else {
          //tell blue that game is over
          var redPoints = this.myPoints;
          var bluePoints = this.opponentPoints;
          const data = {
            bluePlayer : this.bluePlayer.username,
            redPlayer : this.redPlayer.username,
            bluePoints : bluePoints,
            redPoints : redPoints
          }
          this.socket.emit("pairsGameOver", data);
        }
      }
      else {
        if (this.isBlue) {
          //tell red to continue my game
          const data = {
            username : this.redPlayer.username
          }
          this.socket.emit("continuePairsGame", data);
          this.myGame = true;
          this.onTurn = false;
          this.setCurrentRowForGameContinue();
          this.setTimer();
        }
        else {
          //tell blue to continue my game
          const data = {
            username : this.bluePlayer.username
          }
          this.socket.emit("continuePairsGame", data);
          this.myGame = true;
          this.onTurn = false;
          this.setCurrentRowForGameContinue();
          this.setTimer();
        }
      }
    }
    else {
        if (this.isBlue) {
          //tell red that game is over
          var redPoints = this.opponentPoints;
          var bluePoints = this.myPoints;
          const data = {
            bluePlayer : this.bluePlayer.username,
            redPlayer : this.redPlayer.username,
            bluePoints : bluePoints,
            redPoints : redPoints
          }
          this.socket.emit("pairsGameOver", data);
        }
        else {
          //im starting new game, tell blue that im starting a new game
          const data = {
            username : this.bluePlayer.username
          }
          this.setEverythingForNewRedGame();
          this.socket.emit("startNewPairsGame", data);
          this.setTimer();
        }
      }
  }

  finishedSuccessfuly() {
    for (var i = 0; i < 10; i++)
      if (this.scoredLeft[i] == false)
        return false;
    return true;
  }

  setTimer() {
    this.timePercent = 0;
    this.counterID = setInterval(() => {
      this.timePercent++;
		  $('#timeline').css("width", (this.timePercent /120 * 100) + "%");
		  if (this.timePercent == 120) {
        clearInterval(this.counterID);
        if (this.onTurn) {
          this.finishGame();
        }
		  }
    }, 500);
  }

}

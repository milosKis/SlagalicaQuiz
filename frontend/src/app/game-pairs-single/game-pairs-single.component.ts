import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import {GameService} from '../game.service';
import {MatchService} from '../match.service';
import * as $ from 'jquery';
import {PairGame} from '../models/PairGame';

@Component({
  selector: 'app-game-pairs-single',
  templateUrl: './game-pairs-single.component.html',
  styleUrls: ['./game-pairs-single.component.css']
})
export class GamePairsSingleComponent implements OnInit {

  @Input() pairGame : PairGame;
  @Output() notify = new EventEmitter<number>();
  pairs  : string[][] = [];
  solutions : string[] = [];
  currentRow : number = 0;
  points : number = 0;
  timePercent : number = 0;
  counterID : any;

  constructor(private gameService : GameService, private matchService : MatchService) { }

  ngOnInit() {
    this.setPairs();
  }

  ngAfterViewInit() {
    this.setButtonStyles();
    this.setTimer();
  }

  setPairs() {
    for (var i = 0; i < this.pairGame.pairs.length; i++) {
      this.pairs[i] = [];
      this.pairs[i][0] = this.pairGame.pairs[i].left;
      this.pairs[i][1] = this.pairGame.pairs[i].right;
      this.solutions[i] = this.pairs[i][1];
    }
    var tempArray = this.gameService.shuffleArray(this.solutions);
    for (var i = 0; i < tempArray.length; i++) {
      this.pairs[i][1] = tempArray[i];
    }
  }

  setButtonStyles() {
    $('.left').prop('disabled', true);
    $('.left').addClass('btn-secondary');
    $('.right').prop('disabled', false);
    $('.right').addClass('btn-secondary');
    $('#left0').prop('disabled', false);
  }

  onButtonClicked(event : Event, i : number) {
    var $rightButton = $(event.target);
    var $leftButton = $('#left' + this.currentRow);
    if (this.pairs[i][1] == this.solutions[this.currentRow]) {
      this.points++;
      $rightButton.removeClass("btn-secondary");
      $rightButton.addClass("btn-primary"); //ove stvari promeniti kod multiplayer igre
      $rightButton.prop('disabled', true);
      $leftButton.removeClass("btn-secondary");
      $leftButton.addClass("btn-primary"); //ove stvari promeniti kod multiplayer igre
    }
    else {

    }
    $leftButton.prop('disabled', true);
    this.currentRow++;
    if (this.currentRow == 10) {
      this.finishGame();
      return;
    }
    $leftButton = $('#left' + this.currentRow);
    $leftButton.prop('disabled', false);
  }

  finishGame() {
    clearInterval(this.counterID);
    $('.left').prop('disabled', true);
    $('.right').prop('disabled', true);
    this.notify.emit(this.points);
  }

  setTimer() {
    this.timePercent = 0;
    this.counterID = setInterval(() => {
      this.timePercent++;
		  $('#timeline').css("width", (this.timePercent /120 * 100) + "%");
		  if (this.timePercent == 120) {
        clearInterval(this.counterID);
        this.finishGame();
        // $('button.number').prop('disabled', true);
        // $('button.operation').prop('disabled', true);
        // $('.erase-all').prop('disabled', true);
        // $('.check-number').prop('disabled', true);
        // var expression = $('#expression').val();
		  }
    }, 500);
  }
}

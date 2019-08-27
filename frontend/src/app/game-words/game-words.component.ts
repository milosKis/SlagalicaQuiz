import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import * as $ from 'jquery';
import {GameService} from '../game.service';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-game-words',
  templateUrl: './game-words.component.html',
  styleUrls: ['./game-words.component.css']
})
export class GameWordsComponent implements OnInit {

  @Input() letters: string[];
  @Input() isBlue : boolean;
  @Output() notify = new EventEmitter<string>();
  messageSuccess : string;
  messageError : string;
  timePercent : number = 0;
	counterID : any;

  constructor(private gameService : GameService) { }

  ngOnInit() {}

  ngAfterViewInit() {
    this.setUp();
  }

  setUp() {
    this.setButtonStyles();
    this.setLetters();
    this.setTimer();
  }

  setButtonStyles() {
    if (this.isBlue) {
      $('button.erase-all').addClass("btn-outline-primary");
      $('button.check-word').addClass("btn-outline-primary");
      $('button.letter').addClass("btn-primary");
    }
    else {
      $('button.erase-all').addClass("btn-outline-danger");
      $('button.check-word').addClass("btn-outline-danger");
      $('button.letter').addClass("btn-danger");
    }
  }

  setLetters() {
		for (var i = 0; i < 12; i++) {
			var $button = $('#btn' + (i + 1));
			$button.html(this.letters[i]);
      $button.css('width', '100%');
		}
  }
  
  onLetterClicked(event : Event) {
    var $button = $(event.target);
    $button.prop('disabled', true);
    var currentWord = $('#word').val();
    $('#word').val(currentWord + $button.html());
    this.messageError = null;
    this.messageSuccess = null;
  }

  onEraseAllClicked() {
    $('#word').val('');
    $('button.letter').prop('disabled', false);
    this.messageError = null;
    this.messageSuccess = null;
  }

  onCheckWordClicked() {
    var word = $('#word').val();
    if (!word || word.length == 0) {
      this.messageError = "Niste uneli rec!";
      this.messageSuccess = null;
      return;
    }
    this.gameService.checkWord(word).subscribe(
      correct => {
        if (correct) {
          this.messageError = null;
          this.messageSuccess = "Korektna rec!";
        }
        else {
          this.messageError = "Nekorektna rec!";
          this.messageSuccess = null;
        }
    })
  }
	
	setTimer() {
    this.timePercent = 0;
    if (!this.isBlue) {
      $('#timeline').addClass("bg-danger");
    }
    this.counterID = setInterval(() => {
      this.timePercent++;
		  $('#timeline').css("width", (this.timePercent / 120.0 * 100) + "%");
		  if (this.timePercent == 120) {
        clearInterval(this.counterID);
        $('button.letter').prop('disabled', true);
        $('.erase-all').prop('disabled', true);
        $('.check-word').prop('disabled', true);
        var word = $('#word').val();
        this.notify.emit(word);
		  }
    }, 500);
  }
}
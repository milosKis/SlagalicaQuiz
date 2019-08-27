import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import * as $ from 'jquery';
import {User} from '../user.model';
import {MatchService} from '../match.service';

@Component({
  selector: 'app-game-combinations-single',
  templateUrl: './game-combinations-single.component.html',
  styleUrls: ['./game-combinations-single.component.css']
})
export class GameCombinationsSingleComponent implements OnInit {

  @Input() combinations: number[];
  @Output() notify = new EventEmitter<boolean>();
  messageSuccess : string;
  messageError : string;
  timePercent : number = 0;
	counterID : any;

  constructor(private matchService : MatchService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.setUp();
  }

  setUp() {
		this.setButtonStyles();
    this.setTimer();
  }

	currentRowNumber = 1;
	currentSigns = [0 , 0, 0 , 0];
	numOfTries = 0;
	foundSolution = false;

	setButtonStyles() {
		$('.sign').addClass('btn-primary');
		$('.submit').addClass('btn-outline-primary');
		$('.resolved').addClass('btn-primary');
	}
	
	submitCombination(event : Event) {
		this.numOfTries++;
		this.disableSignButtons();
		var $submitButton = $(event.target);
		var tag = $submitButton.prop('tagName');
		if (tag == "BUTTON") {
			$submitButton.prop("disabled", true);
		}
		else {
			$submitButton.parent().prop("disabled", true);
		}
		this.checkSolution($submitButton);
		this.currentRowNumber++;
		for (var i = 0; i < 4; i++) {
			this.currentSigns[i] = 0;
		}
		if (!this.foundSolution && this.numOfTries < 6) {
			$('#row' + this.currentRowNumber).prop('hidden', false);
		}
		else {
			this.finishGame(this.foundSolution);
		}
	}
	
	changeSign(event : Event, index) {
		var $button = $(event.target);
		var tag = $button.prop('tagName');
		this.currentSigns[index]++;
		if (this.currentSigns[index] == 6) {
			this.currentSigns[index] = 0;
		}
		if (tag == 'BUTTON') {
			$button.children().attr('src', '../../assets/images/sign' + this.currentSigns[index] + '.png');
		}
		else {
			$button.attr('src', '../../assets/images/sign' + this.currentSigns[index] + '.png');
		}
	}
	
	disableSignButtons() {
		for (var i = 0; i < 4; i++) {
			$('#btn' + this.currentRowNumber + "" + (i + 1)).prop('disabled', true);
		}
	}

	disableAllButtons() {
		$('.sign').prop('disabled', true);
		$('.resolved').prop('disabled', true);
		$('.submit').prop('disabled', true);
	}

	enableAllButtons() {
		$('.sign').prop('disabled', false);
		$('.resolved').prop('disabled', false);
		$('.submit').prop('disabled', false);
	}

	hideAllRows() {
		for(var i = 1; i <= 7; i++) {
			$('#row' + i).prop('hidden', true);
		}
	}
	
  checkSolution(element) {
		var $submitButton = $(element);
		var tag = $submitButton.prop('tagName');
		var resolved = 0;
		var completelyResolved = 0;
		var checked = [false, false, false, false];
		for (var i = 0; i < 4; i++) {
			if (this.currentSigns[i] == this.combinations[i]) {
				completelyResolved++;
				checked[i] = true;
			}
		}
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				if (!checked[j] && this.currentSigns[i] == this.combinations[j]) {
					checked[j] = true;
					resolved++;
					break;
				}
			}
		}
		var $resultButton = $('#btn' + this.currentRowNumber + '6');
		$resultButton.prop('hidden', false);
		$resultButton.html(completelyResolved + '|' + resolved);
		if (completelyResolved == 4) {
			if (tag == "BUTTON") {
				$submitButton.children().attr('src', '../../assets/images/correct.png');
			}
			else {
				$submitButton.attr('src', '../../assets/images/correct.png');
			}
			this.foundSolution = true;
		}
		else {
			if (tag == "BUTTON") {
				$submitButton.children().attr('src', '../../assets/images/wrong.png');
			}
			else {
				$submitButton.attr('src', '../../assets/images/wrong.png');
			}
		}
	}

	finishGame(successfull : boolean) {
		clearInterval(this.counterID);
		this.disableAllButtons();

		if (!successfull) {
			$('#row7').prop('hidden', false);
			for (var i = 0; i < 4; i++) {
				$('#btn7' + (i + 1)).children().attr('src', '../../assets/images/sign' + this.combinations[i] + '.png');
			}
    }
    
		this.notify.emit(successfull);
	}

  setTimer() {
		this.timePercent = 0;
    this.counterID = setInterval(() => {
      this.timePercent++;
		  $('#timeline').css("width", (this.timePercent /240.0 * 100) + "%");
		  if (this.timePercent == 240) {
				clearInterval(this.counterID);
				this.finishGame(false);
		  }
    }, 500);
  }

}

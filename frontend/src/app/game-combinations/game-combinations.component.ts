import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import * as $ from 'jquery';
import {User} from '../user.model';
import {MatchService} from '../match.service';

@Component({
  selector: 'app-game-combinations',
  templateUrl: './game-combinations.component.html',
  styleUrls: ['./game-combinations.component.css']
})
export class GameCombinationsComponent implements OnInit {

  @Input() combinations: number[];
	@Input() isBlue : boolean;
  @Output() notify = new EventEmitter<any>();
  messageSuccess : string;
  messageError : string;
  timePercent : number = 0;
	counterID : any;
	socket : any;
	bluePlayer : User; 
	redPlayer : User;
	onTurn : boolean;

  constructor(private matchService : MatchService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.setUp();
  }

  setUp() {
    //this.setButtonStyles();
		//this.setNumbers();
		this.getInitialData();
		this.setSocketListeners();
		this.setButtonStyles();
    this.setTimer();
  }

	currentRowNumber = 1;
	currentSigns = [0 , 0, 0 , 0];
	numOfTries = 0;
	foundSolution = false;

	getInitialData() {
		if (this.isBlue) {
			this.onTurn = true;
		}
		else {
			this.onTurn = false;
		}
		this.socket = this.matchService.getSocket();
		this.bluePlayer = this.matchService.getBluePlayer();
		this.redPlayer = this.matchService.getRedPlayer();
	}

	setSocketListeners() {
		this.socket.on("combinationGameTry", data => {
			var combination = data.combination;
			var resolved = data.resolved;
			var completelyResolved = data.completelyResolved;
			this.currentRowNumber =  data.rowNumber;
			for (var i = 0; i < 4; i++) {
				var $button = $('#btn' + this.currentRowNumber + "" + (i + 1));
				$button.children().attr('src', '../../assets/images/sign' + combination[i] + '.png');
			}
			if (completelyResolved != 4) {
				$('#btn' + this.currentRowNumber + "5").children().attr('src', '../../assets/images/wrong.png');
			}
			else {
				$('#btn' + this.currentRowNumber + "5").children().attr('src', '../../assets/images/correct.png');
			}
			var $resultButton = $('#btn' + this.currentRowNumber + "6");
			$resultButton.html(completelyResolved + "|" + resolved);
			$resultButton.prop('hidden', false);
			$('#row' + this.currentRowNumber).prop('hidden', false);
		});

		this.socket.on("combinationGameOver", data => {
			clearInterval(this.counterID);
			this.onTurn = !this.isBlue;
			var successfull = data.data.successfull;
			var rowNumber = this.currentRowNumber + 1;
			var combination = data.data.combination;
			if (!successfull) {
				rowNumber = 7;
			}
			$('#row' + rowNumber).prop('hidden', false);
			for (var i = 0; i < 4; i++) {
				$('#btn' + rowNumber + "" + (i + 1)).children().attr('src', '../../assets/images/sign' + combination[i] + '.png');
			}

			this.notify.emit(data);

			if (!this.isBlue) {
				setTimeout(() => {
						this.currentRowNumber = 1;
						this.enableAllButtons();
						this.setTimer();
						this.hideAllRows();
						$('#row1').prop('hidden', false);
						$('.submit').children().attr('src', '../../assets/images/correct.png');
						$('.sign').children().attr('src', '../../assets/images/sign0.png');
						$('.resolved').prop('hidden', true);
				}, 5000);
			}
		});
	}

	setButtonStyles() {
		if (this.isBlue) {
			$('.sign').addClass('btn-primary');
			$('.submit').addClass('btn-outline-primary');
			$('.resolved').addClass('btn-primary');
		}
		else {
			$('.sign').addClass('btn-danger');
			$('.submit').addClass('btn-outline-danger');
			$('.resolved').addClass('btn-danger');
			this.disableAllButtons();
			$('#row1').prop('hidden', true);
		}
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
			this.sendCombinationToServer(this.currentSigns, resolved, completelyResolved);
		}
	}

	sendCombinationToServer(combination : number[], resolved : number, completelyResolved : number) {
		const data = {
			combination : combination,
			resolved : resolved,
			completelyResolved : completelyResolved,
			rowNumber : this.currentRowNumber,
			bluePlayer : this.bluePlayer.username,
			redPlayer : this.redPlayer.username,
			isBlue : this.isBlue
		};
		this.socket.emit("combinationGameTry", data);
	}

	finishGame(successfull : boolean) {
		clearInterval(this.counterID);
		this.disableAllButtons();
		const data = {
			combination : this.combinations,
			redPlayer : this.redPlayer.username,
			bluePlayer : this.bluePlayer.username,
			isBlue : this.isBlue,
			successfull : successfull
		};

		if (!successfull) {
			$('#row7').prop('hidden', false);
			for (var i = 0; i < 4; i++) {
				$('#btn7' + (i + 1)).children().attr('src', '../../assets/images/sign' + this.combinations[i] + '.png');
			}
		}

		this.socket.emit("combinationGameOver", data);
		this.notify.emit(data);
		if (this.isBlue) {
			setTimeout(() => {
				this.disableAllButtons();
				this.hideAllRows();
				this.setTimer();
				this.onTurn = false;
			}, 5000);
		}
	}

  setTimer() {
    if (!this.isBlue) {
      $('#timeline').addClass("bg-danger");
		}
		this.timePercent = 0;
    this.counterID = setInterval(() => {
      this.timePercent++;
		  $('#timeline').css("width", (this.timePercent /240.0 * 100) + "%");
		  if (this.timePercent == 240) {
				clearInterval(this.counterID);
				if(this.onTurn) {
					console.log("time elapsed");
					this.finishGame(false);
				}
        // $('button.number').prop('disabled', true);
        // $('button.operation').prop('disabled', true);
        // $('.erase-all').prop('disabled', true);
        // $('.check-number').prop('disabled', true);
        // var expression = $('#expression').val();
        // this.notify.emit(expression);
		  }
    }, 500);
  }

}

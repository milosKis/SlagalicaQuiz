import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-game-numbers',
  templateUrl: './game-numbers.component.html',
  styleUrls: ['./game-numbers.component.css']
})
export class GameNumbersComponent implements OnInit {

  @Input() numbers: number[];
  @Input() isBlue : boolean;
  @Output() notify = new EventEmitter<string>();
  messageSuccess : string;
  messageError : string;
  timePercent : number = 0;
  counterID : any;
  previousInput : any = "a";
  
  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.setUp();
  }

  setUp() {
    this.setButtonStyles();
    this.setNumbers();
    this.setTimer();
  }

  setButtonStyles() {
    if (this.isBlue) {
      $('button.erase-all').addClass("btn-outline-primary");
      $('button.check-number').addClass("btn-outline-primary");
      $('button.number').addClass("btn-primary");
      $('button.operation').addClass("btn-primary");
    }
    else {
      $('button.erase-all').addClass("btn-outline-danger");
      $('button.check-number').addClass("btn-outline-danger");
      $('button.number').addClass("btn-danger");
      $('button.operation').addClass("btn-danger");
    }
  }

  setNumbers() {
		for (var i = 0; i < 6; i++) {
			var $button = $('#btn' + (i + 1));
			$button.html(this.numbers[i]);
			$button.css('width', '100%');
		}
		for (var i = 6; i < 12; i++) {
			var $button = $('#btn' + (i + 1));
			$button.css('width', '100%');
		}
		$('#numberToFind').html('= ' + this.numbers[6]);
  }
  
  onNumberClicked(event : Event) {
    var $button = $(event.target);
		var currentInput = $button.html();
		if (!(!isNaN(this.previousInput) && !isNaN(currentInput))) {
			$button.prop('disabled', true);
			var currentExpression = $('#expression').val();
			$('#expression').val(currentExpression + currentInput);
			this.previousInput = currentInput;
			this.messageError = null;
      this.messageSuccess = null;
		}
  }

  onOperationClicked(event : Event) {
    var $button = $(event.target);
		var currentInput = $button.html();
		var currentExpression = $('#expression').val();
		$('#expression').val(currentExpression + currentInput);
		this.previousInput = currentInput;
    this.messageError = null;
    this.messageSuccess = null;
  }

  onEraseAllClicked() {
    $('#expression').val('');
    $('button.number').prop('disabled', false);
    $('button.operation').prop('disabled', false);
    this.previousInput = "a";
    this.messageError = null;
    this.messageSuccess = null;
  }

  onCheckNumberClicked() {
    var expression = $('#expression').val();
    if (!expression || expression == "") {
      this.messageError = "Niste uneli izraz!";
      this.messageSuccess = null;
      return;
    }
    console.log("Expression = " + expression);
    var result;
    try {
      result = eval(expression);
    } catch(e) {
      this.messageError = "Greska u izrazu!";
      this.messageSuccess = null;
      return;
    }
    if (Number.isInteger(result)) {
      this.messageError = null;
      this.messageSuccess = " = " + result;
    }
    else {
      this.messageError = "Rezultat izraza nije ceo broj!";
      this.messageSuccess = null;
    }
  }
	
	setTimer() {
    if (!this.isBlue) {
      $('#timeline').addClass("bg-danger");
    }
    this.counterID = setInterval(() => {
      this.timePercent++;
		  $('#timeline').css("width", (this.timePercent /120.0 * 100) + "%");
		  if (this.timePercent == 120) {
        clearInterval(this.counterID);
        $('button.number').prop('disabled', true);
        $('button.operation').prop('disabled', true);
        $('.erase-all').prop('disabled', true);
        $('.check-number').prop('disabled', true);
        var expression = $('#expression').val();
        this.notify.emit(expression);
		  }
    }, 500);
  }

}

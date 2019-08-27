import { Component, OnInit, Input } from '@angular/core';
import * as $ from 'jquery';
import {Association} from '../models/Association';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-game-associations-single',
  templateUrl: './game-associations-single.component.html',
  styleUrls: ['./game-associations-single.component.css']
})
export class GameAssociationsSingleComponent implements OnInit {

  @Input() association : Association;
  @Output() notify = new EventEmitter<number>();
  solutions : string[] = [];
  fields : string[][] = [];
  finalSolution : string;
  openedFields : boolean[][] = [];
  solvedSolutions : boolean[] = []
  wrongSolutionCounter : any;
  numberOfOpenedFields = 0;
  counterID : any;
  timePercent : number;
  points : number = 0;

  constructor() { }

  ngOnInit() {
    for (var i = 0; i < 5; i++) {
      this.solutions[i] = "";
    }
    this.solvedSolutions = [false, false, false, false, false];

    for (var i = 0; i < 4; i++) {
      this.fields[i] = [];
      this.openedFields[i] = [false, false, false, false];
    }
    this.fields[0] = [this.association.A.A1, this.association.A.A2, this.association.A.A3, this.association.A.A4, this.association.A.A_sol];
    this.fields[1] = [this.association.B.B1, this.association.B.B2, this.association.B.B3, this.association.B.B4, this.association.B.B_sol];
    this.fields[2] = [this.association.C.C1, this.association.C.C2, this.association.C.C3, this.association.C.C4, this.association.C.C_sol];
    this.fields[3] = [this.association.D.D1, this.association.D.D2, this.association.D.D3, this.association.D.D4, this.association.D.D_sol];
    this.fields[4] = ["", "", "", "", this.association.final_sol];
  }

  ngAfterViewInit() {
    this.setElementsStyle();
    this.setTimer();
  }

  setElementsStyle() {
    this.disableAllSolutionInputs();
  }

  disableAllSolutionInputs() {
    $('.solution').prop('disabled', true);
  }

  enableAllUnsolvedSolutionInputs() {
    for (var i = 0; i < 5; i++)
      if (this.solvedSolutions[i] == false)
        $('#solution' + i).prop('disabled', false);
  }

  enableAllUnopenedFields() {
    for (var i = 0; i < 4; i++) 
      for (var j = 0; j < 4; j++)
        if (this.openedFields[i][j] == false)
          $('#' + i + "" + j).prop('disabled', false);
  }

  disableAllFields() {
    for (var i = 0; i < 4; i++)
      for (var j = 0; j < 4; j++)
        $("#" + i + "" + j).prop('disabled', true);
  }

  openAllFieldsAndSolutionForGroup(group : number, won : boolean) {
    this.updateNumberOfOpenedFields(group);
    this.solvedSolutions[group] = true;
    var $solutionInput = $("#solution" + group);
    $solutionInput.val(this.fields[group][4]);
    if (won == true)
      $solutionInput.addClass("blueGroup"); //ovo izmeniti kod multiplayera
    else
      $solutionInput.addClass("neutralGroup");
    $solutionInput.prop('disabled', true);
    for (var j = 0; j < 4; j++) {
      this.openedFields[group][j] = true;
      var $field = $("#" + group + "" + j);
      $field.html(this.fields[group][j]);
      if (won == true) {
        $field.removeClass("btn-secondary");
        $field.addClass("btn-primary"); //izmeniti kod multiplayera
      }
      $field.prop('disabled', true);
    }
  }

  openAllFieldsAndSolutions(won : boolean) {
    for (var i = 0; i < 4; i++) {
      if (this.solvedSolutions[i] == false)
        this.openAllFieldsAndSolutionForGroup(i, won);
    }
    this.solvedSolutions[4] = true;
    var $finalSolutionInput = $("#solution4");
    $finalSolutionInput.prop('disabled', true);
    $finalSolutionInput.val(this.fields[4][4]);
    if (won == true) {
      $finalSolutionInput.addClass("blueGroup") //izmeniti kod multiplayera
    }
    else {
      $finalSolutionInput.addClass("neutralGroup")
    }
  }


  checkSolution(i : number) {
    var $solutionInput = $("#solution" + i);
    if (this.solutions[i].toLowerCase() == this.fields[i][4].toLowerCase()) { //correct solution
      if (i < 4) {
        this.points += 5;
        this.openAllFieldsAndSolutionForGroup(i, true);
      }
      else { //win
        this.points = 30;
        this.finishGame(true);
      }
    }
    else {
      $solutionInput.val("");
      this.showWrongSolutionDisplay(i);
      if (this.numberOfOpenedFields < 16) {
        this.disableAllSolutionInputs();
        this.enableAllUnopenedFields();
      }
    }
  }

  finishGame(successful : boolean) {
    clearInterval(this.counterID);
    this.disableAllFields();
    this.disableAllSolutionInputs();
    this.openAllFieldsAndSolutions(successful);
    this.notify.emit(this.points);
  }

  showWrongSolutionDisplay(i : number) {
    var count = 0;
    this.wrongSolutionCounter = setInterval( () => {
      count++;
      $('#solution' + i).toggleClass("wrongSolution");
      if (count == 4) {
        count = 0;
        clearInterval(this.wrongSolutionCounter);
      }
    }, 200);
  }

  updateNumberOfOpenedFields(openedGroup : number) {
    for (var i = 0; i < 4; i++) {
      if (this.openedFields[openedGroup][i] == false) {
        this.numberOfOpenedFields++;
      }
    }
  }

  onClicked(event : Event, group : number, field : number) {
    this.numberOfOpenedFields++;
    this.disableAllFields();
    var $field = $(event.target);
    $field.html(this.fields[group][field]);
    this.openedFields[group][field] = true;
    this.enableAllUnsolvedSolutionInputs();
  }

  setTimer() {
    this.timePercent = 0;
    this.counterID = setInterval(() => {
      this.timePercent++;
		  $('#timeline').css("width", (this.timePercent /120.0 * 100) + "%");
		  if (this.timePercent == 120) {
        clearInterval(this.counterID);
        this.finishGame(false);
		  }
    }, 500);
  }
}

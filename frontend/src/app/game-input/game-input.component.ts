import { Component, OnInit, AfterViewInit } from '@angular/core';
import {UsersService} from '../users.service';
import {User} from '../user.model';
import {MatchService} from '../match.service';
import {Router} from '@angular/router';
import * as $ from 'jquery';
import {GameService} from '../game.service';
import {PairGame} from '../models/PairGame';
import {Association} from '../models/Association';


@Component({
  selector: 'app-game-input',
  templateUrl: './game-input.component.html',
  styleUrls: ['./game-input.component.css']
})
export class GameInputComponent implements OnInit {

  currentUser : User;
  wordsMessageError : string;
  wordsMessageSuccess : string;
  pairsMessageError : string;
  pairsMessageSuccess : string;
  associationsMessageError : string;
  associationsMessageSuccess : string;
  pairGame : PairGame;
  association : Association;
  word : string;

  constructor(private userService : UsersService,
    private matchService : MatchService,
    private gameService : GameService,
    private router : Router,
    ) { }

  ngOnInit() {
    this.currentUser = this.userService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login'])
    }
    else if (this.currentUser.type != "supervisor") {
      this.router.navigate(['/user']);
    }
    this.initializeModels();
  }

  insertWord() {
    if (!this.word || this.word.trim() == "") {
      this.wordsMessageError = "Niste uneli termin";
      this.wordsMessageSuccess = null;
      return;
    }

    this.gameService.checkWord(this.word).subscribe(
      (exists : boolean) => {
        if (exists == true) {
          this.wordsMessageError = "Termin vec postoji u bazi";
          this.wordsMessageSuccess = null;
        }
        else {
          this.wordsMessageError = null;
          this.wordsMessageSuccess = "Uspesno unet termin";
          this.gameService.insertWord(this.word).subscribe(
            result => {}
          );
        }
      }
    );
  }

  insertPairs() {
    if (!this.pairGame.description || this.pairGame.description.trim() == "") {
      this.pairsMessageError = "Izostavili ste opis";
      this.pairsMessageSuccess = null;
      return;
    }
    for (var i = 0; i < 10; i++) {
      if (!this.pairGame.pairs[i].left || !this.pairGame.pairs[i].right || this.pairGame.pairs[i].left.trim() == "" || this.pairGame.pairs[i].right.trim() == "") {
        this.pairsMessageError = "Izostavili ste neku rec";
        this.pairsMessageSuccess = null;
        return;
      }
    }
    this.pairsMessageError = null;
    this.pairsMessageSuccess = "Uspesno ste uneli spojnice";
    this.gameService.insertPairs(this.pairGame).subscribe(
      result => {}
    );
  }

  insertAssociations() {
    var badCondition : boolean = 
    (!this.association.A.A1 || this.association.A.A1.trim() == "" ||
    !this.association.A.A2 || this.association.A.A2.trim() == "" ||
    !this.association.A.A3 || this.association.A.A3.trim() == "" ||
    !this.association.A.A4 || this.association.A.A4.trim() == "" ||
    !this.association.A.A_sol || this.association.A.A_sol.trim() == "" ||
    !this.association.B.B1 || this.association.B.B1.trim() == "" ||
    !this.association.B.B2 || this.association.B.B2.trim() == "" ||
    !this.association.B.B3 || this.association.B.B3.trim() == "" ||
    !this.association.B.B4 || this.association.B.B4.trim() == "" ||
    !this.association.B.B_sol || this.association.B.B_sol.trim() == "" ||
    !this.association.C.C1 || this.association.C.C1.trim() == "" ||
    !this.association.C.C2 || this.association.C.C2.trim() == "" ||
    !this.association.C.C3 || this.association.C.C3.trim() == "" ||
    !this.association.C.C4 || this.association.C.C4.trim() == "" ||
    !this.association.C.C_sol || this.association.C.C_sol.trim() == "" ||
    !this.association.D.D1 || this.association.D.D1.trim() == "" ||
    !this.association.D.D2 || this.association.D.D2.trim() == "" ||
    !this.association.D.D3 || this.association.D.D3.trim() == "" ||
    !this.association.D.D4 || this.association.D.D4.trim() == "" ||
    !this.association.D.D_sol || this.association.D.D_sol.trim() == "" ||
    !this.association.final_sol || this.association.final_sol.trim() == "");
  
    if (badCondition == true) {
      this.associationsMessageError = "Izostavili ste neko od polja";
      this.associationsMessageSuccess = null;
      return;
    }

    this.associationsMessageError = null;
    this.associationsMessageSuccess = "Uspesno ste uneli asocijacije";
    this.gameService.insertAssociations(this.association).subscribe(
      result => {}
    );
  }

  initializeModels() {
    this.word = "";
    this.pairGame = {
      description : "",
      pairs : [
        {left : "", right : ""}, {left : "", right : ""}, {left : "", right : ""},
        {left : "", right : ""}, {left : "", right : ""}, {left : "", right : ""},
        {left : "", right : ""}, {left : "", right : ""}, {left : "", right : ""},
        {left : "", right : ""}
      ]
    };

    this.association = {
      A : {
        A1 : "",
        A2 : "",
        A3 : "",
        A4 : "",
        A_sol : ""
      },
      B : {
        B1 : "",
        B2 : "",
        B3 : "",
        B4 : "",
        B_sol : ""
      },
      C : {
        C1 : "",
        C2 : "",
        C3 : "",
        C4 : "",
        C_sol : ""
      },
      D : {
        D1 : "",
        D2 : "",
        D3 : "",
        D4 : "",
        D_sol : ""
      },
      final_sol : ""
    }
  }

}

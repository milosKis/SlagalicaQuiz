import { Component, OnInit, AfterViewInit } from '@angular/core';
import {UsersService} from '../users.service';
import {User} from '../user.model';
import {MatchService} from '../match.service';
import {Router} from '@angular/router';
import * as $ from 'jquery';
import {GameService} from '../game.service';
import {PairGame} from '../models/PairGame';
import {Association} from '../models/Association';
import {GameDay} from '../models/GameDay';

@Component({
  selector: 'app-game-day-input',
  templateUrl: './game-day-input.component.html',
  styleUrls: ['./game-day-input.component.css']
})
export class GameDayInputComponent implements OnInit {

  currentUser : User;
  date : string;
  errorMessage : string;
  successMessage : string;
  associations : Association[] = [];
  pairGames : PairGame[] = [];
  indexPairs : number = -1;
  indexAssociations : number = -1;

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
    else if (this.currentUser.type != "admin") {
      this.router.navigate(['/user']);
    }

    this.gameService.getAllPairsGames().subscribe(
      (pairGames : PairGame[]) => {
        this.pairGames = pairGames;
        this.gameService.getAllAssociationsGames().subscribe(
          (associations : Association[]) => {
            this.associations = associations;
          }
        );
      }
    );
  }

  selectPairs(i : number) {
    $('#pairs' + this.indexPairs).removeClass("selected");
    this.indexPairs = i;
    $('#pairs' + this.indexPairs).addClass("selected");
  }

  selectAssociations(i : number) {
    $('#associations' + this.indexAssociations).removeClass("selected");
    this.indexAssociations = i;
    $('#associations' + this.indexAssociations).addClass("selected");
  }

  insertGameDay() {
    var currentDate = this.gameService.getTodaysDate();
    if (this.date) {
      var date = new Date(this.date);
      date.setHours(0); date.setUTCHours(0);
      date.setMinutes(0); date.setUTCMinutes(0);
      date.setSeconds(0); date.setUTCSeconds(0);
      date.setMilliseconds(0); date.setUTCMilliseconds(0);
      if (date.getTime() <= currentDate.getTime()) {
        this.errorMessage = "Morate izabrati datum u buducnosti";
        this.successMessage = null;
        return
      }
      if (this.indexPairs == -1) {
        this.errorMessage = "Niste izabrali spojnice";
        this.successMessage = null;
        return
      }
      if (this.indexAssociations == -1) {
        this.errorMessage = "Niste izabrali asocijacije";
        this.successMessage = null;
        return
      }
      this.gameService.getGameDayForSpecificDate(date).subscribe(
        (games : GameDay[]) => {
          if (games && games[0]) {
            this.errorMessage = "Postoji vec igra za taj datum";
            this.successMessage = null;
          }
          else {
            this.gameService.insertGameDay(date, this.pairGames[this.indexPairs], this.associations[this.indexAssociations]).subscribe(
              result => {
                this.errorMessage = null;
                this.successMessage = "Uspesno uneta igra dana";
              }
            );
          }
        }
      );
    }
    else {
      this.errorMessage = "Niste uneli datum";
      this.successMessage = null;
    }
  }

}

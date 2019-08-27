import { Component, OnInit, AfterViewInit } from '@angular/core';
import {UsersService} from '../users.service';
import {User} from '../user.model';
import {MatchService} from '../match.service';
import {Router} from '@angular/router';
import * as $ from 'jquery';
import {GameService} from '../game.service';
import { GameDay } from '../models/GameDay';
import {GameDayResult} from '../models/GameDayResult';

@Component({
  selector: 'app-game-single',
  templateUrl: './game-single.component.html',
  styleUrls: ['./game-single.component.css']
})
export class GameSingleComponent implements OnInit {

  currentGame : string = "words";
  isBlue : boolean = true;
  player : User;
  socket : any;
  points : number = 0;
  message : string;
  letters : string[];
  numbers : number[];
  combinations : number[];
  gameOfTheDay : GameDay;
  

  constructor(private userService : UsersService,
              private matchService : MatchService,
              private gameService : GameService,
              private router : Router,
              ) { }

  ngOnInit() {
    this.player = this.userService.getCurrentUser();
    if (!this.player) {
      this.router.navigate(['/login'])
    }
    else if (this.player.type != "player") {
      this.router.navigate(['/user']);
    }

    this.gameService.getTodaysGame().subscribe(
      (games : GameDay[]) => {
        if (games && games[0]) {
          this.gameOfTheDay = games[0];
        }
        else {
          this.currentGame = "notsetted";
        }
      }
    );

    this.letters = this.gameService.generateLettersCombination();
    this.numbers = this.gameService.generateNumbersCombination();
    this.combinations = this.gameService.generateCombinations();
  }

  ngAfterViewInit() {
    this.gameService.getGameDayResultForUserForToday(this.player.username).subscribe(
      (gameDayResults : GameDayResult[]) => {
        if (gameDayResults && gameDayResults[0]) {
          this.currentGame = "alreadyplayed";
          this.points = gameDayResults[0].points;
        }
      }
    );
  }

  wordsGameOver(word : string) {
    this.gameService.checkWord(word).subscribe(
      correct => {
        if (correct) {
          var newPoints = word.length * 2;
          this.message = "+" + newPoints;
          this.points += newPoints;
        }
        else {
          this.message = "+0";
        }
        setTimeout( () => {
          $('#words').removeClass("selected");
          $('#numbers').addClass("selected");
          this.currentGame = "numbers";
          this.message = null;
        }, 5000);
    })
  }

  numbersGameOver(expression : string) {
    var result;
    try {
      result = eval(expression);
    } catch(e) {
      this.message = "+0";
      result = 0.23;
    }
    if (Number.isInteger(result)) {
      if (result == this.numbers[6]) {
        this.message = "+10";
        this.points += 10;
      }
      else if (Math.abs(result - this.numbers[6]) <= 5) {
        this.message = "+5";
        this.points += 5;
      }
      else {
        this.message = "+0";
        this.points += 0;
      }
    }
    else {
      this.message = "+0";
    }
    setTimeout(() => {
      this.message = null;
      this.currentGame = "combinations";
      $('#numbers').removeClass("selected");
      $('#combinations').addClass("selected");
    }, 5000);
  }

  combinationsGameOver(successful : boolean) {
    if (successful == true) {
      this.message = "+10";
      this.points += 10;
    }
    else {
      this.message = "+0";
    }
    setTimeout(() => {
      this.message = null;
      this.currentGame = "pairs";
      $('#combinations').removeClass("selected");
      $('#pairs').addClass("selected");
    }, 5000);
  }

  pairsGameOver(points : number) {
    this.message = "+" + points;
    this.points += points;
    setTimeout(() => {
      this.message = null;
      this.currentGame = "associations";
      $('#pairs').removeClass("selected");
      $('#associations').addClass("selected");
    }, 5000);
  }

  associationsGameOver(points : number) {
    this.message = "+" + points;
    this.points += points;
    setTimeout(() => {
      this.message = null;
      this.currentGame = "gameover";
      $('#associations').removeClass("selected");
      this.gameService.insertGameDayResult(this.player.username, this.points).subscribe(
        result => {

        }
      );
    }, 5000);
  }

}

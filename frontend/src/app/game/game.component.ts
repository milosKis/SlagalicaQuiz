import { Component, OnInit, AfterViewInit } from '@angular/core';
import {UsersService} from '../users.service';
import {User} from '../user.model';
import {MatchService} from '../match.service';
import {Router} from '@angular/router';
import * as $ from 'jquery';
import {GameService} from '../game.service';
import {PairGame} from '../models/PairGame';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  bluePlayer : User;
  redPlayer : User;
  currentPlayer : User;
  letters : string[];
  isBlue : boolean;
  socket : any;
  bluePoints : number = 0;
  redPoints : number = 0;
  blueMessage : string;
  redMessage : string;
  currentGame : string = "words";
  numbers : number[];
  combinations : number[];
  pairGames : PairGame[];
  rightColumns : string[][];

  constructor(private userService : UsersService,
              private matchService : MatchService,
              private gameService : GameService,
              private router : Router,
              ) { }

  ngOnInit() {
    this.currentPlayer = this.userService.getCurrentUser();
    if (!this.currentPlayer) {
      this.router.navigate(['/login'])
    }
    else if (this.currentPlayer.type != "player") {
      this.router.navigate(['/user']);
    }

    var data = this.matchService.getInitialMatchData();
    if (!data) {
      this.router.navigate(['user']);
    }
    this.socket = data.socket;
    this.matchService.setSocket(this.socket);
    this.letters = data.letters;

    if (data.bluePlayer == this.currentPlayer.username) {
      this.isBlue = true;
    }
    else {
      this.isBlue = false;
    }

    this.userService.getUserByUsername(data.bluePlayer).subscribe(
      (users : User[]) => {
        this.bluePlayer = users[0];
        this.matchService.setBluePlayer(this.bluePlayer);
      });
    this.userService.getUserByUsername(data.redPlayer).subscribe(
      (users : User[]) => {
        this.redPlayer = users[0];
        this.matchService.setRedPlayer(this.redPlayer);
      }); 

    this.setUp();
  }

  ngAfterViewInit() {}
	
	setUp() {
    if (this.isBlue) {
      $('#words').addClass('bg-primary');
    }
    else {
      $('#words').addClass('bg-danger');
    }

    this.socket.on("startNumberGame", resultData => {
      this.bluePoints = resultData.bluePoints;
      this.blueMessage = resultData.blueWord + "  +" + this.bluePoints;
      this.redPoints = resultData.redPoints;
      this.redMessage = resultData.redWord + "  +" + this.redPoints;
      this.numbers = resultData.numbers;
      
      setTimeout( () => {
        this.currentGame = "numbers";
        this.redMessage = null;
        this.blueMessage = null;
        if (this.isBlue) {
          $('#words').removeClass('bg-primary');
          $('#numbers').addClass('bg-primary');
        }
        else {
          $('#words').removeClass('bg-danger');
          $('#numbers').addClass('bg-danger');
        }
      }, 5000);
    });

    this.socket.on("startCombinationGame", resultData => {
      if (resultData.blueCorrect) {
        this.blueMessage = resultData.blueNumber + "  +" + (resultData.bluePoints - this.bluePoints);
      }
      else {
        this.blueMessage = "x  +0";
      }
      this.bluePoints = resultData.bluePoints;

      if (resultData.redCorrect) {
        this.redMessage = resultData.redNumber + "  +" + (resultData.redPoints - this.redPoints);
      }
      else {
        this.redMessage = "x  +0";
      }
      this.redPoints = resultData.redPoints;
      if (this.isBlue) {
        this.combinations = resultData.blueCombination;
      }
      else {
        this.combinations = resultData.redCombination;
      }

      setTimeout( () => {
        this.currentGame = "combinations";
        this.redMessage = null;
        this.blueMessage = null;
        if (this.isBlue) {
          $('#numbers').removeClass('bg-primary');
          $('#combinations').addClass('bg-primary');
        }
        else {
          $('#numbers').removeClass('bg-danger');
          $('#combinations').addClass('bg-danger');
        }
      }, 5000);
    });

    this.socket.on("startPairsGame", pairs => {
      this.pairGames = pairs;
      //console.log(pairs);
    });
  }

  wordsGameOver(word : string) {
    this.gameService.checkWord(word).subscribe(
      correct => {
        const data = {
          word : word,
          username : this.currentPlayer.username,
          correct : correct
        }
        this.socket.emit("wordGameOver", data);
    })
  }

  numbersGameOver(expression : string) {
    var correct = this.gameService.checkExpression(expression);
    var number = 0;
    if (correct) {
      number = eval(expression);
    }
    const data = {
      number : number,
      numberToFind : this.numbers[6],
      username : this.currentPlayer.username,
      correct : correct
    }
    this.socket.emit("numberGameOver", data);
  }

  combinationsGameOver(data : any) {
    var isBlue = data.isBlue;
    var successfull = data.successfull;
    if (data.data) {
      isBlue = data.data.isBlue;
      successfull = data.data.successfull;
      this.pairGames = data.pairs;
      this.rightColumns = data.rightColumns;
    }
    if (isBlue) {
      if (successfull) {
        this.blueMessage = "+10";
        this.bluePoints += 10;
      }
      else {
        this.blueMessage = "+0";
      }
    }
    else {
      if (successfull) {
        this.redMessage = "+10";
        this.redPoints += 10;
      }
      else {
        this.redMessage = "+0";
      }
      setTimeout( () => {
        this.currentGame="pairs";
        this.blueMessage = null;
        this.redMessage = null;
        if (this.isBlue) {
          $('#combinations').removeClass('bg-primary');
          $('#pairs').addClass('bg-primary');
        }
        else {
          $('#combinations').removeClass('bg-danger');
          $('#pairs').addClass('bg-danger');
        }
      }, 5000);
    }
  }

  pairsGameOver(data : any) {
    this.blueMessage = "+" + data.bluePoints;
    this.bluePoints += data.bluePoints;
    this.redMessage = "+" + data.redPoints;
    this.redPoints += data.redPoints;
    if (this.isBlue == true) {
        this.matchService.insertMatchData(this.bluePlayer.username, this.redPlayer.username, this.bluePoints, this.redPoints, this.gameService.getTodaysDate()).subscribe(
          result => {}
        );
    }
    setTimeout( () => {
      this.currentGame="gameover";
      this.blueMessage = null;
      this.redMessage = null;
    }, 5000);
  }
}

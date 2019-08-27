import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GameDay} from './models/GameDay';
import {PairGame} from './models/PairGame';
import {Association} from './models/Association';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  uri='http://localhost:4000';

  constructor(private http: HttpClient) { }

  checkWord(word : string) {
    const data = {
      Term : word
    };
    return this.http.post(`${this.uri}/word/check`, data);
  }

  checkExpression(expression : string) {
    if (!expression || expression == "") {
      return false;
    }
    var result;
    try {
      result = eval(expression);
    } catch(e) {
      return false;
    }
    if (Number.isInteger(result)) {
      return true;
    }
    else {
      return false;
    }
  }

  shuffleArray(array) {
    var newArray = [];
    for (var i = 0; i < array.length; i++) {
      newArray[i] = array[i];
    }
    for (var i = newArray.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = newArray[i];
      newArray[i] = newArray[j];
      newArray[j] = temp;
    }
    return newArray;
  }

  getTodaysGame() {
    var date = this.getTodaysDate();
    const data  = {
      date : date
    }
    return this.http.post(`${this.uri}/get-todays-game`, data);
  }

  getGameDayForSpecificDate(date : Date) {
    const data  = {
      date : date
    }
    return this.http.post(`${this.uri}/get-todays-game`, data);
  }

  insertGameDay(date : Date, pairGame : PairGame, association : Association) {
      const data = {
          date : date,
          pairGame : pairGame,
          association : association
      }
      return this.http.post(`${this.uri}/game-day/insert`, data);
  }

  getAllPairsGames() {
    return this.http.post(`${this.uri}/pairs/get-all`, null);
  }

  generateLettersCombination() {
    var letters = [];
    for (var i = 0; i < 9; i++) {
        var number = Math.floor(Math.random() * 30) + 1;
        switch(number) {
            case 1: 
                letters.push("a");
                break;
            case 2: 
                letters.push("b");
                break;
            case 3: 
                letters.push("v");
                break;
            case 4: 
                letters.push("g");
                break;
            case 5: 
                letters.push("d");
                break;
            case 6: 
                letters.push("đ");
                break;
            case 7: 
                letters.push("e");
                break;
            case 8: 
                letters.push("ž");
                break;
            case 9: 
                letters.push("z");
                break;
            case 10: 
                letters.push("i");
                break;
            case 11: 
                letters.push("j");
                break;
            case 12: 
                letters.push("k");
                break;
            case 13: 
                letters.push("l");
                break;
            case 14: 
                letters.push("lj");
                break;
            case 15: 
                letters.push("m");
                break;
            case 16: 
                letters.push("n");
                break;
            case 17: 
                letters.push("nj");
                break;
            case 18: 
                letters.push("o");
                break;
            case 19: 
                letters.push("p");
                break;
            case 20: 
                letters.push("r");
                break;
            case 21: 
                letters.push("s");
                break;
            case 22: 
                letters.push("t");
                break;
            case 23: 
                letters.push("ć");
                break;
            case 24: 
                letters.push("u");
                break;
            case 25: 
                letters.push("f");
                break;
            case 26: 
                letters.push("h");
                break;
            case 27: 
                letters.push("c");
                break;
            case 28: 
                letters.push("č");
                break;
            case 29: 
                letters.push("dž");
                break;
            case 30: 
                letters.push("š");
                break;
        }
    }
    for (var i = 0; i < 3; i++) {
        var number = Math.floor(Math.random() * 5) + 1;
        switch (number) {
            case 1:
                letters.push("a");
                break;
            case 2: 
                letters.push("e");
                break;
            case 3:
                letters.push("i");
                break;
            case 4: 
                letters.push("o");
                break;
            case 5: 
                letters.push("u");
                break;
        }
    }
    return letters;
}

generateNumbersCombination() {
    var numbers = [];
    var number;
    for (var i = 0; i < 4; i++) {
        number = Math.floor(Math.random() * 9) + 1;
        numbers.push(number);
    }
    number = Math.floor(Math.random() * 3) + 1;
    switch(number) {
        case 1: 
            numbers.push(10);
            break;
        case 2:
            numbers.push(15);
            break;
        case 3:
            numbers.push(20);
            break;
    }
    number = Math.floor(Math.random() * 4) + 1;
    switch(number) {
        case 1: 
            numbers.push(25);
            break;
        case 2:
            numbers.push(50);
            break;
        case 3:
            numbers.push(75);
            break;
        case 4:
            numbers.push(100);
            break;
    }
    number = Math.floor(Math.random() * 999) + 1;
    numbers.push(number);
    return numbers;
}

generateCombinations() {
    var combination = [];
    for(var i = 0; i < 4; i++) {
        var number = Math.floor(Math.random() * 5);
        combination.push(number);
    }
    return combination;
}

insertGameDayResult(username : string, points : number) {
    var date = this.getTodaysDate();
    const data = {
        date : date,
        username : username,
        points : points
    }
    return this.http.post(`${this.uri}/game-day-result/create`, data);
}

getGameDayResultForUserForToday(username : string) {
    var date = this.getTodaysDate();
    const data = {
        date : date,
        username : username,
    }
    return this.http.post(`${this.uri}/game-day-result/get`, data);
}

getTopTenGameDayResultsForToday() {
    var date = this.getTodaysDate();
    const data = {
        date : date,
    }
    return this.http.post(`${this.uri}/game-day-result/get-sorted`, data);
}

getTodaysDate() {
    var date = new Date();
    date.setHours(0);
    date.setUTCHours(0);
    date.setMinutes(0);
    date.setUTCMinutes(0);
    date.setSeconds(0);
    date.setUTCSeconds(0);
    date.setMilliseconds(0);
    date.setUTCMilliseconds(0);
    return date;
}

insertWord(term : string) {
    const data = {
        Term : term
    };
    return this.http.post(`${this.uri}/word/insert`, data);
}

insertPairs(pairGame : PairGame) {
    return this.http.post(`${this.uri}/pairs/insert`, pairGame);
}

insertAssociations(association : Association) {
    return this.http.post(`${this.uri}/associations/insert`, association);
}

getAllAssociationsGames() {
    return this.http.post(`${this.uri}/associations/get-all`, null);
  }
}

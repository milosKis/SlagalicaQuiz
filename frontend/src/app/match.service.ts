import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Match} from './models/Match';
import {User} from './user.model';
import {GameService} from './game.service';

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  uri='http://localhost:4000';
  initialMatchData : any;
  bluePlayer : User;
  redPlayer : User;
  socket : any;

  constructor(private http: HttpClient, private gameService : GameService) { }

  createMatchRequest(playerBlue : string) {
    const data = {
      playerBlue : playerBlue,
      playerRed : "",
      pointsBlue : 0,
      pointsRed : 0,
      date : new Date(),
      winner : 0
    };
    return this.http.post(`${this.uri}/match/create-request`, data);
  }

  getAllMatchRequests() {
    return this.http.post(`${this.uri}/match/requests`, null);
  }

  getInitialMatchData() {
    return this.initialMatchData;
  }

  setInitialMatchData(newData) {
    this.initialMatchData = newData;
  }

  setBluePlayer(player : User) {
    this.bluePlayer = player;
  }

  getBluePlayer() {
    return this.bluePlayer;
  }

  setRedPlayer(player : User) {
    this.redPlayer = player;
  }

  getRedPlayer() {
    return this.redPlayer;
  }

  setSocket(socket : any) {
    this.socket = socket;
  }

  getSocket() {
    return this.socket;
  }

  insertMatchData(playerBlue, playerRed, pointsBlue, pointsRed, date) {
    const data = {
      playerBlue : playerBlue,
      playerRed : playerRed,
      pointsBlue : pointsBlue,
      pointsRed : pointsRed,
      date : date,
      winner : 0
    }
    return this.http.post(`${this.uri}/match/insert-match-data`, data);
  }

  getAllMatches() {
    return this.http.post(`${this.uri}/match/all-matches`, null);
  }

  getAllMatchesForPreviousDays(days : number) {
    var date : Date = this.gameService.getTodaysDate();
    date.setDate(date.getDate() - days);
    const data = {
      date : date
    }
    return this.http.post(`${this.uri}/match/all-matches-for-previous-days`, data);
  }

  getAllMatchesForPlayerForPreviousDays(username : string, days : number) {
    var date : Date = this.gameService.getTodaysDate();
    date.setDate(date.getDate() - days);
    const data = {
      username : username,
      date : date
    }
    return this.http.post(`${this.uri}/match/all-matches-for-player-for-previous-days`, data);
  }
}

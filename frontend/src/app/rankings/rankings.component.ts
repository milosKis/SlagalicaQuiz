import { Component, OnInit } from '@angular/core';
import {GameService} from '../game.service';
import {UsersService} from '../users.service';
import {GameDayResult} from '../models/GameDayResult';
import {User} from '../user.model';
import {Match} from '../models/Match';
import {MatchService} from '../match.service';
import {ShortPlayer} from '../models/ShortPlayer';

@Component({
  selector: 'app-rankings',
  templateUrl: './rankings.component.html',
  styleUrls: ['./rankings.component.css']
})
export class RankingsComponent implements OnInit {

  gameDayResults : GameDayResult[] = [];
  gameDayPlayers : User[] = [];
  sevenDaysPlayers : ShortPlayer[] = [];
  allTimePlayers : ShortPlayer[] = [];

  currentUser : User;

  constructor(private gameService : GameService, private userService : UsersService, private matchService : MatchService) { }

  ngOnInit() {
    this.currentUser = this.userService.getCurrentUser();
    this.gameService.getTopTenGameDayResultsForToday().subscribe(
      (results : GameDayResult[]) => {
        this.gameDayResults = results;
        if (results) {
          var usernames : string[] = [];
          for (var i = 0; i < results.length; i++) {
            usernames[i] = this.gameDayResults[i].username;
          }
          this.userService.getMultipleUsersByUsername(usernames).subscribe(
            (users : User[]) => {
              this.gameDayPlayers = users;
            }
          );
        }
      }
    );

    this.matchService.getAllMatchesForPreviousDays(7).subscribe(
      (matches : Match[]) => {
        this.sevenDaysPlayers = this.getPlayersTopList(matches);
      }
    );

    this.matchService.getAllMatches().subscribe(
      (matches : Match[]) => {
        this.allTimePlayers = this.getPlayersTopList(matches);
      }
    );
  }

  getPlayersTopList(matches : Match[]) {
    var array : ShortPlayer[] = [];
    for (var i = 0; i < matches.length; i++) {
      var index = this.findPlayersIndex(matches[i].playerBlue, array);
      if (index == -1) {
        var newPlayer : ShortPlayer = {
          username : matches[i].playerBlue,
          points : matches[i].pointsBlue
        };
        array.push(newPlayer);
      }
      else {
        array[index].points += matches[i].pointsBlue;
      }

      index = this.findPlayersIndex(matches[i].playerRed, array);
      if (index == -1) {
        var newPlayer : ShortPlayer = {
          username : matches[i].playerRed,
          points : matches[i].pointsRed
        };
        array.push(newPlayer);
      }
      else {
        array[index].points += matches[i].pointsRed;
      }
    }

    this.sortPlayersList(array);
    return array;
  }

  findPlayersIndex(username : string, array : ShortPlayer[]) {
    for (var i = 0; i < array.length; i++)
      if (array[i].username == username)
        return i;
    return -1;
  }

  sortPlayersList(array : ShortPlayer[]) {
    for (var i = 0; i < array.length - 1; i++) {
      for (var j = i + 1; j < array.length; j++) {
        if (array[j].points > array[i].points) {
          var temp = array[i];
          array[i] = array[j];
          array[j] = temp;
        }
      }
    }
  }
}

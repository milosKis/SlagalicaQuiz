import { Component, OnInit, AfterViewInit } from '@angular/core';
import {UsersService} from '../users.service';
import {User} from '../user.model';
import {MatchService} from '../match.service';
import {Router} from '@angular/router';
import * as $ from 'jquery';
import {GameService} from '../game.service';
import {PairGame} from '../models/PairGame';
import {Match} from '../models/Match';

@Component({
  selector: 'app-match-history',
  templateUrl: './match-history.component.html',
  styleUrls: ['./match-history.component.css']
})
export class MatchHistoryComponent implements OnInit {

  currentPlayer : User;
  matches : Match[] = [];;

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

    this.matchService.getAllMatchesForPlayerForPreviousDays(this.currentPlayer.username, 10).subscribe(
      (matches : Match[]) => {
        this.matches = matches;
      }
    );
  }

}

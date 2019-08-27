import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { UsersService } from '../users.service';
import {User} from '../user.model'
import {Router} from '@angular/router';
import io from 'socket.io-client';
import {Match} from '../models/Match';
import {MatchService} from '../match.service';


@Component({
  selector: 'app-match-requests',
  templateUrl: './match-requests.component.html',
  styleUrls: ['./match-requests.component.css']
})
export class MatchRequestsComponent implements OnInit {

  currentUser : User;
  bluePlayers : User[] = [];
  waitingForRedPlayer : boolean = false;

  // @ViewChild("game")
  // private gameCanvas : ElementRef;
  // private context : any;
  private socket : any;

  constructor(private userService: UsersService, private matchService : MatchService, private router : Router) { }

  ngOnInit() {
    this.currentUser = this.userService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login'])
    }
    else if (this.currentUser.type != "player") {
      this.router.navigate(['/user']);
    }
  }

  ngAfterViewInit() {
    this.socket = io("http://localhost:3000");
    this.socket.on("updateMatchRequests", usernames => {
      this.bluePlayers = [];
      for (var i = 0; i < usernames.length; i++) {
        if (this.currentUser.username != usernames[i]) {
          this.userService.getUserByUsername(usernames[i]).subscribe(
            (users : User[]) => {
              this.bluePlayers.push(users[0]);
            }
          )
        }
      }
    });

    this.socket.on("startMatch", data => {
      const newData = {
        bluePlayer : data.bluePlayer,
        redPlayer : data.redPlayer,
        letters : data.letters,
        socket : this.socket
      };
      this.matchService.setInitialMatchData(newData);
      this.router.navigate(['game']);
    });
  }

  acceptMatchRequest(user : User) {
    const data = {
      bluePlayer : user.username,
      redPlayer : this.currentUser.username
    };
    this.socket.emit("acceptMatchRequest", data);
  }

  createMatchRequest() {
    this.waitingForRedPlayer = true;
    this.socket.emit("createMatchRequest", this.currentUser.username);
    //nakon ovog se ocekuje da bude poslat zahtev startMatch
  }

  // public move(direction : string) {
  //   this.socket.emit("move", direction);
  // }

}

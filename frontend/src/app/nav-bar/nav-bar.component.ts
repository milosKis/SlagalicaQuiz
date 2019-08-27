import { Component, OnInit } from '@angular/core';
import {User} from '../user.model';
import {UsersService} from '../users.service';
import {Router} from '@angular/router'

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  user : User;

  constructor(public userService : UsersService, private router : Router) { }

  ngOnInit() {
    this.user = this.userService.getCurrentUser();
  }

  logout() : void {
    this.userService.logout();
    this.user = null;
    this.router.navigate(['/login'])
  }

}

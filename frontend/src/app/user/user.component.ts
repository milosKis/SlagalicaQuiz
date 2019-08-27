import { Component, OnInit, Input } from '@angular/core';
import { UsersService } from '../users.service';
import {User} from '../user.model'
import {Router} from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  user : User;
  constructor(private userService: UsersService, private router : Router) { }

  ngOnInit() {
    this.user = this.userService.getCurrentUser();
    if (!this.user) {
      this.router.navigate(['/login'])
    }
  }

}

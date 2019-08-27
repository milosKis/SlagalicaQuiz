import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import {User} from '../user.model'
import {Router} from '@angular/router';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {

  currentUser : User;
  users : User[] = [];
  constructor(private userService: UsersService, private router : Router) { }

  ngOnInit() {
    this.currentUser = this.userService.getCurrentUser();
    console.log(this.currentUser);
    if (!this.currentUser) {
      this.router.navigate(['/login'])
    }
    else if (this.currentUser.type != "admin") {
      this.router.navigate(['/user']);
    }

    this.userService.getAllUserRequests().subscribe(
      (users : User[]) => {
        this.users = users;
    });
  }

  acceptRequest(user : User) : void {
    this.userService.activateUser(user).subscribe(
      (updatedUser : User) => {
        var index = this.users.indexOf(user);
        this.users.splice(index, 1);
    })
  }

  deleteRequest(user : User) : void {
    this.userService.deleteUser(user).subscribe(
      (deletedUser : User) => {
        var index = this.users.indexOf(user);
        this.users.splice(index, 1);
    })
  }

}

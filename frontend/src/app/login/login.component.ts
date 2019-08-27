import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router'
import {UsersService} from '../users.service';
import {User} from '../user.model';
import {RegistrationValidatorService} from '../registration-validator.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
  usernameMessage: string;
  passwordMessage : string;

  constructor(private router: Router, private userService: UsersService, private registrationValidatorService : RegistrationValidatorService) { }

  ngOnInit() {
    
  }

  login() : void {   
    if (this.isValid()) {
      this.userService.login(this.username, this.password).subscribe((user: User[])=>{
        if (user && user[0]) {
          if (user[0].status == "nonactive") {
            this.usernameMessage = "Vas zahtev jos nije prihvacen";
            this.passwordMessage = null;
          } 
          else {
            this.usernameMessage = null;
            this.passwordMessage = null;
            this.userService.setCurrentUser(user[0]);
            this.router.navigate(['/user']);
          }
        }
        else {
          this.userService.getUserByUsername(this.username).subscribe(
            (user : User) => {
              if (user && user[0]) {
                this.usernameMessage = null;
                this.passwordMessage = this.registrationValidatorService.validatePassword(this.password);
                if (this.passwordMessage && this.passwordMessage != "Niste uneli lozinku!") { 
                  this.passwordMessage = "Neispravna lozinka!";
                }
                else {
                  this.passwordMessage = "Pogresna lozinka"
                }
              }
              else {
                this.usernameMessage = "Nepostojece korisnicko ime!";
                this.passwordMessage = this.registrationValidatorService.validatePassword(this.password);
                if (this.passwordMessage && this.passwordMessage != "Niste uneli lozinku!") { 
                  this.passwordMessage = "Neispravna lozinka!";
                }
              }
            }
          );
        }
      })
    }
  }

  isValid() : boolean {
    this.usernameMessage = this.registrationValidatorService.validateUsername(this.username);
    if (this.usernameMessage && this.usernameMessage != "Niste uneli korisnicko ime!") {
      this.usernameMessage = "Nepostojece korisnicko ime";
    }
    
    this.passwordMessage = this.registrationValidatorService.validatePassword(this.password);
      if (this.passwordMessage && this.passwordMessage != "Niste uneli lozinku!") {
        // if (this.usernameMessage) {
        //   this.passwordMessage = null;
        // }
        // else {
          //this.passwordMessage = "Pogresna lozinka!";
        //}
        if (this.usernameMessage) {
          this.passwordMessage = "Neispravna lozinka!";
        } 
        else {
          this.passwordMessage = null;
        }
      }
    
      if (this.usernameMessage || this.passwordMessage) {
        return false;
      }
      return true;
  }
}

import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router'
import {UsersService} from '../users.service';
import {User} from '../user.model';
import {RegistrationValidatorService} from '../registration-validator.service';


@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css']
})
export class PasswordChangeComponent implements OnInit {

  password : string;
  username : string;
  passwordMessage : string;
  usernameMessage : string;
  passwordNew : string;
  passwordNewConfirm : string;
  passwordNewMessage : string;
  passwordNewConfirmMessage : string;

  constructor(private router: Router, private userService: UsersService, private registrationValidatorService : RegistrationValidatorService) { }

  ngOnInit() {
    
  }

  changePassword() : void {   
    if (this.isValid()) {
      this.userService.login(this.username, this.password).subscribe((user: User[])=>{
        if (user && user[0]) {
          this.usernameMessage = null;
          this.passwordMessage = null;
          this.userService.changePassword(this.username, this.passwordNew).subscribe((user : User) => {
            this.router.navigate(['/login']);
          })
        }
        else {
          this.userService.getUserByUsername(this.username).subscribe(
            (user : User[]) => {
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
        if (this.usernameMessage) {
          this.passwordMessage = "Neispravna lozinka!";
        } 
        else {
          this.passwordMessage = null;
        }
      }
      
    this.passwordNewMessage = this.registrationValidatorService.validatePassword(this.passwordNew);
    this.passwordNewConfirmMessage = this.registrationValidatorService.validatePasswordAndConfirmedPassword(this.passwordNew, this.passwordNewConfirm);

    if (this.usernameMessage || this.passwordMessage || this.passwordNewMessage || this.passwordNewConfirmMessage) {
      return false;
    }
    return true;
  }
}

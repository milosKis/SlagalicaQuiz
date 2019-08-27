import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { UsersService } from '../users.service';
import {RegistrationValidatorService} from '../registration-validator.service';
import {Router} from '@angular/router';
import {User} from '../user.model';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  firstName : string;
  lastName : string;
  email : string;
  job : string;
  username : string;
  password : string;
  passwordConfirm : string;
  gender : string = 'male';
  birthday : string;
  file : File;
  imgSrc : string;

  firstNameMessage : string;
  lastNameMessage : string;
  emailMessage : string;
  jobMessage : string;
  usernameMessage : string;
  passwordMessage : string;
  passwordConfirmMessage : string;
  birthdayMessage : string;
  fileMessage : string;

  constructor(private router: Router, private userService : UsersService, private registrationValidatorService : RegistrationValidatorService) { }

  ngOnInit() {
    
  }

  onFileChanged(event) {
    this.file = event.target.files[0];
    if (this.file && this.isImage(this.file)) {
      var reader = new FileReader();
      reader.onload =this.handleFile.bind(this);
      reader.readAsBinaryString(this.file);
    }
    else {
      this.imgSrc = null;
    }
  }

  isImage(file : File) : boolean {
    if ((file.type === "image/png") || (file.type === "image/jpg") || (file.type === "image/jpeg")) {
      return true;
    }
    return false;
  }

  handleFile(event) {
    var binaryString = event.target.result;
    this.imgSrc = "data:" + this.file.type + ";base64," + btoa(binaryString);
   }

  register() {
    if (this.isValid()) {
      this.userService.getUserByUsername(this.username).subscribe(
        (user : User[]) => {
          if (user && (user[0])) {
            this.usernameMessage = "Postoji vec korisnik sa datim korisnickim imenom!";
          }
          else {
            this.userService.register(this.firstName, this.lastName, this.email, this.job, this.username, this.password, this.gender, this.birthday, this.imgSrc).subscribe(
              res => {console.log(res); this.router.navigate(['/login']);}
            );
          }
        }
      );
    }
  }

  isValid() : boolean {
    this.firstNameMessage = this.registrationValidatorService.validateFirstName(this.firstName);
    this.lastNameMessage = this.registrationValidatorService.validateLastName(this.lastName);
    this.emailMessage = this.registrationValidatorService.validateEmail(this.email);
    this.jobMessage = this.registrationValidatorService.validateJob(this.job);
    this.usernameMessage = this.registrationValidatorService.validateUsername(this.username);
    this.passwordMessage = this.registrationValidatorService.validatePassword(this.password);
    this.passwordConfirmMessage = this.registrationValidatorService.validatePasswordAndConfirmedPassword(this.password, this.passwordConfirm);
    this.birthdayMessage = this.registrationValidatorService.validateBirthday(this.birthday);
    this.fileMessage = this.registrationValidatorService.validatePhoto(this.file);
    if (this.firstNameMessage || this.lastNameMessage || this.emailMessage || this.jobMessage || this.usernameMessage || 
        this.passwordMessage || this.passwordConfirmMessage || this.birthdayMessage || this.fileMessage) {
          return false;
    }
    return true;
  }
}

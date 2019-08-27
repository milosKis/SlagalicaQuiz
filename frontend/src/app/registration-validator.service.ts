import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegistrationValidatorService {
  birthday : Date;

  constructor() { }

  validateFirstName(name : string) : string {
    if (name) {
      if (name.trim().length == 0) {
        return "Niste uneli ime!";
      }
      if ((name.length < 2) || (name.length > 40)) {
        return "Ime mora biti duzine izmedju 2 i 40 karaktera!";
      }
      else {
        return null;
      }
    }
    else {
      return "Niste uneli ime!";
    }
  }

  validateLastName(name : string) : string {
    if (name) {
      if (name.trim().length == 0) {
        return "Niste uneli prezime!";
      }
      if ((name.length < 2) || (name.length > 40)) {
        return "Prezime mora biti duzine izmedju 2 i 40 karaktera!";
      }
      else {
        return null;
      }
    }
    else {
      return "Niste uneli prezime!";
    }
  }

  validateEmail(email : string) : string {
    var emailCheck = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email) {
      if (email.trim().length == 0) {
        return "Niste uneli email!";
      }
      if (!emailCheck.test(email)) {
        return "Uneli ste nekorektan email!";
      }
      return null;
    }
    else {
      return "Niste uneli email!";
    }
  }

  validateJob(job : string) : string {
    if (job) {
      if (job.trim().length == 0) {
        return "Niste uneli zanimanje!";
      }
      if (job.length < 2 || job.length > 40) {
        return "Zanimanje mora biti duzine izmedju 2 i 40 karaktera!";
      }
      return null;
    }
    else {
      return "Niste uneli zanimanje!";
    }
  }

  validateUsername(username : string) : string {
    if (username) {
      if (username.trim().length == 0) {
        return "Niste uneli korisnicko ime!";
      }
      if (this.hasSpace(username)) {
        return "Korisnicko ime ne sme imati znak razmaka!";
      }
      if (username.length < 2 || username.length > 20) {
        return "Korisnicko ime mora biti duzine izmedju 2 i 20 karaktera";
      }
      return null;
    }
    else {
      return "Niste uneli korisnicko ime!";
    }
  }

  validatePassword(password : string) : string {
    if (password) {
      if (!(this.startsWithLetter(password) || (this.startsWithNumeric(password)))) {
        return "Lozinka mora poceti ili slovom ili numerikom!";
      }
      if (this.hasSpace(password)) {
        return "Lozinka ne sme imati znak razmaka!";
      }
      if (password.length < 8 || password.length > 16) {
        return "Lozinka mora biti duzine izmedju 8 i 16 karaktera!";
      }
      if (!this.hasUpperCase(password)) {
        return "Lozinka mora imati bar 1 veliko slovo!";
      }
      if (!this.hasLowerCases(password)) {
        return "Lozinka mora imati bar 3 mala slova!";
      }
      if (!this.hasNumeric(password)) {
        return "Lozinka mora imati bar 1 numerik!";
      }
      if (!this.hasSpecialCharacter(password)) {
        return "Lozinka mora imati bar 1 specijalni znak!";
      }
      if (this.hasFourSameCharactersInRow(password)) {
        return "Lozinka ne sme imati vise od 3 istih uzastopnih karaktera!";
      }
      return null;
    }
    else {
      return "Niste uneli lozinku!";
    }
  }

  validatePasswordAndConfirmedPassword(password : string, confirmPassword : string) : string {
    if (password) {
      if (confirmPassword) {
        if (password == confirmPassword) {
          return null;
        }
        return "Lozinka i potvrda lozinke se ne poklapaju!";
      }
      else {
        return "Niste uneli potvrdu lozinke!";
      }
    }
    return null;
  }

  validateBirthday(birthdayString : string) : string {
    var currentDate = new Date();
    if (birthdayString) {
      this.birthday = new Date(birthdayString);
      if (this.birthday.getTime() > currentDate.getTime()) {
        return "Izabrali ste datum u buducnosti!";
      }
      if (currentDate.getFullYear() - this.birthday.getFullYear() < 5) {
        return "Morate imati bar 5 godina kako biste napravili nalog!";
      }
      return null;
    }
    else {
      return "Niste uneli datum rodjenja!";
    }
  }

  validatePhoto(file : File) : string {
    var MAX_SIZE = 1050000;
    if(file) {
      if ((file.type == "image/png") || (file.type == "image/jpg") || (file.type == "image/jpeg")) {
        if (file.size > MAX_SIZE) {
          return "Fotografija mora biti manja od 1MB!";
        }
        return null;
      }
      else {
        return "Niste izabrali fotografiju, vec fajl pogresnog formata!";
      }
    }
    else {
      return "Niste izabrali fotografiju!";
    }
  }

  hasSpace(word : string) : boolean {
    if (word === word.trim()) {
      return false;
    }
    return true;
  }

  hasUpperCase(word : string) : boolean {
    for (var i = 0; i < word.length; i++) {
      if (word.charAt(i) == word.charAt(i).toUpperCase()) {
        return true;
      }
    }
    return false;
  }

  hasLowerCases(word : string) : boolean {
    var count = 0;
    for (var i = 0; i < word.length; i++) {
      if (word.charAt(i) != word.charAt(i).toUpperCase()) {
        count++;
      }
    }
    if (count >= 3) {
      return true;
    }
    return false;
  }

  hasNumeric(word : string) : boolean {
    for (var i = 0; i < word.length; i++) {
      if (!isNaN(parseInt(word.charAt(i)))) {
        return true;
      }
    }
    return false;
  }

  hasSpecialCharacter(word : string) : boolean {
    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    return format.test(word);
  }

  startsWithLetter(word : string) {
    if (word.charAt(0).toUpperCase() != word.charAt(0).toLowerCase()) {
      return true;
    }
    return false;
  }

  startsWithNumeric(word : string) {
    return !isNaN(parseInt(word.charAt(0)));
  }

  hasFourSameCharactersInRow(word : string) {
    for (var i = 1; i < word.length - 2; i++) {
      if (word.charAt(i) == word.charAt(i - 1) && word.charAt(i) == word.charAt(i + 1) && word.charAt(i) == word.charAt(i + 2)) {
        return true;
      }
    }
    return false;
  }
 }

import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from './user.model'



@Injectable({
  providedIn: 'root'
})
export class UsersService {

  uri='http://localhost:4000'

  constructor(private http: HttpClient) { }

  currentUser : User = null;

  login(username : string, password : string) {
    const data = {
      username: username,
      password: password,
    };

    return this.http.post(`${this.uri}/login`, data);
  }

  logout() {
    this.currentUser = null;
  }

  getUserByUsername(username : string) {
    const data = {
      username: username,
    };

    return this.http.post(`${this.uri}/user`, data);
  }

  getMultipleUsersByUsername(usernames : string[]) {
    const data = {
      usernames: usernames
    };

    return this.http.post(`${this.uri}/user/multiple`, data);
  }

  getCurrentUser() { 
    return this.currentUser;
  }

  setCurrentUser(user : User) {
    this.currentUser = user;
  }

  register(firstName, lastName, email, job, username, password, gender, birthday, photo){
    const data = {
      firstName : firstName,
      lastName : lastName,
      email : email,
      job : job,
      username: username,
      password: password,
      gender : gender,
      birthday : birthday,
      photo : photo,
      status : "nonactive",
      type : "player"
    }
    return this.http.post(`${this.uri}/register`, data);
  }

  changePassword(username : string, password : string) {
    const data = {
      username : username,
      password : password
    }
    return this.http.post(`${this.uri}/password-change`, data);
  }

  getAllUserRequests() {
    return this.http.post(`${this.uri}/requests`, null);
  }

  activateUser(user : User) {
    const data = {
      username : user.username
    }
    return this.http.post(`${this.uri}/requests/activate`, data);
  }

  deleteUser(user : User) {
    const data = {
      username : user.username
    }
    return this.http.post(`${this.uri}/requests/delete`, data);
  }

  getNews(){
    return this.http.get(`${this.uri}/news`);
  }

  getPensByOwner(owner){
    return this.http.get(`${this.uri}/pens/${owner}`);
  }

  delete(username){ 
    const data = {
      username : username
    };
    return this.http.post(`${this.uri}/delete`, data);
  }
}

import { Injectable } from '@angular/core';
import { SocketOne } from 'src/app/socket/SocketOne';


@Injectable({
  providedIn: 'root',
})
export class LoginSocketService{


  constructor(private socketOne:SocketOne) {
    //this.socketOne.emit('attemptLogin',{username:'username',password:"password"}, ()=>{});

  }

  tryLogin(username, password): any {
    this.socketOne.emit('attemptLogin',{username:username,password:password}, ()=>{});
  }



}

import { Injectable } from '@angular/core';
import { SocketOne } from 'src/app/socket/SocketOne';
import { Observable, Subject } from 'rxjs';
//import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginSocketService{

  private loginSubject = new Subject<any>();
  private loggedIn:boolean = false;
  private token;
  private playerData;

  constructor(private socketOne:SocketOne) {
    //this.socketOne.emit('attemptLogin',{username:'username',password:"password"}, ()=>{});
      this.socketOne.on('attemptLoginReply', (response)=>{
        this.loginSubject.next(response);
      });
  }

  public getLoginReplySubject(): Observable<any> {
    return this.loginSubject.asObservable();
  }

  public tryLogin(username, password): any {
    this.socketOne.emit('attemptLogin',{username:username,password:password}, ()=>{});
  }

  public isLoggedIn():boolean{
    return this.loggedIn;
  }

  setLoggedInuser(response: any): any {
      this.loggedIn = true;
      this.token = response.token;
      this.playerData = response.playerData;
  }


}

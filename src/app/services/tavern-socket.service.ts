import { Injectable } from '@angular/core';
import { SocketTavern } from 'src/app/socket/SocketTavern';
import { LoginSocketService } from 'src/app/services/login-socket.service';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TavernSocketService {

  private tavernSubject = new Subject<any>();

  constructor(private socketTavern:SocketTavern,
    private loginSocketService:LoginSocketService) {
      this.socketTavern.on('shoutBack', (response)=>{ //username:data.username,shout:data.shout
        this.tavernSubject.next(response);
      });
  }

  public register(){
      let playerData = this.loginSocketService.getPlayerData();
      this.socketTavern.emit("registry",{username:playerData.getUsername(), token:playerData.getToken()});
  }

  public shout(shout:String){
    let playerData = this.loginSocketService.getPlayerData();
    this.socketTavern.emit("shout",{username:playerData.getUsername(), token:playerData.getToken() ,shout:shout});
  }

  public getTavernSubject(): Observable<any> {
    return this.tavernSubject.asObservable();
  }

}

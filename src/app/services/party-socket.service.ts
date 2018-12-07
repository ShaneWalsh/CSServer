import { Injectable } from '@angular/core';
import { LoginSocketService } from 'src/app/services/login-socket.service';
import { Subject, Observable } from 'rxjs';
import { SocketParty } from 'src/app/socket/SocketParty';

@Injectable({
  providedIn: 'root'
})
export class PartySocketService {

  private partyChatSubject = new Subject<any>();
  private partyCreatedSubject = new Subject<any>();
  private partyNewSubject = new Subject<any>();
  private partyJoinedSubject = new Subject<any>();

  partyId = -1;
  partyLeader = false;
  partyQuest;

  constructor(private socketParty:SocketParty,
    private loginSocketService:LoginSocketService) {
      this.socketParty.on('shoutBack', (response)=>{
        this.partyChatSubject.next(response);
      });
      this.socketParty.on('createdParty', (response)=>{
        this.partyCreatedSubject.next(response);
      });
      this.socketParty.on('newParty', (response)=>{
        this.partyNewSubject.next(response);
      });
      this.socketParty.on('joinedParty', (response)=>{
        this.partyJoinedSubject.next(response);
      });

      // make a call to get the current parties.

      //socket.emit('createdParty',{partyId:partyId,partyName:partyName,publicParty:publicParty}); // reply only to the socket that created the party.
      //party.emit('',{partyId:partyId,partyName:partyName,publicParty:publicParty});
  }

  public register(){
      let playerData = this.loginSocketService.getPlayerData();
      this.socketParty.emit("registry",{username:playerData.getUsername(), token:playerData.getToken()});
  }

  public shout(shout:String){
    let playerData = this.loginSocketService.getPlayerData();
    this.socketParty.emit("shout",{username:playerData.getUsername(), token:playerData.getToken() ,shout:shout});
  }

  public getPartyChatSubject(): Observable<any> {
    return this.partyChatSubject.asObservable();
  }

  public inParty():boolean{
    return !(this.partyId === -1)
  }

  public isPartyLeader():boolean{
    return this.partyLeader;
  }

  createParty(data: any): any {
      let playerData = this.loginSocketService.getPlayerData();
      data["username"] = playerData.getUsername();
      data["token"] = playerData.getToken();

      this.socketParty.emit("createParty",data);
  }

}

import { Injectable } from '@angular/core';
import { LoginSocketService } from 'src/app/services/login-socket.service';
import { Subject, Observable } from 'rxjs';
import { SocketParty } from 'src/app/socket/SocketParty';

@Injectable({
  providedIn: 'root'
})
export class PartySocketService {

  private partyChatSubject = new Subject<any>();
  private partyNewSubject = new Subject<any>();
  private partyJoinedSubject = new Subject<any>();

  private partyId = -1;
  private partyName;
  private partyLeader = false;

  private partyQuest;
  private parties = [];

  constructor(private socketParty:SocketParty,
    private loginSocketService:LoginSocketService) {
      this.socketParty.on('shoutBack', (response)=>{
        this.partyChatSubject.next(response);
      });

      this.socketParty.on('createdParty', (response)=>{
        console.log(response);
        this.partyId = response.partyId;
        this.partyName = response.partyName;
        this.partyLeader = true;

      });

      this.socketParty.on('newParty', (response)=>{
        this.parties.push(response); // store the new party in the service, save us calling for them all again.
        this.partyNewSubject.next(this.parties); // send the party list to the front end.
      });

      // party destroyed, handle the same as above but the reverse
      this.socketParty.on('partyDestroyed', (response)=>{
        // todo find the right party matching the id, and remove it.
        //this.parties.splice(response); // store the new party in the service, save us calling for them all again.
        this.partyNewSubject.next(this.parties); // send the party list to the front end.
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

  public getPartyNewSubject(): Observable<any> {
    return this.partyNewSubject.asObservable();
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

import { Injectable } from '@angular/core';
import { LoginSocketService } from 'src/app/services/login-socket.service';
import { Subject, Observable } from 'rxjs';
import { SocketParty } from 'src/app/socket/SocketParty';
import { QuestAction } from 'src/app/model/QuestAction';
import { PlayerData } from 'src/app/model/PlayerData';
import { PartyData } from 'src/app/model/PartyData';

@Injectable({
  providedIn: 'root'
})
export class PartySocketService {
  private partyChatSubject = new Subject<any>();
  private partyNewSubject = new Subject<any>();
  private partyJoinedSubject = new Subject<PartyData>();
  private partyQuestSubject = new Subject<QuestAction>();
  private partyVoteSubject = new Subject<QuestAction>();

  private partyData:PartyData=null;
  private partyLeader = false;

  private partyQuestId;
  private partyQuest;
  private parties : PartyData[] = [];

  constructor(private socketParty:SocketParty,
    private loginSocketService:LoginSocketService) {
      this.socketParty.on('shoutBack', (response)=>{
        console.log(response);
        this.partyChatSubject.next(response);
      });

      this.socketParty.on('createdParty', (response)=>{
        this.partyData = new PartyData(response);
        this.partyLeader = true;

        this.partyJoinedSubject.next(response);
      });

      this.socketParty.on('newParty', (response)=>{
        this.parties.push(new PartyData(response)); // store the new party in the service, save us calling for them all again.
        this.partyNewSubject.next(this.parties); // send the party list to the front end.
      });

      this.socketParty.on('allExistingParties', (response)=>{
        console.log(response);
        // clear the parties.
        this.parties = [];
        for(let i = 0; i <  response.parties.length;i++){
        // then push all of the parties
          this.parties.push(new PartyData(response.parties[i]));
        }
        this.partyNewSubject.next(this.parties);
      });

      // party destroyed, handle the same as above but the reverse
      this.socketParty.on('partyDestroyed', (response)=>{
        // todo find the right party matching the id, and remove it.
        //this.parties.splice(response); // store the new party in the service, save us calling for them all again.
        this.partyNewSubject.next(this.parties); // send the party list to the front end.
      });

      // todo new party member alert
      this.socketParty.on('joinedParty', (response)=>{
        console.log(response);
        let playerData = this.loginSocketService.getPlayerData();
        if(response.username == playerData.getUsername()){
          this.partyData = new PartyData(response);
          this.partyLeader = false;
        } else{ // a different user has joined out party
          this.partyData = new PartyData(response);
        }
        this.partyJoinedSubject.next(this.partyData);
      });

      this.socketParty.on('launchQuest', (questData)=>{
        this.partyQuestId = questData.questId;
        let qa = new QuestAction("launchQuest",questData); // contains questId
        this.partyQuestSubject.next(qa);
      });

      // vote on dialog option
      this.socketParty.on('voteEmit', (voteData)=>{
        let qa = new QuestAction("vote",voteData);
        this.partyVoteSubject.next(qa);
      });

      // vote on dialog option
      this.socketParty.on('partyUpdateAction', (voteData)=>{
        let qa = new QuestAction(voteData.questActionCode,voteData);
        this.partyVoteSubject.next(qa);
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

  public getPartyJoinedSubject(): Observable<any> {
    return this.partyJoinedSubject.asObservable();
  }

  public getPartyQuestSubject(): Observable<any> {
    return this.partyQuestSubject.asObservable();
  }

  public getPartyVoteSubject(): Observable<any> {
    return this.partyVoteSubject.asObservable();
  }

  public inParty():boolean{
    return this.partyData != null
  }

  public isPartyLeader():boolean{
    return this.partyLeader;
  }

  public getPartyQuestId():number{
    return this.partyQuestId;
  }

  public getPartySize(): number {
      return this.getMembers().length;
  }

  public getMembers():PlayerData[]{
    return this.partyData.getMembers();
  }

  public getPartyId():any{
    return this.partyData.getPartyId();
  }

  createParty(data: any): any {
      let playerData = this.loginSocketService.getPlayerData();
      data["username"] = playerData.getUsername();
      data["token"] = playerData.getToken();

      this.socketParty.emit("createParty",data);
  }

  joinParty(partyId: string): any {
      let data = {partyId:partyId};
      let playerData = this.loginSocketService.getPlayerData();
      data["username"] = playerData.getUsername();
      data["token"] = playerData.getToken();
      this.socketParty.emit("joinParty",data);
  }

  startQuest(questId: number): any {
    let data = {partyId:this.getPartyId(), questId:questId};
    let playerData = this.loginSocketService.getPlayerData();
    data["username"] = playerData.getUsername();
    data["token"] = playerData.getToken();
    this.socketParty.emit("startQuest",data);
  }

  vote(choiceId: any) {
    let data = {partyId:this.getPartyId(), choiceId:choiceId};
    let playerData = this.loginSocketService.getPlayerData();
    data["username"] = playerData.getUsername();
    data["token"] = playerData.getToken();
    this.socketParty.emit("voteSubmit",data);
  }

  sendChosenVote(choiceId: any, taskData:any={}) {
    let data = {partyId:this.getPartyId(), choiceId:choiceId, questActionCode:"chosenVoteAction",taskData};
    let playerData = this.loginSocketService.getPlayerData();
    data["username"] = playerData.getUsername();
    data["token"] = playerData.getToken();
    this.socketParty.emit("partyUpdate",data);
  }

  getAllParties(){
    let data = {};
    let playerData = this.loginSocketService.getPlayerData();
    data["username"] = playerData.getUsername();
    data["token"] = playerData.getToken();
    this.socketParty.emit("getAllParties", data);
  }

}

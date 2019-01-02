import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PartySocketService } from 'src/app/services/party-socket.service';
import { Subscription } from 'rxjs';
import { QuestSocketService } from 'src/app/services/quest-socket.service';
import { QuestData } from 'src/app/model/QuestData';
import { QuestAction } from 'src/app/model/QuestAction';

@Component({
  selector: 'app-party',
  templateUrl: './party.component.html',
  styleUrls: ['./party.component.css']
})
export class PartyComponent implements OnInit {

  inParty:boolean = false;
  party:any; // the users current party;
  partyLeader:boolean = false;
  parties:any[]; // current list of all parties.
  model ={publicParty:true, partyName:"Raging Rhinos", partyDescription:"An awesome good time!"}
  quests:QuestData[];

  @Output() launchedQuest: EventEmitter<number> = new EventEmitter();

  private subscriptionNewParty: Subscription;
  private subscriptionJoinedParty: Subscription;
  private subscriptionPartyQuestSubject: Subscription;

  constructor(private partySocketService:PartySocketService, private questSocketService:QuestSocketService) {
    this.subscriptionNewParty = this.partySocketService.getPartyNewSubject().subscribe(parties => {
      this.parties = parties;
    });
    this.subscriptionPartyQuestSubject = this.partySocketService.getPartyQuestSubject().subscribe(questAction => {
      this.handleQuestAction(questAction);
    });
    this.subscriptionJoinedParty = this.partySocketService.getPartyJoinedSubject().subscribe(party => {
      this.party = party;
      this.partyLeader = this.partySocketService.isPartyLeader();
      this.inParty = true;
    });
    this.quests = this.questSocketService.getQuestList();

    // on init, go get the latest games
    this.partySocketService.getAllParties();
  }

  ngOnInit() {

  }

  createParty(){
    this.partySocketService.createParty(this.model);
  }

  joinParty(partyId:string){
    this.partySocketService.joinParty(partyId);
  }

  startQuest(questId:number){
      this.partySocketService.startQuest(questId);
  }

  handleQuestAction(questAction: QuestAction) {
      if(questAction.getAction() == "launchQuest"){
        console.log("Launching "+questAction.getData().questId);
        this.launchedQuest.emit(questAction.getData().questId)
      } else{
        //todo _s log an error something has gone wrong
      }
  }

  ngOnDestroy() {
      this.subscriptionNewParty.unsubscribe();
      this.subscriptionJoinedParty.unsubscribe();
      this.subscriptionPartyQuestSubject.unsubscribe();
  }
}

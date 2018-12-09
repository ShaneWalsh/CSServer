import { Component, OnInit } from '@angular/core';
import { PartySocketService } from 'src/app/services/party-socket.service';
import { Subscription } from 'rxjs';
import { QuestSocketService } from 'src/app/services/quest-socket.service';
import { QuestData } from 'src/app/model/QuestData';

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

  private subscriptionNewParty: Subscription;
  private subscriptionJoinedParty: Subscription;

  constructor(private partySocketService:PartySocketService, private questSocketService:QuestSocketService) {
    this.subscriptionNewParty = this.partySocketService.getPartyNewSubject().subscribe(parties => {
      this.parties = parties;
    });
    this.subscriptionJoinedParty = this.partySocketService.getPartyJoinedSubject().subscribe(party => {
      this.party = party;
      this.partyLeader = this.partySocketService.isPartyLeader();
      this.inParty = true;
    });
    this.quests = this.questSocketService.getQuestList();
    console.log(this.quests)
    //console.log(this.quests[0].getData()["default"])
  }

  ngOnInit() {

  }

  createParty(){
    this.partySocketService.createParty(this.model);
  }

  joinParty(partyId:string){
    this.partySocketService.joinParty(partyId);
  }

  ngOnDestroy() {
      this.subscriptionNewParty.unsubscribe();
      this.subscriptionJoinedParty.unsubscribe();
  }
}

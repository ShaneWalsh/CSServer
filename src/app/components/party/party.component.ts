import { Component, OnInit } from '@angular/core';
import { PartySocketService } from 'src/app/services/party-socket.service';
import { Subscription } from 'rxjs';

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

  private subscriptionNewParty: Subscription;
  private subscriptionJoinedParty: Subscription;

  constructor(private partySocketService:PartySocketService) {
    this.subscriptionNewParty = this.partySocketService.getPartyNewSubject().subscribe(parties => {
      this.parties = parties;
    });
    this.subscriptionJoinedParty = this.partySocketService.getPartyJoinedSubject().subscribe(party => {
      this.party = party;
      this.partyLeader = this.partySocketService.isPartyLeader();
      this.inParty = true;
    });
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

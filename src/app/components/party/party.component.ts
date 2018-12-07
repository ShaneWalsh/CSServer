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
  parties:any[];
  model ={publicParty:true, partyName:"Ragining Rhinos"}

  private subscriptionNewParty: Subscription;

  constructor(private partySocketService:PartySocketService) {
    this.subscriptionNewParty = this.partySocketService.getPartyNewSubject().subscribe(parties => {
      this.parties = parties;
    });
  }

  ngOnInit() {
  }

  createParty(){
    this.partySocketService.createParty(this.model);
  }

  ngOnDestroy() {
      this.subscriptionNewParty.unsubscribe();
  }
}

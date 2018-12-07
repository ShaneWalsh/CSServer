import { Component, OnInit } from '@angular/core';
import { PartySocketService } from 'src/app/services/party-socket.service';

@Component({
  selector: 'app-party',
  templateUrl: './party.component.html',
  styleUrls: ['./party.component.css']
})
export class PartyComponent implements OnInit {

  inParty:boolean = false;
  parties:any[];
  model ={publicParty:true, partyName:"Ragining Rhinos"}

  constructor(private partySocketService:PartySocketService) {
    //partySocketService
  }

  ngOnInit() {
  }

  createParty(){
    this.partySocketService.createParty(this.model);
  }

}

import { Component } from '@angular/core';
import { TavernSocketService } from 'src/app/services/tavern-socket.service';
import { PartySocketService } from 'src/app/services/party-socket.service';
//import { LoginSocketService } from 'src/app/services/login-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CryptShyfterClientAng7';
  showLogin = true;
  showMain = false;
  showQuest = false;

  constructor(private tavernSocketService:TavernSocketService,
              private partySocketService:PartySocketService){

  }

  handleLoggedIn(){
    this.showLogin = false;
    // register the sockets as we now have a valid user.
    this.tavernSocketService.register();
    this.partySocketService.register();
    this.showMain = true;
  }

  launchedQuest(){
    this.showMain = false;
    this.showQuest = true;
  }
}

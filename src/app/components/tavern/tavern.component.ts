import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TavernSocketService } from 'src/app/services/tavern-socket.service';

@Component({
  selector: 'app-tavern',
  templateUrl: './tavern.component.html',
  styleUrls: ['./tavern.component.css']
})
export class TavernComponent implements OnInit {

  private shouts:any[]=[];
  private model:any={shout:""};
  private subscription: Subscription;

  constructor(private tavernSocketService:TavernSocketService) {
    this.subscription = this.tavernSocketService.getTavernSubject().subscribe(shoutData => {
      this.addShout(shoutData)
    });
 }

  ngOnInit() {

  }

  addShout(shoutData){
    this.shouts.push(shoutData);
    if(this.shouts.length > 10){
      this.shouts.splice(0,1);
    }
  }

  onSubmit(){
    this.tavernSocketService.shout(this.model.shout);
    this.model.shout = "";
  }

  ngOnDestroy() {
      this.subscription.unsubscribe();
  }

}

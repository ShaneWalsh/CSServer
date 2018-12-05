import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { LoginSocketService } from 'src/app/services/login-socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  model:any = {username:"", password:""};
  loginFailed = false;
  @Output() loggedIn: EventEmitter<any> = new EventEmitter();

  private subscription: Subscription;

  constructor(private loginSocketService:LoginSocketService) {
    this.subscription = this.loginSocketService.getLoginReplySubject().subscribe(response =>
    {
      this.handleLoginReply(response)
    });
  }

  ngOnInit() {

  }

  onSubmit(){
    this.loginFailed = false;
    this.loginSocketService.tryLogin(this.model.username, this.model.password)
  }

  handleLoginReply(response){
    console.log(response);
    if(response.error){
      this.loginFailed = true;
    } else if(response.token){
      this.loginFailed = false;
      this.loginSocketService.setLoggedInuser(response);
      this.loggedIn.emit(null);
      // todo inform the parent componet that we need to close the login screen and show the main app.
    }
  }

  ngOnDestroy() {
      // unsubscribe to ensure no memory leaks
      this.subscription.unsubscribe();
  }
}

/*


import { MessageService } from './_services/index';

@Component({
    selector: 'app',
    templateUrl: 'app.component.html'
})

export class AppComponent implements OnDestroy {
    message: any;
    subscription: Subscription;

    constructor(private messageService: MessageService) {
        // subscribe to home component messages
        this.subscription = this.messageService.getMessage().subscribe(message => { this.message = message; });
    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.subscription.unsubscribe();
    }
}
*/

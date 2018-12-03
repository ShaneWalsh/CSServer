import { Component, OnInit } from '@angular/core';
import { LoginSocketService } from 'src/app/services/login-socket.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private loginSocketService:LoginSocketService) { }

  ngOnInit() {
  }

  onSubmit(){
    console.log("attemptedLogin");
  }

}

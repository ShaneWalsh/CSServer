import { Component, OnInit } from '@angular/core';
import { LoginSocketService } from 'src/app/services/login-socket.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  constructor(private loginSocketService:LoginSocketService) { }

  ngOnInit() {
    this.loginSocketService.ping();
  }

}

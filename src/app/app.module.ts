import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SocketIoModule } from 'ngx-socket-io';
import {FormsModule} from "@angular/forms";


import { AppComponent } from './app.component';
import { SocketOne } from 'src/app/socket/SocketOne';
//import { LoginSocketService } from 'src/app/Services/login-socket.service';
import { LoginComponent } from './components/login/login.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    SocketIoModule,
    FormsModule,
  ],
  providers: [SocketOne],
  bootstrap: [AppComponent]
})
export class AppModule { }

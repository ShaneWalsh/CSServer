import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SocketIoModule } from 'ngx-socket-io';
import {FormsModule} from "@angular/forms";


import { AppComponent } from './app.component';
import { SocketOne } from 'src/app/socket/SocketOne';
import { SocketTavern } from 'src/app/socket/SocketTavern';
//import { LoginSocketService } from 'src/app/Services/login-socket.service';
import { LoginComponent } from './components/login/login.component';
import { TavernComponent } from './components/tavern/tavern.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TavernComponent
  ],
  imports: [
    BrowserModule,
    SocketIoModule,
    FormsModule,
  ],
  providers: [SocketOne,
              SocketTavern],
  bootstrap: [AppComponent]
})
export class AppModule { }

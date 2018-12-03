import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SocketIoModule } from 'ngx-socket-io';


import { AppComponent } from './app.component';
import { SocketOne } from 'src/app/socket/SocketOne';
//import { LoginSocketService } from 'src/app/Services/login-socket.service';
import { TestComponent } from './components/test/test.component';



@NgModule({
  declarations: [
    AppComponent,
    TestComponent
  ],
  imports: [
    BrowserModule,
    SocketIoModule,
  ],
  providers: [SocketOne],
  bootstrap: [AppComponent]
})
export class AppModule { }

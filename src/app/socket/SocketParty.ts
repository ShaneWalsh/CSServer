import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable()
export class SocketParty extends Socket {

    constructor() {
        super({ url: 'ws://localhost:5000/party', options: {} });
        //super({ url: 'wss://stark-citadel-98860.herokuapp.com/party', options: {} });
    }


}

import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable()
export class SocketTavern extends Socket {

    constructor() {
        super({ url: 'ws://localhost:5000/tavern', options: {} });
        //super({ url: 'wss://stark-citadel-98860.herokuapp.com/tavern', options: {} });
    }

}

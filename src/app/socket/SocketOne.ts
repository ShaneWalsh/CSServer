import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable()
export class SocketOne extends Socket {

    constructor() {
        //
        super({ url: 'ws://localhost:5000/login', options: {} });
        //super({ url: 'wss://stark-citadel-98860.herokuapp.com/login', options: {} });
    }

}

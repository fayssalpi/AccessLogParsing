import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogWebSocketService {
  private client: Client;
  private logUpdateSubject = new Subject<any>();

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = () => {
      this.client.subscribe('/topic/logs', (message: IMessage) => {
        if (message.body) {
          this.logUpdateSubject.next(JSON.parse(message.body));
        }
      });
    };

    this.client.activate();
  }

  getLogUpdates() {
    return this.logUpdateSubject.asObservable();
  }
}

import { Injectable } from '@angular/core';
import { Client, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject, Observable } from 'rxjs';
import { PhaseEvent } from '../models/phase-event.model';
import { BlindtestStartedEvent, BlindtestFinishedEvent } from '../models/blindtest-event.model';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private client: Client | null = null;
  private connected = false;

  // Subjects pour les événements
  private phaseSubject = new Subject<PhaseEvent>();
  private startedSubject = new Subject<BlindtestStartedEvent>();
  private finishedSubject = new Subject<BlindtestFinishedEvent>();
  private connectionSubject = new Subject<boolean>();

  // Observables publics
  phase$ = this.phaseSubject.asObservable();
  started$ = this.startedSubject.asObservable();
  finished$ = this.finishedSubject.asObservable();
  connection$ = this.connectionSubject.asObservable();

  constructor() {}

  connect(): void {
    if (this.connected) {
      console.log('🔵 [WebSocket] Already connected');
      return;
    }

    console.log('🔵 [WebSocket] Connecting to ws://localhost:8080/ws...');

    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: (frame) => {
        console.log('✅ [WebSocket] Connected successfully');
        this.connected = true;
        this.connectionSubject.next(true);
        this.subscribeToTopics();
      },

      onDisconnect: () => {
        console.log('❌ [WebSocket] Disconnected');
        this.connected = false;
        this.connectionSubject.next(false);
      },

      onStompError: (frame) => {
        console.error('❌ [WebSocket] STOMP error:', frame);
      },

      onWebSocketError: (event) => {
        console.error('❌ [WebSocket] WebSocket error:', event);
      }
    });

    this.client.activate();
  }

  private subscribeToTopics(): void {
    if (!this.client) return;

    // Abonnement aux changements de phase
    this.client.subscribe('/topic/blindtest/phase', (message) => {
      console.log('📨 [WebSocket] Phase event received:', message.body);
      const event: PhaseEvent = JSON.parse(message.body);
      this.phaseSubject.next(event);
    });

    // Abonnement au démarrage
    this.client.subscribe('/topic/blindtest/started', (message) => {
      console.log('📨 [WebSocket] Started event received:', message.body);
      const event: BlindtestStartedEvent = JSON.parse(message.body);
      this.startedSubject.next(event);
    });

    // Abonnement à la fin
    this.client.subscribe('/topic/blindtest/finished', (message) => {
      console.log('📨 [WebSocket] Finished event received:', message.body);
      const event: BlindtestFinishedEvent = JSON.parse(message.body);
      this.finishedSubject.next(event);
    });

    console.log('✅ [WebSocket] Subscribed to all topics');
  }

  disconnect(): void {
    if (this.client) {
      console.log('🔵 [WebSocket] Disconnecting...');
      this.client.deactivate();
      this.connected = false;
      this.client = null;
    }
  }

  isConnected(): boolean {
    return this.connected;
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private apiUrl = 'http://localhost:8080/api/logs';  // Spring Boot endpoint
  private logsSubject = new Subject<void>();

  constructor(private http: HttpClient) { }

  getLogs(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(logs => {
        const transformedLogs = {
          errors: logs.filter(log => log.error),
          severities: logs.filter(log => log.severity),
          clients: logs.filter(log => log.clientIp),
          endpoints: logs.filter(log => log.request),
          user_agents: logs.filter(log => log.userAgent)
        };
        return transformedLogs;
      })
    );
  }

  refreshLogs(): void {
    this.logsSubject.next();
  }

  getLogRefreshNotifier(): Observable<void> {
    return this.logsSubject.asObservable();
  }
}

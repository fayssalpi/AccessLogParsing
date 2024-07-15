import { Component, OnInit } from '@angular/core';
import { LogService } from '../aaServices/log.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-info-log-display',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './info-log-display.component.html',
  styleUrls: ['./info-log-display.component.css']
})
export class InfoLogDisplayComponent implements OnInit {
  logs: any = {
    errors: [],
    severities: [],
    clients: [],
    endpoints: [],
    user_agents: []
  };

  constructor(private logService: LogService) {}

  ngOnInit(): void {
    this.logService.getLogs().subscribe(data => {
      this.logs = data;
      console.log('Logs fetched successfully', this.logs); // Debugging log
    }, error => {
      console.error('Failed to fetch logs', error);
    });
  }
}

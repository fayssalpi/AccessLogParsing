import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LogWebSocketService } from '../aaServices/log-websocket.service';
import { CommonModule } from '@angular/common';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, NgxChartsModule]
})
export class FileUploadComponent implements OnInit {
  selectedFile: File | null = null;
  isLoading: boolean = false;
  statusChartData: any[] = [];
  browserFamilyChartData: any[] = [];
  osFamilyChartData: any[] = [];


  statusColorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  browserFamilyColorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']
  };

  osFamilyColorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a']
  };

  constructor(private http: HttpClient, private logWebSocketService: LogWebSocketService) {}

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    this.selectedFile = file;
  }

  onUpload(): void {
    if (this.selectedFile) {
      this.isLoading = true;
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);

      this.http.post('http://localhost:5000/upload', formData)
        .subscribe(response => {
          console.log('Upload success', response);
          this.isLoading = false;
        });
    } else {
      console.error('No file selected');
    }
  }

  ngOnInit() {
    this.logWebSocketService.getLogUpdates().subscribe(data => {
      console.log('Received status data from WebSocket:', data);
      this.updateStatusChart(data);
    });

    this.logWebSocketService.getBrowserFamilyUpdates().subscribe(data => {
      console.log('Received browser family data from WebSocket:', data);
      this.updateBrowserFamilyChart(data);
    });

    this.logWebSocketService.getOsFamilyUpdates().subscribe(data => {
      console.log('Received OS family data from WebSocket:', data);
      this.updateOsFamilyChart(data);
    });

// Uncomment the following lines to test with dummy data initially
    // this.updateStatusChart({
    //   '200': 2798704,
    //   '404': 30250,
    //   '500': 63770
    // });

    // this.updateBrowserFamilyChart({
    //   'Chrome': 500,
    //   'Firefox': 300
    // });

    // this.updateOsFamilyChart({
    //   'Android': 600,
    //   'iOS': 200
    // });
  }

  updateStatusChart(data: any) {
    this.statusChartData = Object.keys(data).map(key => ({
      name: key,
      value: data[key]
    }));
    console.log('Updated status chart data:', this.statusChartData);
  }

  updateBrowserFamilyChart(data: any) {
    this.browserFamilyChartData = Object.keys(data).map(key => ({
      name: key,
      value: data[key]
    }));
    console.log('Updated browser family chart data:', this.browserFamilyChartData);
  }

  updateOsFamilyChart(data: any) {
    this.osFamilyChartData = Object.keys(data).map(key => ({
      name: key,
      value: data[key]
    }));
    console.log('Updated OS family chart data:', this.osFamilyChartData);
  }
}

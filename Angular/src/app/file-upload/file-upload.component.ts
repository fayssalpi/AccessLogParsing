import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LogWebSocketService } from '../aaServices/log-websocket.service';
import { CommonModule } from '@angular/common';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { ChangeDetectorRef } from '@angular/core';

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
  chartData: any[] = [];
  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor(
    private http: HttpClient, 
    private logWebSocketService: LogWebSocketService,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {}

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
      console.log('Received data from WebSocket:', data);
      this.updateChart(data);
    });

    // Uncomment the following lines to test with dummy data initially
    // this.updateChart({
    //   '200': 2798704,
    //   '404': 30250,
    //   '500': 63770
    // });
  }

  updateChart(data: any) {
    this.chartData = Object.keys(data).map(key => ({
      name: key,
      value: data[key]
    }));
    console.log('Updated chart data:', this.chartData);

    // Trigger change detection to update the chart
    this.cdr.detectChanges();
  }
}

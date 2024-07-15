import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoLogDisplayComponent } from './info-log-display.component';

describe('InfoLogDisplayComponent', () => {
  let component: InfoLogDisplayComponent;
  let fixture: ComponentFixture<InfoLogDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoLogDisplayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfoLogDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

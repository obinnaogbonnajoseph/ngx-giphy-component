import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxGiphyGridComponent } from './ngx-giphy-grid.component';

describe('NgxGiphyGridComponent', () => {
  let component: NgxGiphyGridComponent;
  let fixture: ComponentFixture<NgxGiphyGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxGiphyGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxGiphyGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

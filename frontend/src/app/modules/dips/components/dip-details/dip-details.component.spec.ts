import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DipDetailsComponent } from './dip-details.component';

describe('DipDetailsComponent', () => {
  let component: DipDetailsComponent;
  let fixture: ComponentFixture<DipDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DipDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DipDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

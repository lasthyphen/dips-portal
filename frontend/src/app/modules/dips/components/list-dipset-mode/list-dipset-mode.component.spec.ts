import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDipsetModeComponent } from './list-dipset-mode.component';

describe('ListDipsetModeComponent', () => {
  let component: ListDipsetModeComponent;
  let fixture: ComponentFixture<ListDipsetModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListDipsetModeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDipsetModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

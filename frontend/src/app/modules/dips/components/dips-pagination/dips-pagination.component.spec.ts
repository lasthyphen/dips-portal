import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DipsPaginationComponent } from './dips-pagination.component';

describe('DipsPaginationComponent', () => {
  let component: DipsPaginationComponent;
  let fixture: ComponentFixture<DipsPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DipsPaginationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DipsPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

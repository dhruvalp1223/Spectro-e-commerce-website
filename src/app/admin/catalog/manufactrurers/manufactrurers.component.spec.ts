import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactrurersComponent } from './manufactrurers.component';

describe('ManufactrurersComponent', () => {
  let component: ManufactrurersComponent;
  let fixture: ComponentFixture<ManufactrurersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufactrurersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactrurersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

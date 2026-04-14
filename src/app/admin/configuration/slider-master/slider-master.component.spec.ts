import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderMasterComponent } from './slider-master.component';

describe('SliderMasterComponent', () => {
  let component: SliderMasterComponent;
  let fixture: ComponentFixture<SliderMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SliderMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SliderMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

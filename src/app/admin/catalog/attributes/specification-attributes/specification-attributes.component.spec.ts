import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificationAttributesComponent } from './specification-attributes.component';

describe('SpecificationAttributesComponent', () => {
  let component: SpecificationAttributesComponent;
  let fixture: ComponentFixture<SpecificationAttributesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecificationAttributesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecificationAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

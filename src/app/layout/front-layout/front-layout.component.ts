import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FrontFooterComponent } from './front-footer/front-footer.component';
import { FrontHeaderComponent } from './front-header/front-header.component';

@Component({
  selector: 'app-front-layout',
  templateUrl: './front-layout.component.html',
  styleUrls: ['./front-layout.component.scss'], // Corrected property name
  standalone: true, // Optional if this component is standalone
  imports: [RouterOutlet, FrontFooterComponent, FrontHeaderComponent], // Ensure standalone components are imported
  encapsulation: ViewEncapsulation.None // ✅ Allows styles to apply globally
})
export class FrontLayoutComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}

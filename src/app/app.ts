import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./pages/navbar/navbar";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar],
  template: `
  <app-navbar></app-navbar>
  <router-outlet></router-outlet>`,
  styleUrls: ['./app.css'],
})
export default class AppComponent {
  title = signal('frontend');
}

import { Component, signal } from '@angular/core';
import { Names } from "./names/names";

@Component({
  selector: 'app-root',
  imports: [Names],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}

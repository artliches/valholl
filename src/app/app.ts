import { Component, signal } from '@angular/core';
import { Names } from "./names/names";
import { Abilities } from "./abilities/abilities";

@Component({
  selector: 'app-root',
  imports: [Names, Abilities],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}

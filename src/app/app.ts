import { Component, signal } from '@angular/core';
import { Names } from "./names/names";
import { Abilities } from "./abilities/abilities";
import { Job } from "./job/job";
import { JobObj } from './assets/models/valholl-interfaces';

@Component({
  selector: 'app-root',
  imports: [Names, Abilities, Job],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  currentJob: JobObj = {} as JobObj;
  showRolls: boolean = false;

  getNewJob(currJob: JobObj) {
    this.currentJob = currJob;
  }
}

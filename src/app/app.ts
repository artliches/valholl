import { Component, signal } from '@angular/core';
import { Names } from "./names/names";
import { Abilities } from "./abilities/abilities";
import { Job } from "./job/job";
import { JobObj, StartingEquipmentObj } from '../../public/assets/models/valholl-interfaces';
import { Equipment } from "./equipment/equipment";

@Component({
  selector: 'app-root',
  imports: [Names, Abilities, Job, Equipment],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  currentJob: JobObj = {} as JobObj;
  currJobStartEquip: StartingEquipmentObj[] = [];
  showRolls: boolean = false;

  getNewJob(currJob: JobObj) {
    this.currentJob = currJob;
    this.currJobStartEquip = currJob.startingEquipment;
  }
}

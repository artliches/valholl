import { Component, OnInit, signal } from '@angular/core';
import { Names } from "./names/names";
import { Abilities } from "./abilities/abilities";
import { Job } from "./job/job";
import { JobObj, StartingEquipmentObj } from '../../public/assets/models/valholl-interfaces';
import { Equipment } from "./equipment/equipment";
import { RandomNumber } from './services/random-number';

@Component({
  selector: 'app-root',
  imports: [Names, Abilities, Job, Equipment],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  constructor (
    private randomNumberService: RandomNumber
  ) {}
  triggerReroll: boolean = false;
  currentJob: JobObj = {} as JobObj;
  currJobStartEquip: StartingEquipmentObj[] = [];
  showRolls: boolean = false;

  rerollTexts: string[] = [
    'SEND THIS ONE TO VALHOLL',
    'SEND THIS ONE TO HEL',
    'THIS ONE HAS SUNG THEIR LAST SAGA',
    'ODIN AWAITS THIS ONE',
    'THE VALKRIES COME FOR THIS ONE'
  ];

  rerollText: string = '';

  ngOnInit(): void {
      this.rerollTexts = this.randomNumberService.shuffle(this.rerollTexts);
      this.rerollText = this.rerollTexts[0];
  }

  getNewJob(currJob: JobObj) {
    this.currentJob = currJob;
    this.currJobStartEquip = currJob.startingEquipment;
  }

  rerollAll() {
    const currIndex = this.rerollTexts.indexOf(this.rerollText);
    this.rerollText = currIndex + 1 === this.rerollTexts.length ? this.rerollTexts[0] : this.rerollTexts[currIndex + 1];
    this.triggerReroll = !this.triggerReroll;
  }

  print() {
    window.print();
  }
}

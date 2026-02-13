import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { RandomNumber } from '../services/random-number';
import { UpperCasePipe } from '@angular/common';
import { FIRST_NAME, LAST_NAME, NICKNAME } from '../../../public/assets/valholl.constants';

@Component({
  selector: 'app-intro',
  imports: [UpperCasePipe],
  templateUrl: './intro.html',
  styleUrl: './intro.scss',
})
export class Intro implements OnInit, OnChanges {
  constructor(
    private randomNumberService: RandomNumber
  ) {}

  @Input() triggerReroll: boolean = false;
  @Input() jobName: string = '';

  firstNameArray: string[] = [];
  firstNameObj = {
    descrip: '',
    currValue: -1,
  };

  lastNameArray: string[] = [];
  lastNameObj = {
    descrip: '',
    currValue: -1,
  };

  nickNameArray: string[] = [];
  nickNameObj = {
    descrip: '',
    currValue: -1,
  };

  ngOnInit(): void {
      this.shuffleArrays();
      this.rerollAllObjects();
      this.removeRealm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['triggerReroll'] && changes['triggerReroll'].previousValue !== undefined) {
      this.shuffleArrays();
      this.rerollAllObjects();
    }

    if (changes && changes['jobName'] && changes['jobName'].previousValue !== undefined) {
      this.removeRealm();
    }
  }

  rerollAllObjects() {
    this.firstNameObj = this.reroll(this.firstNameArray, this.firstNameObj);
    this.lastNameObj = this.reroll(this.lastNameArray, this.lastNameObj);
    this.nickNameObj = this.reroll(this.nickNameArray, this.nickNameObj);
  }

  reroll(constArray: string[], displayObj: {descrip: string, currValue: number}): {descrip: string, currValue: number} {
    const isEndOfArray = constArray.length === displayObj.currValue + 1;

    if(isEndOfArray) {
      constArray = this.randomNumberService.shuffle(constArray);
    }

    const newValue = isEndOfArray ? 0 : displayObj.currValue + 1;

    return {
      descrip: constArray[newValue],
      currValue: newValue,
    };
  }

  private shuffleArrays() {
    this.firstNameArray = this.randomNumberService.shuffle(FIRST_NAME);
    this.lastNameArray = this.randomNumberService.shuffle(LAST_NAME);
    this.nickNameArray = this.randomNumberService.shuffle(NICKNAME);
  }

  private removeRealm() {
    if (this.jobName.includes("’")) {
      const spaceIndex = this.jobName.indexOf(' ');
      this.jobName = this.jobName.slice(spaceIndex + 1);
    }
  }
}

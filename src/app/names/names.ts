import { Component, OnInit } from '@angular/core';
import { BELIEFS, FIRST_NAME, HABITS, LAST_NAME, NICKNAME, PAST, QUIRKS } from '../../../public/assets/valholl.constants';
import { RandomNumber } from '../services/random-number';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-names',
  imports: [UpperCasePipe],
  templateUrl: './names.html',
  styleUrl: './names.scss',
})
export class Names implements OnInit {
  constructor(
    private randomNumberService: RandomNumber,
  ) {}

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

  pastArray: string[] =[];
  pastObj = {
    descrip: '',
    currValue: -1,
  };

  quirkArray: string[] =[];
  quirkObj = {
    descrip: '',
    currValue: -1,
  };

  habitsArray: string[] =[];
  habitsObj = {
    descrip: '',
    currValue: -1,
  };

  beliefArray: string[] =[];
  beliefObj = {
    descrip: '',
    currValue: -1,
  };

  ngOnInit(): void {
      this.shuffleArrays();
      this.rerollAllObjects();
  }

  rerollAllObjects() {
    this.firstNameObj = this.reroll(this.firstNameArray, this.firstNameObj);
    this.lastNameObj = this.reroll(this.lastNameArray, this.lastNameObj);
    this.nickNameObj = this.reroll(this.nickNameArray, this.nickNameObj);

    this.pastObj = this.reroll(this.pastArray, this.pastObj);
    this.quirkObj = this.reroll(this.quirkArray, this.quirkObj);
    this.beliefObj = this.reroll(this.beliefArray, this.beliefObj);
    this.habitsObj = this.reroll(this.habitsArray, this.habitsObj);
  }

  private shuffleArrays() {
    this.firstNameArray = this.randomNumberService.shuffle(FIRST_NAME);
    this.lastNameArray = this.randomNumberService.shuffle(LAST_NAME);
    this.nickNameArray = this.randomNumberService.shuffle(NICKNAME);
    this.pastArray = this.randomNumberService.shuffle(PAST);
    this.quirkArray = this.randomNumberService.shuffle(QUIRKS);
    this.beliefArray = this.randomNumberService.shuffle(BELIEFS);
    this.habitsArray = this.randomNumberService.shuffle(HABITS);
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
}

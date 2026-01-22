import { Component, OnInit } from '@angular/core';
import { FIRST_NAME, LAST_NAME, NICKNAME } from '../assets/valholl.constants';
import { RandomNumber } from '../services/random-number';

@Component({
  selector: 'app-names',
  imports: [],
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

  ngOnInit(): void {
      this.firstNameArray = this.randomNumberService.shuffle(FIRST_NAME);
      this.lastNameArray = this.randomNumberService.shuffle(LAST_NAME);
      this.nickNameArray = this.randomNumberService.shuffle(NICKNAME);

      this.firstNameObj = this.reroll(this.firstNameArray, this.firstNameObj);
      this.lastNameObj = this.reroll(this.lastNameArray, this.lastNameObj);
      this.nickNameObj = this.reroll(this.nickNameArray, this.nickNameObj);
  }

  reroll(nameArray: string[], nameObj: {descrip: string, currValue: number}): {descrip: string, currValue: number} {
    const isEndOfArray = nameArray.length === nameObj.currValue + 1;

    if(isEndOfArray) {
      nameArray = this.randomNumberService.shuffle(nameArray);
    }

    const newValue = isEndOfArray ? 0 : nameObj.currValue + 1;

    return {
      descrip: nameArray[newValue],
      currValue: newValue,
    };
  }
}

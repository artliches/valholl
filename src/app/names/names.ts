import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BELIEFS, HABITS, PAST, QUIRKS } from '../../../public/assets/valholl.constants';
import { RandomNumber } from '../services/random-number';

@Component({
  selector: 'app-names',
  imports: [],
  templateUrl: './names.html',
  styleUrl: './names.scss',
})
export class Names implements OnInit, OnChanges {
  constructor(
    private randomNumberService: RandomNumber,
  ) {}

  @Input() triggerReroll: boolean = false;

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['triggerReroll'] && changes['triggerReroll'].previousValue !== undefined) {
        this.shuffleArrays();
        this.rerollAllObjects();
    }
  }

  rerollAllObjects() {
    this.pastObj = this.reroll(this.pastArray, this.pastObj);
    this.quirkObj = this.reroll(this.quirkArray, this.quirkObj);
    this.beliefObj = this.reroll(this.beliefArray, this.beliefObj);
    this.habitsObj = this.reroll(this.habitsArray, this.habitsObj);
  }

  private shuffleArrays() {
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

import { JsonPipe, UpperCasePipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { RandomNumber } from '../services/random-number';
import { AbilityObj, JobObj, StatsObj } from '../../../public/assets/models/valholl-interfaces';

@Component({
  selector: 'app-abilities',
  imports: [UpperCasePipe],
  templateUrl: './abilities.html',
  styleUrl: './abilities.scss',
})
export class Abilities implements OnInit, OnChanges {
  constructor (
    private randomNumberService: RandomNumber
  ) {}

  @Input() currentJob: JobObj = {} as JobObj;
  @Input() showRolls: boolean = false;

  abilitiesArray: AbilityObj[] = [
    {
      name: 'fortitude',
      descrip: 'Parry, Survive Falling, Resist Poison/Cold/Heat',
      value: 0,
      rolledDie: [],
      modifier: 0,
    },
    {
      name: 'might',
      descrip: 'Melee Attack, Lift, Crush, Move Objects',
      value: 0,
      rolledDie: [],
      modifier: 0,
    },
    {
      name: 'guile',
      descrip: 'Ranged Attack, Perceive, Charm, Stealth',
      value: 0,
      rolledDie: [],
      modifier: 0,
    },
    {
      name: 'swift',
      descrip: 'Defend, Balance, Swim, Climb',
      value: 0,
      rolledDie: [],
      modifier: 0,
    },
    {
      name: 'wits',
      descrip: 'Wield Runes, Fix Stuff, Find Your Way, Remember',
      value: 0,
      rolledDie: [],
      modifier: 0,
    }
  ];
  statsObj: StatsObj = {} as StatsObj;
  hpObj: any = {
    value: 0,
    rolledDie: [],
    modifier: 0,
  };

  fates: number = 0;

  trinketsObj: any = {
    value: 0,
    rolledSum: 0,
    rawString: '',
    numDie: 0,
    dieSize: 0,
    multipiler: 0,
  };

  ngOnInit(): void {
      // this.rerollAllAbilities(); ‡
  }

  ngOnChanges(changes: SimpleChanges): void {
      if (changes && changes['currentJob']) {
        const currJob = changes['currentJob'];
        this.statsObj = currJob.currentValue.stats;
        this.trinketsObj.rawString = currJob.currentValue.trinkets;

        this.rerollAllAbilities();
        this.rollHP();
        this.rerollFates();
        this.rollTrinkets();
      }
  }

  private rollTrinkets() {
    const indexOfD = this.trinketsObj.rawString.indexOf('d');
    const indexOfX = this.trinketsObj.rawString.indexOf('x');

    this.trinketsObj.numDie = Number(this.trinketsObj.rawString.slice(0, indexOfD));
    this.trinketsObj.dieSize = Number(this.trinketsObj.rawString.slice(indexOfD + 1, indexOfX));
    this.trinketsObj.multipiler = Number(this.trinketsObj.rawString.slice(indexOfX + 1));

    this.rerollTrinkets();
  }

  rerollTrinkets() {
    this.trinketsObj.rolledSum = this.randomNumberService.rollMultipleDie(
      this.trinketsObj.numDie, this.trinketsObj.dieSize
    );

    this.trinketsObj.value = this.trinketsObj.rolledSum * this.trinketsObj.multipiler;
  }

  rerollFates() {
    this.fates = this.randomNumberService.getRandomNumber(1, this.statsObj.fates);
  }

  rollHP() {
    this.hpObj.rolledDie = [];
    this.hpObj.value = 0;

    this.hpObj.rolledDie.push(this.randomNumberService.getRandomNumber(1, this.statsObj.hp));
    this.hpObj.modifier = this.abilitiesArray.find(ability => ability.name === 'fortitude')?.value;
    this.hpObj.value = this.hpObj.rolledDie[0] + this.hpObj.modifier >= 1 ? this.hpObj.rolledDie[0] + this.hpObj.modifier : 1;
  }

  rerollAllAbilities() {
    this.abilitiesArray.forEach(ability => {
      ability.modifier = this.statsObj[ability.name as keyof typeof this.statsObj];

      this.rerollAbility(ability, true);
    });
  }

  rerollAbility(ability: AbilityObj, rerollAll: boolean) {
    ability.rolledDie = [];
    ability.value = 0;

    for (let i = 0; i < 3; i++) {
      ability.rolledDie.push(this.randomNumberService.getRandomNumber(1, 6));
    }

    let rawNumber = ability.rolledDie.reduce(this.reducerFunction, 0) + ability.modifier;    
    this.convertRawNumberToAbilityMod(rawNumber, ability);

    if (ability.name === 'fortitude' && !rerollAll) {
      this.hpObj.modifier = ability.value;
      this.hpObj.value = this.hpObj.rolledDie[0] + this.hpObj.modifier;
    }
  }

  private reducerFunction(partialSum: number, currValue: number) {
    return partialSum + currValue;
  }

  private convertRawNumberToAbilityMod(rawNumber: number, ability: AbilityObj) {
    switch (true) {
      case rawNumber <= 4: {
        ability.value = -3;
        break;
      }
      case rawNumber > 4 && rawNumber <= 6: {
        ability.value = -2;
        break;
      }
      case rawNumber > 6 && rawNumber <= 8: {
        ability.value = -1;
        break;
      }
      case rawNumber > 8 && rawNumber <= 12: {
        ability.value = 0;
        break;
      }
      case rawNumber > 12 && rawNumber <= 14: {
        ability.value = 1;
        break;
      }
      case rawNumber > 14 && rawNumber <= 16: {
        ability.value = 2;
        break;
      }
      case rawNumber > 16 && rawNumber <= 20: {
        ability.value = 3;
        break;
      }
      case rawNumber > 20: {
        ability.value = 4;
        break;
      }
    }
  }
}

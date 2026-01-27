import { JsonPipe, UpperCasePipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { RandomNumber } from '../services/random-number';
import { AbilityObj, JobObj, StatsObj } from '../assets/models/valholl-interfaces';

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

  ngOnInit(): void {
      // this.rerollAllAbilities();
  }

  ngOnChanges(changes: SimpleChanges): void {
      if (changes && changes['currentJob']) {
        const currJob = changes['currentJob'];
        this.statsObj = currJob.currentValue.stats;

        this.rerollAllAbilities();
      }
  }

  rerollAllAbilities() {
    this.abilitiesArray.forEach(ability => {
      ability.modifier = this.statsObj[ability.name as keyof typeof this.statsObj];

      this.rerollAbility(ability);
    });
  }

  rerollAbility(ability: AbilityObj) {
    ability.rolledDie = [];
    ability.value = 0;

    for (let i = 0; i < 3; i++) {
      ability.rolledDie.push(this.randomNumberService.getRandomNumber(1, 6));
    }

    let rawNumber = ability.rolledDie.reduce(this.reducerFunction, 0) + ability.modifier;    
    this.convertRawNumberToAbilityMod(rawNumber, ability);
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

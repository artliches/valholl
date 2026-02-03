import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RandomNumber } from '../services/random-number';
import { ArmorObj, RuneObj, StartingEquipmentObj, WeaponObj } from '../../../public/assets/models/valholl-interfaces';
import { RUNES, TIER1_ARMOR, TIER2_ARMOR, TIER3_ARMOR, TIER4_ARMOR, WEAPONS } from '../../../public/assets/valholl.constants';

@Component({
  selector: 'app-equipment',
  imports: [],
  templateUrl: './equipment.html',
  styleUrl: './equipment.scss',
})
export class Equipment implements OnChanges {
  constructor (
    private randomNumberService: RandomNumber
  ) {}

  @Input() jobEquipTable: StartingEquipmentObj[] = [];

  armorObj: ArmorObj = {} as ArmorObj;
  weaponObjArray: WeaponObj[] = [];
  startingWeaponObjArray: WeaponObj[] = [];
  itemArray: any[] = [];
  runeObjArray: RuneObj[] = [];
  armorTierDefenses = [
    `No armour, leaving you vulnerable to all attacks. Flesh is the armour of a true berserkr.`,
    `d2`,
    `Reduces damage taken by d4 and imposes a +2DR penalty on Swift Tests. Defence is DR+2.`,
    `Reduces damage taken by d6, imposes a +4DR penalty on Swift Tests. Defence is DR+2.`
  ];

  ngOnChanges(changes: SimpleChanges): void {
      if (changes && changes['jobEquipTable']) {
        this.armorObj = {} as ArmorObj;
        this.weaponObjArray = [];
        this.startingWeaponObjArray = [];
        this.itemArray = [];
        this.runeObjArray = [];

        // get job equipment
        this.jobEquipTable.forEach(obj => {
          if (obj.die && obj.type !== 'rune') {
            this.rollNumberOfItems(obj);
          }

          if (obj.type === 'item') {
            this.itemArray.push(obj);
          } else if (obj.type === 'weapon') {
            const weaponName = obj.item.slice(0, obj.item.indexOf('('));
            const weaponDamage = obj.item.slice(obj.item.indexOf('('), obj.item.indexOf(')') + 1);
            const rawRange = obj.item.slice(obj.item.indexOf('{')+1, obj.item.indexOf('}'));
            
            const startingWeaponObj: WeaponObj = {
              name: weaponName,
              damage: weaponDamage,
              descrip: '',
              range: rawRange.split(','),
            };

            this.startingWeaponObjArray.push(startingWeaponObj);
          } else if (obj.type === 'rune') {
            const numRunes = Number(obj.die);
            for (let i = 0; i < numRunes; i++) {
              const randNum = this.randomNumberService.getRandomNumber(0, RUNES.length - 1);
              let rune = RUNES[randNum];

              this.runeObjArray.push(rune);
            }
          } else {
            // should only be armor
            const armorTier = Number(obj.type) - 1;
            const defense = this.armorTierDefenses[armorTier];
            
            this.armorObj = {
              name: obj.item,
              defense: defense,
              descrip: ''
            };
          }
        });

        // roll starting equipment
        this.weaponObjArray.push(WEAPONS[this.randomNumberService.getRandomNumber(0, WEAPONS.length - 1)]);
        console.log(this.armorObj, Object.keys(this.armorObj));
        if (Object.keys(this.armorObj).length === 0) {
          const armorTier = this.randomNumberService.getRandomNumber(1, 4);
          let armorArray: ArmorObj[] = [];
          switch (true) {
            case armorTier === 1: {
              armorArray = TIER1_ARMOR;
              break;
            }
            case armorTier === 2: {
              armorArray = TIER2_ARMOR;
              break;
            }
            case armorTier === 3: {
              armorArray = TIER3_ARMOR;
              break;
            }
            case armorTier === 4: {
              armorArray = TIER4_ARMOR;
              break;
            }
            default: {
              break;
            }
          }

          this.armorObj = armorArray[this.randomNumberService.getRandomNumber(0, armorArray.length - 1)];
                    console.log(armorTier, armorArray, this.armorObj);

        }
      }
  }

  private rollNumberOfItems(obj: StartingEquipmentObj) {
    const numDie = Number(obj.die.slice(0, obj.die.indexOf('d')));
    const dieSize = Number(obj.die.slice(obj.die.indexOf('d') + 1));
    const rolledNum = this.randomNumberService.rollMultipleDie(numDie, dieSize);

    obj.item = obj.item.replace('[]', rolledNum.toString());
  }
}

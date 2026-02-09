import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { RandomNumber } from '../services/random-number';
import { ArmorObj, ItemObj, RuneObj, StartingEquipmentObj, WeaponObj } from '../../../public/assets/models/valholl-interfaces';
import { ITEMS_1, ITEMS_2, PACKS, RUNES, TIER1_ARMOR, TIER2_ARMOR, TIER3_ARMOR, TIER4_ARMOR, WEAPONS } from '../../../public/assets/valholl.constants';
@Component({
  selector: 'app-equipment',
  imports: [],
  templateUrl: './equipment.html',
  styleUrl: './equipment.scss',
})
export class Equipment implements OnInit, OnChanges {
  constructor (
    private randomNumberService: RandomNumber
  ) {}

  @Input() jobEquipTable: StartingEquipmentObj[] = [];
  @Input() jobTitle: string = '';
  @Input() triggerReroll: boolean = false;

  jobHasStartingArmor: boolean = false;
  armorObj: ArmorObj = {} as ArmorObj;
  pouchArray: string[] = [];
  pouchObj = {
    descrip: '',
    currValue: -1,
  };

  itemsArray: ItemObj[][] = [];
  firstItemsArray: ItemObj[] = [];
  secondItemsArray: ItemObj[] = [];
  itemsObjArray: {
    item: ItemObj,
    currValue: number
  }[] = [];

  weaponsArray: WeaponObj[] = [];
  weaponObj: {
    weapon: WeaponObj,
    currValue: number
  } = {
    weapon: {
      name: '',
      damage: '',
      descrip: '',
      range: []
    },
    currValue: -1
  };
  startingItemArray: any[] = [];
  startingWeaponObjArray: WeaponObj[] = [];
  runeTable: RuneObj[] = [];
  runeObjArray: {
    rune: RuneObj,
    source: string,
  }[] = [];
  armorTierDefenses = [
    `No armour, leaving you vulnerable to all attacks. Flesh is the armour of a true berserkr.`,
    `d2`,
    `Reduces damage taken by d4 and imposes a +2DR penalty on Swift Tests. Defence is DR+2.`,
    `Reduces damage taken by d6, imposes a +4DR penalty on Swift Tests. Defence is DR+2.`
  ];

  ngOnInit(): void {
      this.pouchArray = this.randomNumberService.shuffle(PACKS);
      this.rerollPouch();

      this.itemsArray.push(this.randomNumberService.shuffle(ITEMS_1));
      this.itemsArray.push(this.randomNumberService.shuffle(ITEMS_2));

      this.itemsArray.forEach(itemArray => {
        this.itemsObjArray.push({
          item: itemArray[0],
          currValue: 0
        });
        if (itemArray[0].name.includes('Rune')) this.addNewRune('stone')
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
      if (changes && changes['jobEquipTable']) {
        this.jobHasStartingArmor = false;
        this.runeTable = this.randomNumberService.shuffle(RUNES);
        this.armorObj = {} as ArmorObj;
        this.weaponObj = {
          weapon: {
            name: '',
            damage: '',
            descrip: '',
            range: []
          },
          currValue: -1
        };
        this.startingWeaponObjArray = [];
        this.startingItemArray = [];

        this.runeObjArray = this.runeObjArray.filter(runeObj => runeObj.source !== 'start' && runeObj.source !== 'armour');

        // get job equipment
        this.jobEquipTable.forEach(obj => {
          if (obj.die && obj.type !== 'rune') {
            this.rollNumberOfItems(obj);
          }

          if (obj.type === 'item') {
            this.startingItemArray.push(obj);
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
              let rune = this.runeTable[i];
              this.runeObjArray.push({
                rune: rune,
                source: 'start'
              });
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
        this.weaponsArray = this.randomNumberService.shuffle(WEAPONS);

        this.rerollWeapon();
        if (Object.keys(this.armorObj).length === 0) {
          this.rerollArmor();
        } else {
          this.jobHasStartingArmor = true;
        }
      }

      if (changes && changes['triggerReroll'] && changes['triggerReroll'].previousValue !== undefined) {
        // reroll only pouch and items
        this.rerollPouch();

        for (let i = 0; i < 2; i++) {
          this.itemsObjArray[i] = this.rerollItem(this.itemsArray[i], this.itemsObjArray[i]);
        }
      }
  }

  rerollAll() {
    this.rerollPouch();
    this.rerollWeapon();
    for (let i = 0; i < 2; i++) {
      this.itemsObjArray[i] = this.rerollItem(this.itemsArray[i], this.itemsObjArray[i]);
    }

    if (!this.jobHasStartingArmor) {
      this.rerollArmor();
    }

    if (this.runeObjArray.length !== 0) {
      this.rerollAllRunes();
    }
  }

  rerollAllRunes() {
    for (let i = 0; i < this.runeObjArray.length; i++) {
      const indexesToSkip: number[] = [];
      this.runeObjArray.forEach(runeObj => indexesToSkip.push(this.runeTable.findIndex(rune => rune.name === runeObj.rune.name)));
      
      let currentIndex = this.runeTable.findIndex(rune => rune.name === this.runeObjArray[i].rune.name);

      do {
        const randIndex = this.randomNumberService.getRandomNumber(0, this.runeTable.length - 1);
        currentIndex = randIndex;
      } while (indexesToSkip.includes(currentIndex));

      this.runeObjArray[i] = {
        rune: this.runeTable[currentIndex],
        source: this.runeObjArray[i].source
      };
    }
  }

  rerollRune(runeIndex: number) {
    let currentIndex = this.runeTable.findIndex(rune => rune.name === this.runeObjArray[runeIndex].rune.name);
    const indexesToSkip: number[] = [];

    this.runeObjArray.forEach(runeObj => {
      indexesToSkip.push(this.runeTable.findIndex(rune => rune.name === runeObj.rune.name));
    });

    do {
      currentIndex += 1;
      if (currentIndex > this.runeTable.length - 1) {
        currentIndex = 0;
      }
    } while (indexesToSkip.includes(currentIndex));

    this.runeObjArray[runeIndex] = {
      rune: this.runeTable[currentIndex],
      source: this.runeObjArray[runeIndex].source
    };
  }

  rerollWeapon() {
    const isEndOfArray = this.weaponsArray.length === this.weaponObj.currValue + 1;

    if (isEndOfArray) this.weaponsArray = this.randomNumberService.shuffle(this.weaponsArray);

    const newValue = isEndOfArray ? 0 : this.weaponObj.currValue + 1;

    this.weaponObj = {
      weapon: WEAPONS[newValue],
      currValue: newValue
    };
  }

  rerollArmor() {
    let tempArmor;
    do {
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

      tempArmor = armorArray[this.randomNumberService.getRandomNumber(0, armorArray.length - 1)];
    } while (tempArmor.name === this.armorObj.name);

    this.armorObj = tempArmor;

    const shouldAddArmorRune: boolean = this.armorObj.descrip.includes('Rune');
    if (shouldAddArmorRune) {
      this.addNewRune('armour');
    } else {
      const armorRuneIndex = this.getRuneIndex('armour');
      if (armorRuneIndex >= 0) {
        //we have an armor rune to remove
        this.runeObjArray.splice(armorRuneIndex, 1);
      }
    }
  }

  rerollItem(itemArray: ItemObj[], itemArrayObj: {item: ItemObj, currValue: number}): any {
    const isEndOfArray = itemArray.length === itemArrayObj.currValue + 1;

    if (isEndOfArray) itemArray = this.randomNumberService.shuffle(itemArray);

    const newValue = isEndOfArray ? 0 : itemArrayObj.currValue + 1;

    const shouldAddItemRune: boolean = itemArray[newValue].name.includes('Rune');
    if (shouldAddItemRune) {
      this.addNewRune('stone');
    } else {
      const itemRuneIndex = this.getRuneIndex('stone');
      if (itemRuneIndex >= 0) {
        this.runeObjArray.splice(itemRuneIndex, 1);
      }
    }
    return {
      item: itemArray[newValue],
      currValue: newValue
    };
  }

  rerollPouch() {
    const isEndOfArray = this.pouchArray.length === this.pouchObj.currValue + 1;

    const newValue = isEndOfArray ? 0 : this.pouchObj.currValue + 1;
    this.pouchObj = {
      descrip: this.pouchArray[newValue],
      currValue: newValue
    };

    const shouldAddPouchRune: boolean = this.pouchObj.descrip.includes('Rune');
    if (shouldAddPouchRune) {
      this.addNewRune('pouch');
    } else {
      const pouchRuneIndex = this.getRuneIndex('pouch');
      if (pouchRuneIndex >= 0) {
        this.runeObjArray.splice(pouchRuneIndex, 1);
      }
    }
  }

  private addNewRune(source: string) {
    let newIndex = -1;
    const indexesToSkip: number[] = [];
    this.runeObjArray.forEach(runeObj => indexesToSkip.push(this.runeTable.findIndex(rune => rune.name === runeObj.rune.name)));

    do {
      newIndex += 1;
      if (newIndex > this.runeTable.length - 1) newIndex = 0;
    } while (indexesToSkip.includes(newIndex));

    this.runeObjArray.push({
      rune: this.runeTable[newIndex],
      source: source
    });
  }

  private rollNumberOfItems(obj: StartingEquipmentObj) {
    const numDie = Number(obj.die.slice(0, obj.die.indexOf('d')));
    const dieSize = Number(obj.die.slice(obj.die.indexOf('d') + 1));
    const rolledNum = this.randomNumberService.rollMultipleDie(numDie, dieSize);

    obj.item = obj.item.replace('[]', rolledNum.toString());
  }

  private getRuneIndex(source: string): number {
    return this.runeObjArray.findIndex(runeObj => runeObj.source === source);
  }
}

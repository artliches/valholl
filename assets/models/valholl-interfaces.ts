export interface AbilityObj {
    name: string,
    descrip: string,
    value: number,
    rolledDie: number[],
    modifier: number,
};

export interface JobObj {
    name: string,
    descrip: string,
    stats: StatsObj,
    special: string,
    features: FeaturesObj[],
    startingEquipment: StartingEquipmentObj[],
    trinkets: string,
};

export interface StartingEquipmentObj {
    item: string,
    type: string,
    die: string,
};

export interface ArmorObj {
    name: string,
    defense: string,
    descrip: string,
};

export interface WeaponObj {
    name: string,
    damage: string,
    descrip: string,
    range: string[],
};

export interface RuneObj {
    symbol: string,
    name: string,
    descrip: string,
    table: RuneTableObj[],
};

interface RuneTableObj {
    type: string,
    descrip: string,
};

export interface StatsObj {
    fortitude: number,
    might: number,
    guile: number,
    swift: number,
    wits: number,
    hp: number,
    fates: number,
};

export interface FeaturesObj {
    title: string,
    descrip: string,
};

export interface ItemObj {
    name: string,
    descrip: string,
};
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
    startingEquipment: string[],
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
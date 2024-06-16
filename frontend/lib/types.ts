interface BaseData {
    city: string;
    experience: string;
    operatingMode: string;
    contractType: string;
    technologies: string[];
}

export interface InputData extends BaseData { }

export interface OutputData extends BaseData {
    salary: number;
}


export interface SalaryStats {
    exp: string;
    contract: string;
    count: number;
    mean: number;
    min: number;
    max: number;
}

export interface DescElements {
    anchor: string;
    title: string;
    text: string;
}
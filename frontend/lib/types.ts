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

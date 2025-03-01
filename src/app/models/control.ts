export interface Control {
    ctrl_id: number;
    ctrl_name: string;
    applicable: boolean;
    justification: string;
    parentCID: number;
    std_code_id: number;
    ctrl_LVLID: string;
    is_active: boolean;
    subRows?: Control[];
}

export interface Payment {
    id: string;
    appRevAreaName: string;
    revAreaDetails: string;
    applicable: string;
    justification: string;
    subRows?: Payment[];
}
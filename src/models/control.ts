export interface Control {
    ctrl_id: number;
    ctrl_name: string;
    applicable: boolean;
    applicable_str: string,
    justification: string;
    parentCID: number;
    std_code_id: number;
    ctrl_LVLID: string;
    is_active: boolean;
    subRows?: Control[];
}

export interface ApiResponse<T> {
    data?: T; // Optional in case the API doesn't return data
    error?: string; // Optional error message
}
export interface ControlData {
    id: string;
    appRevAreaName: string;
    applicable: string;
    justification: string;
    subRows?: ControlData[];
}
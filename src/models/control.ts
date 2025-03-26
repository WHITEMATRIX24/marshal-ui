// models/control.ts

export interface Task {
    id: number;
    task_short_name: string;
    task_title: string;
    task_details: string;
    doer: string;
    review: string;
    frequency: string;
    position?: string | null;
    duration?: string | null;
    reference_docs?: string | null;
    output?: string | null;
    comments?: string | null;
    is_active: boolean;
}

export interface ApiControl {
    id: number;
    control_full_name: string;
    is_applicable: boolean;
    applicable_str?: string;
    justification?: string;
    parentCID: number;
    std_code_id: number;
    ctrl_LVLID: string;
    is_active: boolean;
    tasks?: Task[]; // Add tasks array
    children?: ApiControl[]; // Keep children for hierarchical structure
}

export interface Control extends Omit<ApiControl, 'children'> {
    children?: Control[];
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
    tasks?: Task[]; // Add tasks array to ControlData
    subRows?: ControlData[];
}

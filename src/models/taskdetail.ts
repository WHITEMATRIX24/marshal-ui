export interface TaskEditModel {
    id?: number;
    task_name: string;
    task_details?: string;
    doer?: string;
    reviewer?: string;
    approver?: string;
    plan_startdate?: string;
    actual_startdate: string;
    end_date: string;
    status: string;
    action: string;
    is_active?: boolean;
}

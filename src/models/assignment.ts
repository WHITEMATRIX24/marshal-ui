export interface AssignmentModel {
    id?: number;
    task_id?: number;
    compliance_id?: number;
    doer?: string;
    reviewer?: string;
    approver?: string;
    frequency?: number;
    position?: string;
    plan_startdate?: string;
    actual_startdate?: string;
    end_date?: string;
    status: string;
    action: string;
    is_active?: boolean;
    is_taskcreated?: boolean;
}

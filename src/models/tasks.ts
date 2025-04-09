export interface CreateTaskModel {
  task_id: number | null;
  doer: string;
  reviewer: string;
  approver: string;
  plan_startdate: string;
  actual_startdate: string;
  end_date: string;
  status: string;
  action: string;
}

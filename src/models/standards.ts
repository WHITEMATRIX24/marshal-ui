export interface Standard {
  // std_id: number;
  id: number;
  std_name: string;
  std_code: string;
  gov_id: number;
  std_levels: number;
  std_levels_name: string;
  cntrol_no: number;
  is_active: boolean;
  country_region: string;
}

export interface StandardsResponse {
  standards: Standard[];
}

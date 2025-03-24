export interface Standard {
  // std_id: number;
  controls_no: string | null;
  country_id: string;
  gov_id: number;
  hierarachy_name: string;
  id: number;
  is_active: boolean;
  std_levels: number;
  std_name: string;
  std_short_name: string;
}

export interface StandardsResponse {
  standards: Standard[];
}

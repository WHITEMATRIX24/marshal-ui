export interface Role {
  role_code: string;
  role_id: number;
  role_name: string;
}

export interface UserGovernanceStructure {
  governance_id: number;
  governance_name: string;
  role_code: string;
  role_id: number;
  role_name: string;
  role_type_name?: string;
}

export interface UserInfo {
  email_address: string;
  is_active: boolean;
  gov_id: string;
  link_to_role_id: number;
  is_resetpass: false;
  id: number;
  username: string;
  roles: UserGovernanceStructure[];
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: UserInfo;
}

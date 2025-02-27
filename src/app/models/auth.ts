export interface Role {
  role_code: string;
  role_id: number;
  role_name: string;
}

interface UserGovernanceStructure {
  [key: string]: Role[];
}

interface UserInfo {
  email: string;
  is_active: boolean;
  login_id: string;
  phone: string;
  user_id: number;
  username: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  roles_by_governance: UserGovernanceStructure;
  user_info: UserInfo;
}

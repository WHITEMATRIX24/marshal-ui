export interface CreateUserModel {
  id?: number;
  username: string;
  email_address: string;
  gov_id: number | null;
  link_to_role_id: number | null;
  is_active?: boolean;
  phone_number: string;
  password: string;
}

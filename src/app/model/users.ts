export type Users = UsersResult[];

export interface UsersResult {
  user_id: number;
  user_name: string;
  email: any;
  role_id: number;
  daerah_id: number;
  role_name: string;
  daerah_name: string;
  password: number;
}

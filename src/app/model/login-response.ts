export interface LoginResponse {
  success: boolean;
  message: string;
  result: LoginResult;
}

export interface LoginResult {
  user_id: number;
  user_name: string;
  email: any;
  role_id: number;
  daerah_id: any;
  role_name: string;
  daerah_name: any;
}

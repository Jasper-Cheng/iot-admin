import { requestClient } from '#/api/request';

export namespace AuthApi {
  /** RSA 公钥响应 */
  export interface RsaPublicKeyResult {
    public_key: string;
    format: 'PEM';
  }

  /** 登录接口参数 */
  export interface LoginParams {
    phone: string; // 手机号
    password: string; // RSA加密后的密码
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    accessToken: string;
  }

  /** 注册接口参数 */
  export interface RegisterParams {
    nickname: string; // 昵称
    phone: string; // 手机号
    password: string; // RSA加密后的密码
    email?: string; // 邮箱（可选）
    avatar?: string; // Base64 字符串（可选）
    gender?: 'male' | 'female' | 'other'; // 性别（可选）
  }

  /** 注册接口返回值 */
  export interface RegisterResult {
    id: number;
    nickname: string;
    phone: string;
    email?: string;
    avatar?: string;
    gender: 'male' | 'female' | 'other';
    role: 'admin';
    createdAt: string;
  }
}

/**
 * 获取 RSA 公钥
 * 接口路径: /api/v1/iot/auth/rsa_public_key
 * baseURL 是 /api/v1/iot，所以这里使用 /auth/rsa_public_key
 */
export async function getRsaPublicKey() {
  return requestClient.get<AuthApi.RsaPublicKeyResult>('/auth/rsa_public_key');
}

/**
 * 管理员登录
 * 接口路径: /api/v1/iot/auth/login
 * baseURL 是 /api/v1/iot，所以这里使用 /auth/login
 */
export async function loginApi(data: AuthApi.LoginParams) {
  return requestClient.post<AuthApi.LoginResult>('/auth/login', data);
}

/**
 * 管理员注册
 * 接口路径: /api/v1/iot/auth/register
 * baseURL 是 /api/v1/iot，所以这里使用 /auth/register
 * 注意：此接口为公开接口，不需要认证
 */
export async function registerApi(data: AuthApi.RegisterParams) {
  return requestClient.post<AuthApi.RegisterResult>('/auth/register', data);
}


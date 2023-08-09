export interface AppConfig {
  PORT: string | number;
  ENV: string;
  NAME: string;
  BASE_URL: string;
}

export interface DBConfig {
  DB_USER_NAME: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
  DB_PORT: number | string;
}

export interface Configurations {
  APP: AppConfig;
  DB: DBConfig;
}

export interface ResponseError extends Error {
  status?: number;
}

export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      HOST: string;
      DB_DRIVER: string;
      DB_HOST: string;
      DB_NAME: string;
      DB_PORT: string;
      DB_USERNAME: string;
      DB_PASSWORD: string;
      JWT_SECRET: string;
      NODE_ENV: string;
    }
  }
}

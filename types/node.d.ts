declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: string;
    DATABASE_URL?: string;
    NEXT_PUBLIC_APP_URL?: string;
  }
}


declare const process: {
  env: NodeJS.ProcessEnv;
  cwd(): string;
  exit(code?: number): never;
};

declare const global: any;

declare module "fs" {
  export function readFileSync(path: string, encoding: string): string;
  export function readdirSync(path: string): string[];
}

declare module "path" {
  export function join(...parts: string[]): string;
}


// src/types/tailwind.d.ts
declare module 'tailwindcss/resolveConfig' {
  import { Config } from 'tailwindcss';
  function resolveConfig(config: Config): any;
  export default resolveConfig;
}

// Se o seu config for .ts
declare module '@root/tailwind.config' {
  const config: any;
  export default config;
}

// Se o seu config for .js
declare module '@root/tailwind.config.js' {
  const config: any;
  export default config;
}
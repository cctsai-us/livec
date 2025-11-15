import { devConfig, EnvironmentConfig } from './environments/dev';
import { qaConfig } from './environments/qa';
import { prodConfig } from './environments/prod';

// Environment selection
// Change this to switch between environments
type Environment = 'dev' | 'qa' | 'prod';

const CURRENT_ENV: Environment = 'dev'; // TODO: Use build-time environment variable

const configs: Record<Environment, EnvironmentConfig> = {
  dev: devConfig,
  qa: qaConfig,
  prod: prodConfig,
};

export const config = configs[CURRENT_ENV];
export { EnvironmentConfig };

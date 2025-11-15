import { EnvironmentConfig } from './dev';

export const prodConfig: EnvironmentConfig = {
  apiBaseUrl: 'https://api.yoii.ai/api/v1',
  callbackBaseUrl: 'https://api.yoii.ai/api/v1',

  line: {
    channelId: '2008477870',
  },

  facebook: {
    appId: '806849805556043',
  },

  google: {
    clientId: '', // Prod Google credentials not configured in Flutter app
  },

  apple: {},
};

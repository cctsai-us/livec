import { EnvironmentConfig } from './dev';

export const qaConfig: EnvironmentConfig = {
  apiBaseUrl: 'https://qa-api.yoii.ai/api/v1',
  callbackBaseUrl: 'https://qa-api.yoii.ai/api/v1',

  line: {
    channelId: '2008477870',
  },

  facebook: {
    appId: '806849805556043',
  },

  google: {
    clientId: '', // QA Google credentials not configured in Flutter app
  },

  apple: {},
};

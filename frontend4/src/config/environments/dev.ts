export const devConfig = {
  apiBaseUrl: 'http://192.168.0.150:8000/api/v1',
  callbackBaseUrl: 'https://f647762b2120.ngrok-free.app/api/v1',

  line: {
    channelId: '2008477870',
    // LINE SDK will use universal links for deep linking
    // Format: yoii-livecomm://oauth/line/callback
  },

  facebook: {
    appId: '806849805556043',
  },

  google: {
    clientId: '852200937424-b3p5a7pn8qp8g190p48gg5p74k8v80sl.apps.googleusercontent.com',
  },

  apple: {
    // Apple Sign In uses automatic configuration via Xcode
    // No client ID needed for native implementation
  },
};

export type EnvironmentConfig = typeof devConfig;

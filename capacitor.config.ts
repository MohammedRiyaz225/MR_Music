import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mrmusic.player',
  appName: 'MR Music',
  webDir: 'dist',
  backgroundColor: '#0b0f19',
  android: {
    allowMixedContent: true,
    backgroundColor: '#0b0f19'
  }
};

export default config;

import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.rotasia',
  appName: 'rotasia',
  webDir: 'build',
  server: {
    androidScheme: 'https',
    // url: '192.168.29.148:3000'
  }
};

export default config;

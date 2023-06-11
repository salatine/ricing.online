import { defineConfig } from 'cypress';
import getCompareSnapshotsPlugin from 'cypress-visual-regression/dist/plugin';

export default defineConfig({
  clientCertificates: [
    {
      url: 'https://localhost:8080/',
      certs: [
        {
          cert: 'localhost-cert.pem',
          key: 'localhost-privkey.pem',
        },
      ]
    }
  ],
  env: {
    screenshotsFolder: './cypress/snapshots/actual',
    trashAssetsBeforeRuns: true,
    video: false
  },
  e2e: {
    setupNodeEvents(on, config) {
      getCompareSnapshotsPlugin(on, config);
    },
  },
});
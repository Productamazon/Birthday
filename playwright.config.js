const { defineConfig, devices } = require("@playwright/test");

const REDMI_VIEWPORTS = [
  { name: "redmi-note-12", width: 393, height: 873, deviceScaleFactor: 2.75 },
  { name: "redmi-note-11", width: 393, height: 851, deviceScaleFactor: 2.75 },
  { name: "redmi-9a", width: 360, height: 800, deviceScaleFactor: 2.5 },
];

function redmiProject(viewport) {
  return {
    name: `chrome-${viewport.name}`,
    use: {
      ...devices["Pixel 5"],
      browserName: "chromium",
      channel: "chrome",
      viewport: { width: viewport.width, height: viewport.height },
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: viewport.deviceScaleFactor,
    },
  };
}

module.exports = defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: 0,
  timeout: 60 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: {
    command: "python -m http.server 4173",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
  projects: [
    {
      name: "chrome-desktop",
      use: {
        ...devices["Desktop Chrome"],
        browserName: "chromium",
        channel: "chrome",
        viewport: { width: 1366, height: 768 },
      },
    },
    ...REDMI_VIEWPORTS.map(redmiProject),
  ],
});

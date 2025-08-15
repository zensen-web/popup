export default {
  "stories": [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
  ],
  "framework": {
    "name": "@storybook/web-components-vite",
    "options": {},
  },
  "viteFinal": async (config) => {
    config.build = {
      ...config.build,
      target: 'esnext',
      modulePreload: false,
    }

    config.esbuild = {
      ...config.esbuild,
      target: 'esnext',
    }

    return config
  },
}

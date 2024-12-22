/** @type { import('@storybook/react-vite').StorybookConfig } */
export default {
  stories: [
    '../src/**/*.mdx', 
    '../src/stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-mdx-gfm',
    '@chromatic-com/storybook'
  ],
  core: {
    builder: '@storybook/builder-vite', // 👈 The builder enabled here.
  },
  framework: {
    name: "@storybook/react-vite",
    options: {}
  },
};
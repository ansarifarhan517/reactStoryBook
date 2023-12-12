module.exports = {
  stories: ['../src/**/*.stories.js', '../src/**/*.stories.jsx', '../src/**/*.stories.tsx'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-knobs',
    'storybook-addon-react-docgen',
    {
      name: '@storybook/addon-docs',
      options: {
        configureJSX: true
      }
    },
    '@storybook/addon-storysource'
  ],
  webpackFinal: async config => {
    // tsx loaders in storybook
    config.module.rules.push({
      test: /\.stories\.[jt]sx$/,
      use: [
        {
          loader: require.resolve('ts-loader'),
        },
        {
          loader: require.resolve('react-docgen-typescript-loader'),
        }
      ],

    });
    config.module.rules.push({
      test: /\.stories\.[tj]sx?$/,
      loader: require.resolve('@storybook/source-loader'),
      exclude: [/node_modules/],
      enforce: 'pre',
    });

    config.resolve.extensions.push('.ts', '.tsx');



    // use svgr for svg files
    config.module.rules.push({
      test: /\.svg$/,
      use: ["url-loader", "@svgr/webpack"],
    })

    return config;
  }
};
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "expo-router/babel",
      [
        "module-resolver",
        {
          root: ["./app"],
          alias: {
            "@/components": "./app/components",
            "@/hooks": "./app/hooks",
            "@/stores": "./app/stores",
            "@/screens": "./app/screens",
            "@/utils": "./app/utils",
            "@/config": "./app/config",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};

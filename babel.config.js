module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          extensions: [".js", ".jsx", ".ts", ".tsx"],
          alias: {
            "@": "./src",
            "@api": "./src/api/index.ts",
            "@api-types": "./src/api/types.ts",
            "@assets": "./src/assets/index.ts",
            "@components": "./src/components/index.ts",
            "@context": "./src/context/index.ts",
            "@constants": "./src/constants/index.ts",
            "@helpers": "./src/helpers/index.ts",
            "@hooks": "./src/hooks/index.ts",
            "@navigation": "./src/navigation/index.ts",
            "@navigation-types": "./src/navigation/types.ts",
            "@screens": "./src/screens/index.ts",
            "@styles": "./src/styles.ts",
            "@store": "./src/store/index.ts",
            "@slices": "./src/store/slices/index.ts",
            "@thunks": "./src/store/thunks/index.ts",
            "@theme": "./src/theme/index.ts",
            "@types": "./src/types",
            "@utility": "./src/utility/index.ts",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};

import { StyleSheet, View } from "react-native";
import React from "react";
import { colors } from "@theme";
import { AuthStack } from "@navigation";

export const App = () => {
  return (
    <View style={styles.mainContainer}>
      <AuthStack />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
});

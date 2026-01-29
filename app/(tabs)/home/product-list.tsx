import { StyleSheet, Text, View } from "react-native";

export default function ProductListScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Product List</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

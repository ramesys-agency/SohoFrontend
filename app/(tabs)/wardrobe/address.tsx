import { StyleSheet, Text, View } from "react-native";

export default function AddressScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Address</Text>
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

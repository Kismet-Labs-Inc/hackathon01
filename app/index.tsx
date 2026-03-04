import { View, Text } from "react-native";

export default function WelcomeScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0A", justifyContent: "center", alignItems: "center" }}>
      <Text style={{ color: "#FFFFFF", fontSize: 24 }}>Cravr</Text>
    </View>
  );
}

import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-dark items-center justify-center px-8">
      <Text className="text-white text-5xl font-jakarta-extrabold mb-2">
        Cravr
      </Text>
      <Text className="text-coral-muted text-lg font-jakarta-medium mb-12">
        Scan. Vibe. Devour.
      </Text>

      <Pressable
        onPress={() => router.push("/scan")}
        className="bg-coral rounded-full py-4 px-12 active:opacity-80"
      >
        <Text className="text-white text-lg font-jakarta-bold text-center">
          Scan a Menu
        </Text>
      </Pressable>

      <Text className="text-gray mt-4 text-sm font-jakarta text-center">
        No signup needed — just point & shoot
      </Text>
    </View>
  );
}

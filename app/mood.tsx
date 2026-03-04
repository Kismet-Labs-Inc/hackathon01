import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MoodScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-dark">
      {/* Floating back button */}
      <Pressable
        onPress={() => router.back()}
        className="absolute z-10 bg-card rounded-full w-11 h-11 items-center justify-center active:opacity-70"
        style={{ top: insets.top + 12, left: 16 }}
      >
        <Text className="text-white text-lg">{"\u2190"}</Text>
      </Pressable>

      {/* Content */}
      <View className="flex-1 items-center justify-center px-8">
        <Text className="text-white text-3xl font-jakarta-bold mb-2">
          Mood
        </Text>
        <Text className="text-gray text-base font-jakarta text-center">
          What's the vibe?
        </Text>
      </View>

      {/* Next button */}
      <View className="px-8 pb-12">
        <Pressable
          onPress={() => router.push("/results")}
          className="bg-coral rounded-full py-4 active:opacity-80"
        >
          <Text className="text-white text-lg font-jakarta-bold text-center">
            Next: Results
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

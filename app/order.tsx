import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackButton } from "@/components/ui/BackButton";
import { colors } from "@/theme/tokens";

export default function OrderScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <BackButton />

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.screenName}>Order</Text>
        <Text style={styles.description}>Your picks summary</Text>
      </View>

      {/* Restart Demo link */}
      <View style={[styles.bottomAction, { paddingBottom: insets.bottom + 24 }]}>
        <Pressable
          onPress={() => router.replace("/scan")}
          style={({ pressed }) => [pressed && styles.nextPressed]}
        >
          <Text style={styles.nextText}>Restart Demo</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  screenName: {
    color: colors.white,
    fontSize: 28,
    fontFamily: "PlusJakartaSans_700Bold",
    marginBottom: 8,
  },
  description: {
    color: colors.gray,
    fontSize: 16,
    fontFamily: "PlusJakartaSans_400Regular",
    textAlign: "center",
  },
  bottomAction: {
    paddingHorizontal: 24,
  },
  nextPressed: {
    opacity: 0.5,
  },
  nextText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
});

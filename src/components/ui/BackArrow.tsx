import { Pressable, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export function BackArrow({ onPress }: { onPress?: () => void }) {
  const router = useRouter();

  return (
    <Pressable
      onPress={onPress ?? (() => router.back())}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel="Go back"
    >
      <Text style={styles.chevron}>{"\u2039"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.5,
  },
  chevron: {
    color: "#FFFFFF",
    fontSize: 32,
    lineHeight: 34,
  },
});

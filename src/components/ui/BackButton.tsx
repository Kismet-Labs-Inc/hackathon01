import { Pressable, Text, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface BackButtonProps {
  onPress?: () => void;
}

export function BackButton({ onPress }: BackButtonProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.row, { paddingTop: insets.top + 8 }]}>
      <Pressable
        onPress={onPress ?? (() => router.back())}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.pressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Text style={styles.chevron}>{"\u2039"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
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

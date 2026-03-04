import { useEffect } from "react";
import { View, Text, Pressable, StyleSheet, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/theme/tokens";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Animation shared values
  const logoOpacity = useSharedValue(0);
  const ctaOpacity = useSharedValue(0);
  const ctaTranslateY = useSharedValue(20);
  const subtextOpacity = useSharedValue(0);

  useEffect(() => {
    // Logo group fades in over 500ms
    logoOpacity.value = withTiming(1, { duration: 500 });

    // CTA slides up and fades in after 300ms delay
    ctaOpacity.value = withDelay(300, withTiming(1, { duration: 400 }));
    ctaTranslateY.value = withDelay(300, withTiming(0, { duration: 400 }));

    // Subtext fades in after CTA (300 + 400 = 700ms delay)
    subtextOpacity.value = withDelay(700, withTiming(1, { duration: 300 }));
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
  }));

  const ctaAnimatedStyle = useAnimatedStyle(() => ({
    opacity: ctaOpacity.value,
    transform: [{ translateY: ctaTranslateY.value }],
  }));

  const subtextAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtextOpacity.value,
  }));

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 24 }]}>
      <StatusBar barStyle="light-content" />

      {/* Logo group -- positioned in upper area */}
      <Animated.View style={[styles.logoGroup, logoAnimatedStyle]}>
        {/* Radial glow behind fire emoji */}
        <View style={styles.glowContainer}>
          <LinearGradient
            colors={["rgba(232, 116, 74, 0.15)", "rgba(232, 116, 74, 0.05)", "transparent"]}
            style={styles.glow}
            start={{ x: 0.5, y: 0.5 }}
            end={{ x: 1, y: 1 }}
          />
          <Text style={styles.fireEmoji}>{"🔥"}</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Cravr</Text>

        {/* Tagline */}
        <Text style={styles.tagline}>Scan. Vibe. Devour.</Text>
      </Animated.View>

      {/* Spacer pushes CTA to bottom */}
      <View style={styles.spacer} />

      {/* CTA button */}
      <Animated.View style={ctaAnimatedStyle}>
        <AnimatedPressable
          onPress={() => router.push("/scan")}
          style={({ pressed }) => [
            styles.ctaButton,
            pressed && styles.ctaButtonPressed,
          ]}
        >
          <Text style={styles.ctaIcon}>{"📷"}</Text>
          <Text style={styles.ctaText}>Scan a Menu</Text>
        </AnimatedPressable>
      </Animated.View>

      {/* Subtext */}
      <Animated.View style={subtextAnimatedStyle}>
        <Text style={styles.subtext}>
          No signup needed — just point & shoot
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  logoGroup: {
    alignItems: "center",
    marginTop: "30%",
  },
  glowContainer: {
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  fireEmoji: {
    fontSize: 80,
  },
  title: {
    color: colors.white,
    fontSize: 48,
    fontFamily: "PlusJakartaSans_800ExtraBold",
    marginTop: -8,
  },
  tagline: {
    color: colors.coralMuted,
    fontSize: 18,
    fontFamily: "PlusJakartaSans_500Medium",
    marginTop: 4,
  },
  spacer: {
    flex: 1,
  },
  ctaButton: {
    backgroundColor: colors.coral,
    borderRadius: 9999,
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    minWidth: 340,
    paddingHorizontal: 24,
  },
  ctaButtonPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
  ctaIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  ctaText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  subtext: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 14,
    fontFamily: "PlusJakartaSans_400Regular",
    marginTop: 16,
    textAlign: "center",
  },
});

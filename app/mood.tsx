import { useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { BackButton } from "@/components/ui/BackButton";
import { useMenuStore } from "@/stores/useMenuStore";
import { useRecommendationStore } from "@/stores/useRecommendationStore";
import { MOODS, SURPRISE_ME, type Mood } from "@/types/mood";
import { colors, spacing, borderRadius } from "@/theme/tokens";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_GAP = spacing.md;
const SCREEN_PADDING = spacing.lg;
const CARD_WIDTH = (SCREEN_WIDTH - SCREEN_PADDING * 2 - CARD_GAP) / 2;

function MoodCard({
  mood,
  onSelect,
  disabled,
  isSelected,
}: {
  mood: Mood;
  onSelect: (mood: Mood) => void;
  disabled: boolean;
  isSelected: boolean;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = useCallback(() => {
    if (disabled) return;
    scale.value = withSpring(1.05, { damping: 8, stiffness: 300 });
    onSelect(mood);
  }, [disabled, mood, onSelect, scale]);

  return (
    <Pressable onPress={handlePress} disabled={disabled}>
      <Animated.View
        style={[
          styles.moodCard,
          animatedStyle,
          isSelected && styles.moodCardSelected,
        ]}
      >
        <Text style={styles.moodEmoji}>{mood.emoji}</Text>
        <Text style={styles.moodLabel}>{mood.label}</Text>
        <Text style={styles.moodDescription}>{mood.description}</Text>
      </Animated.View>
    </Pressable>
  );
}

export default function MoodScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const itemCount = useMenuStore((s) => s.items.length);
  const setMood = useRecommendationStore((s) => s.setMood);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const navigatingRef = useRef(false);

  // Reset selection state when returning to this screen
  useFocusEffect(
    useCallback(() => {
      navigatingRef.current = false;
      setSelectedId(null);
    }, [])
  );

  const handleSelectMood = useCallback(
    (mood: Mood, isSurprise: boolean) => {
      if (navigatingRef.current) return;
      navigatingRef.current = true;
      setSelectedId(mood.id);
      setMood(mood.id, isSurprise);

      setTimeout(() => {
        router.push("/results");
      }, 500);
    },
    [setMood, router]
  );

  const handleCardSelect = useCallback(
    (mood: Mood) => {
      handleSelectMood(mood, false);
    },
    [handleSelectMood]
  );

  const handleSurprise = useCallback(() => {
    const randomMood = MOODS[Math.floor(Math.random() * MOODS.length)];
    handleSelectMood(randomMood, true);
  }, [handleSelectMood]);

  const surpriseScale = useSharedValue(1);
  const surpriseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: surpriseScale.value }],
  }));

  const handleSurprisePress = useCallback(() => {
    if (navigatingRef.current) return;
    surpriseScale.value = withSpring(1.05, { damping: 8, stiffness: 300 });
    handleSurprise();
  }, [handleSurprise, surpriseScale]);

  return (
    <View style={styles.container}>
      <BackButton />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.itemCount}>
            We found {itemCount} items on this menu.
          </Text>
          <Text style={styles.heading}>What's the vibe?</Text>
        </View>

        {/* Mood Grid */}
        <View style={styles.grid}>
          {MOODS.map((mood) => (
            <MoodCard
              key={mood.id}
              mood={mood}
              onSelect={handleCardSelect}
              disabled={navigatingRef.current}
              isSelected={selectedId === mood.id}
            />
          ))}
        </View>

        {/* Surprise Me */}
        <Pressable
          onPress={handleSurprisePress}
          disabled={navigatingRef.current}
        >
          <Animated.View
            style={[
              styles.surpriseButton,
              surpriseAnimatedStyle,
              selectedId === "surprise-active" && styles.moodCardSelected,
            ]}
          >
            <Text style={styles.surpriseEmoji}>{SURPRISE_ME.emoji}</Text>
            <Text style={styles.surpriseLabel}>{SURPRISE_ME.label}</Text>
          </Animated.View>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgWarm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SCREEN_PADDING,
  },
  header: {
    marginBottom: spacing.lg,
  },
  itemCount: {
    color: colors.gray,
    fontSize: 14,
    fontFamily: "PlusJakartaSans_400Regular",
    marginBottom: spacing.sm,
  },
  heading: {
    color: colors.white,
    fontSize: 30,
    fontFamily: "PlusJakartaSans_700Bold",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: CARD_GAP,
    marginBottom: spacing.md,
  },
  moodCard: {
    width: CARD_WIDTH,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: "transparent",
  },
  moodCardSelected: {
    borderColor: colors.coral,
  },
  moodEmoji: {
    fontSize: 34,
    marginBottom: spacing.sm,
  },
  moodLabel: {
    color: colors.white,
    fontSize: 17,
    fontFamily: "PlusJakartaSans_600SemiBold",
    marginBottom: spacing.xs,
  },
  moodDescription: {
    color: colors.gray,
    fontSize: 13,
    fontFamily: "PlusJakartaSans_400Regular",
  },
  surpriseButton: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    borderWidth: 2,
    borderColor: "transparent",
  },
  surpriseEmoji: {
    fontSize: 24,
  },
  surpriseLabel: {
    color: colors.white,
    fontSize: 17,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
});

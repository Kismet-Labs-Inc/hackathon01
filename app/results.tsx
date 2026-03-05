import { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withDelay,
  Easing,
  interpolate,
} from "react-native-reanimated";
import Constants from "expo-constants";
import { BackArrow } from "@/components/ui/BackArrow";
import { useMenuStore } from "@/stores/useMenuStore";
import { useRecommendationStore } from "@/stores/useRecommendationStore";
import {
  generateRecommendations,
  toggleForceFallback,
} from "@/services/claude";
import { MOODS } from "@/types/mood";
import type { Recommendation } from "@/types/recommendation";
import { colors, spacing, borderRadius } from "@/theme/tokens";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SCREEN_PADDING = spacing.lg;

// ─── Loading State ──────────────────────────────────────────

function LoadingState({ moodEmoji }: { moodEmoji: string }) {
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.loadingContainer}>
      <Animated.Text style={[styles.loadingEmoji, animatedStyle]}>
        {moodEmoji}
      </Animated.Text>
      <Text style={styles.loadingText}>Finding your perfect matches...</Text>
    </View>
  );
}

// ─── Recommendation Card ────────────────────────────────────

function RecommendationCard({
  rec,
  onToggleSave,
}: {
  rec: Recommendation;
  onToggleSave: (id: string) => void;
}) {
  const buttonScale = useSharedValue(1);

  const buttonAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleSavePress = useCallback(() => {
    buttonScale.value = withSpring(0.95, { damping: 10, stiffness: 400 });
    setTimeout(() => {
      buttonScale.value = withSpring(1, { damping: 10, stiffness: 400 });
    }, 100);
    onToggleSave(rec.id);
  }, [rec.id, onToggleSave, buttonScale]);

  const crowdPercent = rec.crowdFavePercent ?? 75;
  const emoji = rec.foodEmoji ?? "";
  const tag = rec.popularityTag ?? "";

  return (
    <View style={styles.card}>
      {/* Top row: match badge + popularity tag */}
      <View style={styles.cardTopRow}>
        <View style={styles.matchBadge}>
          <Text style={styles.matchBadgeText}>
            {rec.matchPercent}% MATCH
          </Text>
        </View>
        {tag ? (
          <View style={styles.tagPill}>
            <Text style={styles.tagPillText}>{tag}</Text>
          </View>
        ) : null}
      </View>

      {/* Emoji + Name */}
      {emoji ? <Text style={styles.cardEmoji}>{emoji}</Text> : null}
      <Text style={styles.cardName}>{rec.item.name}</Text>

      {/* Reasoning */}
      <Text style={styles.cardReasoning} numberOfLines={2}>
        {rec.reasoning}
      </Text>

      {/* Crowd fave bar */}
      <View style={styles.crowdRow}>
        <View style={styles.crowdBarTrack}>
          <View
            style={[styles.crowdBarFill, { width: `${crowdPercent}%` }]}
          />
        </View>
        <Text style={styles.crowdText}>
          {crowdPercent}% of diners loved this
        </Text>
      </View>

      {/* Price + Calories */}
      <View style={styles.priceRow}>
        <Text style={styles.priceText}>
          ₱{rec.item.price.toLocaleString()}
        </Text>
        {rec.item.calories != null && (
          <Text style={styles.calorieText}> | {rec.item.calories} cal</Text>
        )}
      </View>

      {/* Dietary tags */}
      {rec.item.dietaryTags && rec.item.dietaryTags.length > 0 && (
        <View style={styles.dietaryRow}>
          {rec.item.dietaryTags.map((dt) => (
            <View key={dt} style={styles.dietaryPill}>
              <Text style={styles.dietaryPillText}>{dt}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Save button */}
      <Pressable onPress={handleSavePress}>
        <Animated.View
          style={[
            rec.saved ? styles.savedButton : styles.saveButton,
            buttonAnimStyle,
          ]}
        >
          <Text
            style={rec.saved ? styles.savedButtonText : styles.saveButtonText}
          >
            {rec.saved ? "\u2713 Saved" : "I'll get this"}
          </Text>
        </Animated.View>
      </Pressable>
    </View>
  );
}

// ─── Surprise Me Reveal ─────────────────────────────────────

function SurpriseReveal({
  recommendation,
  onToggleSave,
  onReRoll,
  reRollsLeft,
}: {
  recommendation: Recommendation | null;
  onToggleSave: (id: string) => void;
  onReRoll: () => void;
  reRollsLeft: number;
}) {
  const [phase, setPhase] = useState<"roulette" | "flip" | "done">("roulette");
  const [rouletteIndex, setRouletteIndex] = useState(0);
  const flipProgress = useSharedValue(0);

  // Roulette: cycle through mood emojis
  useEffect(() => {
    if (phase !== "roulette") return;
    let tick = 0;
    const totalTicks = 12;
    const timer = setInterval(() => {
      tick++;
      setRouletteIndex((prev) => (prev + 1) % MOODS.length);
      if (tick >= totalTicks) {
        clearInterval(timer);
        setPhase("flip");
      }
    }, 150);
    return () => clearInterval(timer);
  }, [phase]);

  // Flip animation
  useEffect(() => {
    if (phase !== "flip") return;
    flipProgress.value = withDelay(
      400,
      withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) })
    );
    const timeout = setTimeout(() => {
      setPhase("done");
    }, 1200);
    return () => clearTimeout(timeout);
  }, [phase, flipProgress]);

  const frontStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipProgress.value, [0, 1], [0, 180]);
    const opacity = flipProgress.value < 0.5 ? 1 : 0;
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
      opacity,
      backfaceVisibility: "hidden" as const,
    };
  });

  const backStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipProgress.value, [0, 1], [180, 360]);
    const opacity = flipProgress.value >= 0.5 ? 1 : 0;
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
      opacity,
      backfaceVisibility: "hidden" as const,
    };
  });

  const handleReRoll = useCallback(() => {
    setPhase("roulette");
    flipProgress.value = 0;
    onReRoll();
  }, [onReRoll, flipProgress]);

  return (
    <View style={styles.surpriseContainer}>
      {/* Card faces */}
      <View style={styles.surpriseCardWrapper}>
        {/* Front face (face-down) */}
        <Animated.View style={[styles.surpriseFront, frontStyle]}>
          <Text style={styles.surpriseFrontEmoji}>
            {phase === "roulette" ? MOODS[rouletteIndex].emoji : ""}
          </Text>
          <Text style={styles.surpriseFrontLabel}>
            {phase === "roulette"
              ? MOODS[rouletteIndex].label
              : "Revealing..."}
          </Text>
        </Animated.View>

        {/* Back face (the recommendation) */}
        <Animated.View style={[styles.surpriseBack, backStyle]}>
          {recommendation && (
            <RecommendationCard
              rec={recommendation}
              onToggleSave={onToggleSave}
            />
          )}
        </Animated.View>
      </View>

      {/* Action buttons below card */}
      {phase === "done" && recommendation && (
        <View style={styles.surpriseActions}>
          {reRollsLeft > 0 && (
            <Pressable onPress={handleReRoll} style={styles.reRollButton}>
              <Text style={styles.reRollButtonText}>Nah, pick again</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

// ─── Sticky Bottom Bar ──────────────────────────────────────

function StickyBottomBar({
  savedCount,
  onViewOrder,
}: {
  savedCount: number;
  onViewOrder: () => void;
}) {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(100);

  useEffect(() => {
    translateY.value = withSpring(0, { damping: 15, stiffness: 200 });
  }, [translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.stickyBar,
        animatedStyle,
        { paddingBottom: insets.bottom + spacing.md },
      ]}
    >
      <Text style={styles.stickyBarCount}>
        {savedCount} item{savedCount !== 1 ? "s" : ""} saved
      </Text>
      <Pressable onPress={onViewOrder}>
        <Text style={styles.stickyBarAction}>View order &gt;</Text>
      </Pressable>
    </Animated.View>
  );
}

// ─── Main Screen ────────────────────────────────────────────

export default function ResultsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const recommendations = useRecommendationStore((s) => s.recommendations);
  const isLoading = useRecommendationStore((s) => s.isLoading);
  const selectedMoodId = useRecommendationStore((s) => s.selectedMoodId);
  const isSurprise = useRecommendationStore((s) => s.isSurprise);
  const setRecommendations = useRecommendationStore(
    (s) => s.setRecommendations
  );
  const setLoading = useRecommendationStore((s) => s.setLoading);
  const toggleSaved = useRecommendationStore((s) => s.toggleSaved);

  const menuItems = useMenuStore((s) => s.items);

  const [reRollsLeft, setReRollsLeft] = useState(1);
  const [surpriseRec, setSurpriseRec] = useState<Recommendation | null>(null);
  const fetchedRef = useRef(false);

  // Dev toggle: triple-tap counter
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTripleTap = useCallback(() => {
    tapCountRef.current += 1;
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    if (tapCountRef.current >= 3) {
      tapCountRef.current = 0;
      toggleForceFallback();
      // Re-fetch with toggled mode
      fetchedRef.current = false;
      fetchRecommendations();
    } else {
      tapTimerRef.current = setTimeout(() => {
        tapCountRef.current = 0;
      }, 500);
    }
  }, []);

  const fetchRecommendations = useCallback(async () => {
    if (!selectedMoodId) return;
    setLoading(true);

    const apiKey =
      Constants.expoConfig?.extra?.anthropicApiKey ?? "";

    try {
      const results = await generateRecommendations(
        menuItems,
        selectedMoodId,
        apiKey
      );
      setRecommendations(results);

      // For surprise mode, pick a single random recommendation
      if (isSurprise && results.length > 0) {
        const randomIdx = Math.floor(Math.random() * results.length);
        setSurpriseRec(results[randomIdx]);
      }
    } catch {
      // Service already handles fallback internally, but just in case
      setRecommendations([]);
    }
  }, [selectedMoodId, menuItems, isSurprise, setLoading, setRecommendations]);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchRecommendations();
  }, [fetchRecommendations]);

  // Get mood info for display
  const currentMood = MOODS.find((m) => m.id === selectedMoodId);
  const moodEmoji = currentMood?.emoji ?? "";
  const moodLabel = currentMood?.label ?? "Surprise Me";

  const savedCount = recommendations.filter((r) => r.saved).length;
  const sortedRecs = [...recommendations].sort(
    (a, b) => b.matchPercent - a.matchPercent
  );

  const handleToggleSave = useCallback(
    (id: string) => {
      toggleSaved(id);
    },
    [toggleSaved]
  );

  const handleViewOrder = useCallback(() => {
    router.push("/order");
  }, [router]);

  const handleReRoll = useCallback(() => {
    setReRollsLeft((prev) => prev - 1);
    // Pick a different random recommendation
    if (recommendations.length > 1 && surpriseRec) {
      const others = recommendations.filter((r) => r.id !== surpriseRec.id);
      const randomIdx = Math.floor(Math.random() * others.length);
      setSurpriseRec(others[randomIdx]);
    }
  }, [recommendations, surpriseRec]);

  // ─── Loading ────────────────────────────────────────────

  if (isLoading) {
    return (
      <View style={styles.containerWarm}>
        <View style={[styles.headerRow, { paddingTop: insets.top + spacing.sm }]}>
          <BackArrow />
        </View>
        <LoadingState moodEmoji={moodEmoji || "\u2728"} />
      </View>
    );
  }

  // ─── Surprise Me ────────────────────────────────────────

  if (isSurprise) {
    return (
      <View style={styles.containerWarm}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + spacing.sm, paddingBottom: savedCount > 0 ? 120 : insets.bottom + spacing.xl },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerRow}>
            <BackArrow />
            <View style={styles.moodPill}>
              <Text style={styles.moodPillText}>🎲 Surprise Me</Text>
            </View>
          </View>
          <View style={styles.header}>
            <Pressable onPress={handleTripleTap}>
              <Text style={styles.heading}>Surprise Me</Text>
            </Pressable>
            <Text style={styles.subtext}>Let fate decide your meal</Text>
          </View>

          <SurpriseReveal
            recommendation={surpriseRec}
            onToggleSave={handleToggleSave}
            onReRoll={handleReRoll}
            reRollsLeft={reRollsLeft}
          />
        </ScrollView>

        {savedCount > 0 && (
          <StickyBottomBar
            savedCount={savedCount}
            onViewOrder={handleViewOrder}
          />
        )}
      </View>
    );
  }

  // ─── Standard Results ───────────────────────────────────

  return (
    <View style={styles.containerWarm}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + spacing.sm, paddingBottom: savedCount > 0 ? 120 : insets.bottom + spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <BackArrow />
          <View style={styles.moodPill}>
            <Text style={styles.moodPillText}>
              {moodEmoji} {moodLabel}
            </Text>
          </View>
        </View>
        <View style={styles.header}>
          <Pressable onPress={handleTripleTap}>
            <Text style={styles.heading}>Your picks</Text>
          </Pressable>
          <Text style={styles.subtext}>Ranked by mood match</Text>
        </View>

        {/* Cards */}
        <View style={styles.cardList}>
          {sortedRecs.map((rec) => (
            <RecommendationCard
              key={rec.id}
              rec={rec}
              onToggleSave={handleToggleSave}
            />
          ))}
        </View>
      </ScrollView>

      {savedCount > 0 && (
        <StickyBottomBar
          savedCount={savedCount}
          onViewOrder={handleViewOrder}
        />
      )}
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────

const styles = StyleSheet.create({
  containerWarm: {
    flex: 1,
    backgroundColor: colors.bgWarm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SCREEN_PADDING,
    paddingTop: spacing.sm,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SCREEN_PADDING - 12,
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  header: {
    marginBottom: spacing.lg,
  },
  moodPill: {
    alignSelf: "flex-start",
    backgroundColor: colors.coral,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    marginBottom: spacing.md,
  },
  moodPillText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  heading: {
    color: colors.white,
    fontSize: 30,
    fontFamily: "PlusJakartaSans_700Bold",
    marginBottom: spacing.xs,
  },
  subtext: {
    color: colors.gray,
    fontSize: 14,
    fontFamily: "PlusJakartaSans_400Regular",
  },

  // Loading
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SCREEN_PADDING,
  },
  loadingEmoji: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  loadingText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: "PlusJakartaSans_600SemiBold",
    textAlign: "center",
  },

  // Card list
  cardList: {
    gap: spacing.md,
  },

  // Recommendation Card
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  matchBadge: {
    backgroundColor: colors.mint,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
  },
  matchBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontFamily: "PlusJakartaSans_600SemiBold",
    letterSpacing: 0.5,
  },
  tagPill: {
    backgroundColor: "#374151",
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
  },
  tagPillText: {
    color: colors.white,
    fontSize: 12,
    fontFamily: "PlusJakartaSans_500Medium",
  },
  cardEmoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  cardName: {
    color: colors.white,
    fontSize: 20,
    fontFamily: "PlusJakartaSans_700Bold",
    marginBottom: spacing.xs,
  },
  cardReasoning: {
    color: colors.gray,
    fontSize: 14,
    fontFamily: "PlusJakartaSans_400Regular",
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  crowdRow: {
    marginBottom: spacing.sm,
  },
  crowdBarTrack: {
    height: 4,
    backgroundColor: colors.grayDark,
    borderRadius: 2,
    marginBottom: spacing.xs,
    overflow: "hidden",
  },
  crowdBarFill: {
    height: 4,
    backgroundColor: colors.coral,
    borderRadius: 2,
  },
  crowdText: {
    color: colors.grayDark,
    fontSize: 12,
    fontFamily: "PlusJakartaSans_400Regular",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: spacing.sm,
  },
  priceText: {
    color: colors.white,
    fontSize: 20,
    fontFamily: "PlusJakartaSans_700Bold",
  },
  calorieText: {
    color: colors.gray,
    fontSize: 14,
    fontFamily: "PlusJakartaSans_400Regular",
  },
  dietaryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  dietaryPill: {
    backgroundColor: "#374151",
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  dietaryPillText: {
    color: colors.white,
    fontSize: 12,
    fontFamily: "PlusJakartaSans_500Medium",
  },
  saveButton: {
    backgroundColor: colors.coral,
    borderRadius: borderRadius.full,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  savedButton: {
    backgroundColor: "#374151",
    borderRadius: borderRadius.full,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  savedButtonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },

  // Surprise Me
  surpriseContainer: {
    alignItems: "center",
  },
  surpriseCardWrapper: {
    width: SCREEN_WIDTH - SCREEN_PADDING * 2,
    minHeight: 300,
  },
  surpriseFront: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
  },
  surpriseFrontEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  surpriseFrontLabel: {
    color: colors.white,
    fontSize: 22,
    fontFamily: "PlusJakartaSans_700Bold",
    textAlign: "center",
  },
  surpriseBack: {
    width: "100%",
  },
  surpriseActions: {
    marginTop: spacing.lg,
    width: "100%",
    gap: spacing.sm,
  },
  reRollButton: {
    borderWidth: 1.5,
    borderColor: colors.coral,
    borderRadius: borderRadius.full,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  reRollButtonText: {
    color: colors.coral,
    fontSize: 16,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },

  // Sticky bottom bar
  stickyBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  stickyBarCount: {
    color: colors.white,
    fontSize: 16,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  stickyBarAction: {
    color: colors.coral,
    fontSize: 16,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
});

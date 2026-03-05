import { useMemo } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackButton } from "@/components/ui/BackButton";
import { useRecommendationStore } from "@/stores/useRecommendationStore";
import { useMenuStore } from "@/stores/useMenuStore";
import { colors, spacing, borderRadius } from "@/theme/tokens";

export default function OrderScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const recommendations = useRecommendationStore((s) => s.recommendations);
  const savedItems = useMemo(
    () => recommendations.filter((r) => r.saved),
    [recommendations]
  );
  const clearRecommendations = useRecommendationStore((s) => s.clear);
  const clearMenu = useMenuStore((s) => s.clear);

  const totalCost = savedItems.reduce((sum, rec) => sum + rec.item.price, 0);
  const totalCalories = savedItems.reduce(
    (sum, rec) => sum + (rec.item.calories ?? 0),
    0
  );

  const handleRestart = () => {
    clearRecommendations();
    clearMenu();
    router.replace("/scan");
  };

  return (
    <View style={styles.container}>
      <BackButton />

      {savedItems.length === 0 ? (
        /* Empty state */
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🍴</Text>
          <Text style={styles.emptyText}>No items saved yet</Text>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.emptyLink}>Go back to picks</Text>
          </Pressable>
        </View>
      ) : (
        /* Items list */
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
            <Text style={styles.heading}>Your order</Text>
            <Text style={styles.subtext}>
              {savedItems.length} item{savedItems.length !== 1 ? "s" : ""}
            </Text>
          </View>

          {/* Saved item rows */}
          {savedItems.map((rec) => (
            <View key={rec.id} style={styles.itemRow}>
              <View style={styles.itemLeft}>
                <Text style={styles.itemEmoji}>
                  {rec.foodEmoji ?? "\uD83C\uDF7D\uFE0F"}
                </Text>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {rec.item.name}
                  </Text>
                  {rec.item.calories != null && (
                    <Text style={styles.itemCalories}>
                      {rec.item.calories} cal
                    </Text>
                  )}
                </View>
              </View>
              <Text style={styles.itemPrice}>
                ₱{rec.item.price.toLocaleString()}
              </Text>
            </View>
          ))}

          {/* Totals section */}
          <View style={styles.separator} />
          <View style={styles.totalsRow}>
            <View>
              <Text style={styles.totalLabel}>ESTIMATED TOTAL</Text>
              <Text style={styles.totalCost}>₱{totalCost.toLocaleString()}</Text>
            </View>
            <View style={styles.totalsRight}>
              <Text style={styles.totalLabel}>TOTAL CALORIES</Text>
              <Text style={styles.totalCalories}>
                {totalCalories.toLocaleString()} cal
              </Text>
            </View>
          </View>

          {/* Restart button */}
          <Pressable
            onPress={handleRestart}
            style={({ pressed }) => [
              styles.restartButton,
              pressed && styles.restartPressed,
            ]}
          >
            <Text style={styles.restartText}>📷 Scan another menu</Text>
          </Pressable>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  /* Empty state */
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyText: {
    color: colors.gray,
    fontSize: 18,
    fontFamily: "PlusJakartaSans_600SemiBold",
    marginBottom: spacing.sm,
  },
  emptyLink: {
    color: colors.coral,
    fontSize: 16,
    fontFamily: "PlusJakartaSans_500Medium",
  },
  /* Scroll */
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  /* Header */
  header: {
    marginBottom: spacing.lg,
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
  /* Item row */
  itemRow: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: spacing.md,
  },
  itemEmoji: {
    fontSize: 28,
    marginRight: spacing.sm,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    color: colors.white,
    fontSize: 16,
    fontFamily: "PlusJakartaSans_700Bold",
    textTransform: "uppercase",
  },
  itemCalories: {
    color: colors.gray,
    fontSize: 14,
    fontFamily: "PlusJakartaSans_400Regular",
    marginTop: 2,
  },
  itemPrice: {
    color: colors.white,
    fontSize: 18,
    fontFamily: "PlusJakartaSans_700Bold",
  },
  /* Totals */
  separator: {
    height: 1,
    backgroundColor: colors.grayDark,
    marginVertical: spacing.lg,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xl,
  },
  totalsRight: {
    alignItems: "flex-end",
  },
  totalLabel: {
    color: colors.gray,
    fontSize: 12,
    fontFamily: "PlusJakartaSans_500Medium",
    letterSpacing: 0.6,
    marginBottom: spacing.sm,
  },
  totalCost: {
    color: colors.coral,
    fontSize: 24,
    fontFamily: "PlusJakartaSans_700Bold",
  },
  totalCalories: {
    color: colors.coral,
    fontSize: 24,
    fontFamily: "PlusJakartaSans_700Bold",
  },
  /* Restart button */
  restartButton: {
    backgroundColor: colors.coral,
    borderRadius: borderRadius.full,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  restartPressed: {
    opacity: 0.85,
  },
  restartText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: "PlusJakartaSans_700Bold",
  },
});

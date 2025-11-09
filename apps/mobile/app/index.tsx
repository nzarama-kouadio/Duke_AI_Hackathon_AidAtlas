import { useCallback } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ConflictCard } from "@/components/ConflictCard";
import { HeroHeader } from "@/components/HeroHeader";
import { ImpactHighlightCard } from "@/components/ImpactHighlightCard";
import { QuickActionChip } from "@/components/QuickActionChip";
import { useRecommendationFeed } from "@/hooks/useRecommendationFeed";

export default function HomeScreen() {
  const { cards, isLoading, isError, refetch } = useRecommendationFeed();
  const insets = useSafeAreaInsets();

  const handleDonate = useCallback((conflictId: string) => {
    // TODO: navigate to donation flow
    console.log("Donate tapped", conflictId);
  }, []);

  const handleLearnMore = useCallback((conflictId: string) => {
    // TODO: navigate to detailed conflict profile
    console.log("Learn more tapped", conflictId);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator animating size="large" />
        <Text style={styles.loadingText}>Loading personalized conflicts…</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text variant="bodyLarge">Unable to load recommendations.</Text>
        <Button
          mode="contained"
          onPress={() => refetch()}
          style={styles.retryButton}
        >
          Try Again
        </Button>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { paddingTop: insets.top + 8 }]}
    >
      <HeroHeader
        onPrimaryAction={() => console.log("Explore Conflicts CTA tapped")}
        onSecondaryAction={() => console.log("Impact Map CTA tapped")}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.quickActions}
      >
        <QuickActionChip
          label="My Impact"
          icon="chart-line"
          onPress={() => console.log("Navigate to impact")}
        />
        <QuickActionChip
          label="Saved Orgs"
          icon="bookmark"
          onPress={() => console.log("Navigate to saved orgs")}
        />
        <QuickActionChip
          label="Badges"
          icon="trophy-award"
          onPress={() => console.log("Navigate to badges")}
        />
      </ScrollView>

      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          This Month At A Glance
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.highlightRow}
        >
          <ImpactHighlightCard
            label="Lives Supported"
            value="12.4K"
            caption="+18% vs last month"
          />
          <ImpactHighlightCard
            label="Recurring Donors"
            value="3,210"
            caption="76 new commitments"
          />
          <ImpactHighlightCard
            label="Conflicts Monitored"
            value="27"
            caption="6 high-urgency alerts"
          />
        </ScrollView>
      </View>

      <View style={styles.sectionHeader}>
        <Text variant="headlineSmall">Recommended Conflicts</Text>
        <Text variant="bodySmall" style={styles.sectionSubtitle}>
          Swipe through curated conflict briefings and support trusted
          organizations.
        </Text>
      </View>

      {cards.map((card) => (
        <ConflictCard
          key={card.id}
          card={card}
          onDonatePress={handleDonate}
          onLearnMorePress={handleLearnMore}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
    gap: 24,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
  },
  retryButton: {
    marginTop: 16,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    marginHorizontal: 16,
  },
  highlightRow: {
    paddingHorizontal: 16,
    gap: 12,
  },
  quickActions: {
    paddingHorizontal: 16,
    gap: 12,
  },
  sectionHeader: {
    marginHorizontal: 16,
    gap: 4,
  },
  sectionSubtitle: {
    color: "#475467",
  },
});

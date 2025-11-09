import { useCallback } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";

import { ConflictCard } from "@/components/ConflictCard";
import { useRecommendationFeed } from "@/hooks/useRecommendationFeed";

export default function HomeScreen() {
  const { cards, isLoading, isError, refetch } = useRecommendationFeed();

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
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Recommended Conflicts
      </Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Swipe through curated conflict briefings and support trusted
        organizations.
      </Text>
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
    paddingBottom: 32,
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
  title: {
    marginTop: 24,
    marginHorizontal: 16,
  },
  subtitle: {
    marginHorizontal: 16,
    marginBottom: 8,
    color: "#475467",
  },
});

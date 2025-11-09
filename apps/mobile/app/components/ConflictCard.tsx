import { FC } from "react";
import { View, StyleSheet } from "react-native";
import { Badge, Button, Card, Text } from "react-native-paper";

import type { ConflictCard as ConflictCardType } from "@/hooks/useRecommendationFeed";

const severityColorMap: Record<ConflictCardType["severityLevel"], string> = {
  low: "#4CAF50",
  medium: "#FFC107",
  high: "#FF7043",
  critical: "#D64550",
};

export type ConflictCardProps = {
  card: ConflictCardType;
  onDonatePress?: (conflictId: string) => void;
  onLearnMorePress?: (conflictId: string) => void;
};

export const ConflictCard: FC<ConflictCardProps> = ({
  card,
  onDonatePress,
  onLearnMorePress,
}) => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <Text variant="titleMedium">{card.country}</Text>
          <Badge
            style={[
              styles.severityBadge,
              { backgroundColor: severityColorMap[card.severityLevel] },
            ]}
          >
            {card.severityLevel.toUpperCase()}
          </Badge>
        </View>
        <Text variant="headlineSmall" style={styles.title}>
          {card.title}
        </Text>
        <Text variant="bodyMedium" style={styles.summary} numberOfLines={3}>
          {card.summary}
        </Text>
        <Text variant="labelLarge" style={styles.sectionLabel}>
          Verified Organizations
        </Text>
        {card.organizations.map((org) => (
          <Text key={org.id} variant="bodySmall" style={styles.organization}>
            • {org.name} ({org.verificationStatus})
          </Text>
        ))}
      </Card.Content>
      <Card.Actions style={styles.actions}>
        <Button mode="outlined" onPress={() => onLearnMorePress?.(card.id)}>
          Learn More
        </Button>
        <Button mode="contained" onPress={() => onDonatePress?.(card.id)}>
          Donate
        </Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    marginTop: 12,
  },
  summary: {
    marginTop: 12,
    color: "#344054",
  },
  sectionLabel: {
    marginTop: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  organization: {
    marginTop: 4,
  },
  actions: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  severityBadge: {
    fontWeight: "bold",
  },
});

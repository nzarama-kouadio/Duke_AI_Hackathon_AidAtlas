import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export type ImpactHighlightCardProps = {
  label: string;
  value: string;
  caption: string;
};

export const ImpactHighlightCard: FC<ImpactHighlightCardProps> = ({
  label,
  value,
  caption,
}) => (
  <View style={styles.card}>
    <Text variant="labelLarge" style={styles.label}>
      {label}
    </Text>
    <Text variant="headlineMedium" style={styles.value}>
      {value}
    </Text>
    <Text variant="bodySmall" style={styles.caption}>
      {caption}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
    minWidth: 160,
    marginRight: 12,
  },
  label: {
    color: "#475467",
    letterSpacing: 1,
  },
  value: {
    color: "#0B1F2C",
    marginTop: 8,
  },
  caption: {
    color: "#667085",
    marginTop: 8,
  },
});

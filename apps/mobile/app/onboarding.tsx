import { useCallback, useMemo, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Button, Checkbox, Text, ToggleButton } from "react-native-paper";

import { usePreferencesStore } from "@/stores/usePreferencesStore";

const CAUSE_OPTIONS = [
  "humanitarian_aid",
  "health",
  "education",
  "refugee_support",
] as const;
const REGION_OPTIONS = [
  "africa",
  "europe",
  "latam",
  "middle_east",
  "asia",
] as const;
const DONATION_RANGES = ["$10-$25", "$25-$50", "$50-$100", "$100+"] as const;

export default function OnboardingScreen() {
  const [selectedCauses, setSelectedCauses] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [donationRange, setDonationRange] = useState<string | null>(null);

  const setCauses = usePreferencesStore((state) => state.setCauses);
  const setRegions = usePreferencesStore((state) => state.setRegions);
  const setPreferredDonationRange = usePreferencesStore(
    (state) => state.setPreferredDonationRange,
  );

  const canContinue = useMemo(
    () => selectedCauses.length > 0 && selectedRegions.length > 0,
    [selectedCauses, selectedRegions],
  );

  const handleContinue = useCallback(() => {
    setCauses(selectedCauses);
    setRegions(selectedRegions);
    setPreferredDonationRange(
      donationRange as (typeof DONATION_RANGES)[number] | null,
    );
    // TODO: navigate to home or next onboarding step
  }, [
    selectedCauses,
    selectedRegions,
    donationRange,
    setCauses,
    setRegions,
    setPreferredDonationRange,
  ]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Tailor Your AidAtlas Experience
      </Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Choose the causes and regions you care most about to jumpstart
        personalized recommendations.
      </Text>

      <Text variant="titleSmall" style={styles.sectionTitle}>
        Causes
      </Text>
      <View style={styles.checkboxGroup}>
        {CAUSE_OPTIONS.map((cause) => {
          const checked = selectedCauses.includes(cause);
          return (
            <View key={cause} style={styles.checkboxRow}>
              <Checkbox
                status={checked ? "checked" : "unchecked"}
                onPress={() =>
                  setSelectedCauses((prev) =>
                    checked
                      ? prev.filter((item) => item !== cause)
                      : [...prev, cause],
                  )
                }
              />
              <Text variant="bodyLarge">{cause.replace("_", " ")}</Text>
            </View>
          );
        })}
      </View>

      <Text variant="titleSmall" style={styles.sectionTitle}>
        Regions
      </Text>
      <View style={styles.checkboxGroup}>
        {REGION_OPTIONS.map((region) => {
          const checked = selectedRegions.includes(region);
          return (
            <View key={region} style={styles.checkboxRow}>
              <Checkbox
                status={checked ? "checked" : "unchecked"}
                onPress={() =>
                  setSelectedRegions((prev) =>
                    checked
                      ? prev.filter((item) => item !== region)
                      : [...prev, region],
                  )
                }
              />
              <Text variant="bodyLarge">{region.replace("_", " ")}</Text>
            </View>
          );
        })}
      </View>

      <Text variant="titleSmall" style={styles.sectionTitle}>
        Preferred Donation Range
      </Text>
      <ToggleButton.Row
        onValueChange={setDonationRange}
        value={donationRange}
        style={styles.toggleRow}
      >
        {DONATION_RANGES.map((range) => (
          <ToggleButton
            key={range}
            icon="cash"
            value={range}
            style={styles.toggleButton}
          >
            {range}
          </ToggleButton>
        ))}
      </ToggleButton.Row>

      <Button
        mode="contained"
        disabled={!canContinue}
        onPress={handleContinue}
        style={styles.submitButton}
      >
        Continue
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 72,
    paddingBottom: 48,
    paddingHorizontal: 24,
  },
  title: {
    marginBottom: 12,
  },
  subtitle: {
    marginBottom: 24,
    color: "#475467",
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 12,
  },
  checkboxGroup: {
    gap: 8,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  toggleRow: {
    marginTop: 8,
  },
  toggleButton: {
    marginRight: 12,
  },
  submitButton: {
    marginTop: 32,
  },
});

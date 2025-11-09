import { LinearGradient } from "expo-linear-gradient";
import { FC } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

const gradientColors = ["#0B8FAC", "#0B1F2C"];

export type HeroHeaderProps = {
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
};

export const HeroHeader: FC<HeroHeaderProps> = ({
  onPrimaryAction,
  onSecondaryAction,
}) => {
  return (
    <LinearGradient
      colors={gradientColors}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.content}>
        <Text variant="labelLarge" style={styles.kicker}>
          HUMANITARIAN SIGNALS
        </Text>
        <Text variant="headlineLarge" style={styles.title}>
          Donate with clarity.
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          AidAtlas curates conflict updates, verifies organizations, and keeps
          you informed about real impact.
        </Text>
        <View style={styles.actions}>
          <Button
            mode="contained"
            onPress={onPrimaryAction}
            style={styles.primaryButton}
          >
            Explore Conflicts
          </Button>
          <Button
            mode="outlined"
            textColor="#F5F7FA"
            onPress={onSecondaryAction}
          >
            View Impact Map
          </Button>
        </View>
      </View>
      <Image
        source={require("../../assets/icon.png")}
        style={styles.logo}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    marginHorizontal: 16,
    marginTop: 16,
  },
  content: {
    flex: 1,
    gap: 12,
  },
  kicker: {
    color: "#F2A541",
    letterSpacing: 1.8,
  },
  title: {
    color: "#F5F7FA",
  },
  subtitle: {
    color: "#D9E8EE",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
  },
  primaryButton: {
    backgroundColor: "#F2A541",
  },
  logo: {
    width: 96,
    height: 96,
    marginLeft: 16,
  },
});

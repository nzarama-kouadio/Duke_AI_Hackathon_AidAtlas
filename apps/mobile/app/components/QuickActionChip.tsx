import { FC } from "react";
import { StyleSheet } from "react-native";
import { Chip } from "react-native-paper";

type QuickActionChipProps = {
  label: string;
  icon: string;
  onPress?: () => void;
};

export const QuickActionChip: FC<QuickActionChipProps> = ({
  label,
  icon,
  onPress,
}) => (
  <Chip
    icon={icon}
    onPress={onPress}
    style={styles.chip}
    textStyle={styles.label}
  >
    {label}
  </Chip>
);

const styles = StyleSheet.create({
  chip: {
    marginRight: 10,
    backgroundColor: "#E0F4F8",
  },
  label: {
    fontWeight: "600",
  },
});

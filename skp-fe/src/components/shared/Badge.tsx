import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export type BadgeVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "outline";

interface BadgeProps {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: BadgeVariant;
  iconSize?: number;
  textClassName?: string;
  className?: string;
}

const VARIANT_STYLES: Record<
  BadgeVariant,
  { container: string; text: string; iconColor: string }
> = {
  primary: {
    container: "bg-blue-50 border border-blue-100/60",
    text: "text-blue-700",
    iconColor: "#2563EB",
  },
  secondary: {
    container: "bg-gray-100 border border-gray-200/60",
    text: "text-gray-700",
    iconColor: "#4B5563",
  },
  success: {
    container: "bg-emerald-50 border border-emerald-100/60",
    text: "text-emerald-700",
    iconColor: "#047857",
  },
  warning: {
    container: "bg-amber-50 border border-amber-100/60",
    text: "text-amber-700",
    iconColor: "#B45309",
  },
  danger: {
    container: "bg-red-50 border border-red-100/60",
    text: "text-red-700",
    iconColor: "#DC2626",
  },
  outline: {
    container: "bg-transparent border border-gray-300",
    text: "text-gray-600",
    iconColor: "#6B7280",
  },
};

export function Badge({
  label,
  icon,
  variant = "primary",
  iconSize = 13,
  textClassName = "",
  className = "",
}: BadgeProps) {
  const theme = VARIANT_STYLES[variant];

  return (
    <View
      className={`flex-row items-center gap-x-1.5 px-2.5 py-1 rounded-full ${theme.container} ${className}`}
    >
      {icon && <Ionicons name={icon} size={iconSize} color={theme.iconColor} />}

      <Text className={`${theme.text} ${textClassName === "" ? "text-xs font-semibold" : textClassName}`}>
        {label}
      </Text>
    </View>
  );
}
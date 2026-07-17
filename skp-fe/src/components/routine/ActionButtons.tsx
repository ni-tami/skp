import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

interface ActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
  editLabel?: string;
  deleteLabel?: string;
  containerClassName?: string;
}

export function ActionButtons({
  onEdit,
  onDelete,
  editLabel = "Edit",
  deleteLabel = "Delete",
  containerClassName = "",
}: ActionButtonsProps) {
  return (
    <View className={`flex-row items-center gap-x-2.5 ${containerClassName}`}>
      <Pressable
        onPress={onEdit}
        className="flex-row items-center bg-blue-50 px-3.5 py-2 rounded-xl active:bg-blue-100"
      >
        <Ionicons name="pencil" size={16} color="#1d4ed8" />
        <Text className="text-xs font-bold text-blue-700 ml-1">{editLabel}</Text>
      </Pressable>

      <Pressable
        onPress={onDelete}
        className="flex-row items-center bg-red-50 px-3.5 py-2 rounded-xl active:bg-red-100"
      >
        <Ionicons name="trash-outline" size={16} color="#DC2626" />
        <Text className="text-xs font-bold text-red-600 ml-1">{deleteLabel}</Text>
      </Pressable>
    </View>
  );
}
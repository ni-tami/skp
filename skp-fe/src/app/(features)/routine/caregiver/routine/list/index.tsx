import { ActionButtons } from "@/components/routine/ActionButtons";
import { Badge } from "@/components/shared/Badge";
import { FloatingButton } from "@/components/shared/FloatingButton";
import { SearchBar } from "@/components/shared/SearchBar";
import { CATEGORY_ICON_MAPPING, IconName } from "@/constants/routine";
import { getRoutinesQueryOpt } from "@/services/queryOptions/routineQueryOpt";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const getCategoryIconConfig = (categoryId?: number) => {
  if (!categoryId) return { icon: "pricetag-outline" as IconName, color: "#2563EB" };
  const mapped = CATEGORY_ICON_MAPPING[String(categoryId) as keyof typeof CATEGORY_ICON_MAPPING];
  return {
    icon: (mapped?.icon as IconName) ?? ("pricetag-outline" as IconName),
    color: mapped?.color ?? "#2563EB",
  };
};

export default function RoutineListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState("");

  const { data: routines, isLoading: isLoading } = useQuery({
    ...getRoutinesQueryOpt(),
    select: (data) => data,
  });

  const handleDeleteRoutine = (id: number, title: string) => {
    Alert.alert(
      "Delete Routine",
      `Are you sure you want to delete "${title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {},
        },
      ]
    );
  };

  const filteredRoutines = routines?.filter((item) => {
    const query = searchQuery.toLowerCase();
    const matchTitle = item.title.toLowerCase().includes(query);
    const matchDetail = item.detail?.toLowerCase().includes(query) ?? false;
    const matchRecipient = item.carerecipient?.name?.toLowerCase().includes(query) ?? false;
    return matchTitle || matchDetail || matchRecipient;
  });

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-brand">
      <View className="pt-12 pb-5 px-5 shadow-sm">
        <Text className="text-2xl font-bold text-white">Routines</Text>
        <Text className="text-sm text-blue-100 mt-0.5 mb-4">Manage reusable care routines</Text>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search routines or care recipients..."
        />
      </View>

      <View className="flex-1 bg-gray-50 rounded-t-2xl">
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#2563EB" />
          </View>
        ) : (
          <FlatList
            data={filteredRoutines}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 20, flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center">
                <Text className="text-gray-400 font-bold text-lg mt-3">No routines found</Text>
              </View>
            }
            renderItem={({ item }) => {
              const catConfig = getCategoryIconConfig(item.category?.id);
              return (
                <View className="bg-white p-4 rounded-2xl border border-gray-200/80 mb-4 shadow-sm">
                  {item.carerecipient && (
                    <View className="mb-2.5 self-start">
                      <Badge
                        label={item.carerecipient.name}
                        icon="person"
                        variant="secondary"
                      />
                    </View>
                  )}

                  {/* Title + Category Row */}
                  <View className="flex-row items-center justify-between mb-2.5">
                    <Text className="text-lg font-bold text-gray-900 flex-1 mr-2" numberOfLines={1}>
                      {item.title}
                    </Text>

                    <Badge
                      label={item.category?.name ?? "Routine"}
                      icon={catConfig.icon}
                    />
                  </View>

                  {/* Detail + Active Status Row */}
                  <View className="flex-row items-start justify-between mb-4 gap-x-2">
                    <Text className="text-sm text-gray-500 flex-1 leading-relaxed" numberOfLines={2}>
                      {item.detail ?? "No details provided"}
                    </Text>

                    <Badge
                      label={item.is_active ? "Active" : "Disabled"}
                      icon={item.is_active ? "checkmark-circle" : "ban"}
                      iconSize={14}
                      variant={item.is_active ? "success" : "secondary"}
                    />
                  </View>

                  <View className="pt-3.5 border-t border-gray-100 flex-row items-center justify-between">
                    <ActionButtons
                      onEdit={() =>
                        router.push({
                          pathname: "/routine/caregiver/routine/manage",
                          params: { id: item.id },
                        })
                      }
                      onDelete={() => handleDeleteRoutine(item.id, item.title)}
                    />

                    <Pressable
                      onPress={() =>
                        router.push({
                          pathname: "/routine/caregiver/setting/manage",
                          params: { routineId: item.id },
                        })
                      }
                      className="flex-row items-center bg-indigo-600 px-4 py-2 rounded-xl active:bg-indigo-700 shadow-xs"
                    >
                      <Ionicons name="calendar-outline" size={16} color="white" />
                      <Text className="text-xs font-bold text-white ml-1.5">Create Setting</Text>
                    </Pressable>
                  </View>
                </View>
              );
            }}
          />
        )}
      </View>
      
      <FloatingButton
        onPress={() => router.push("/routine/caregiver/routine/manage")}
      />
    </SafeAreaView>
  );
}
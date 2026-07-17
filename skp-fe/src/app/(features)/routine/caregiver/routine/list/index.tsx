
import { ActionButtons } from "@/components/routine/ActionButtons";
import { Badge } from "@/components/shared/Badge";
import { FloatingButton } from "@/components/shared/FloatingButton";
import { SearchBar } from "@/components/shared/SearchBar";
import { CATEGORY_ICON_MAPPING, IconName } from "@/constants/routine";
import { Routine } from "@/services/routine";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
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

  const [isLoading, setIsLoading] = useState(true);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchRoutines();
  }, []);

  const fetchRoutines = async () => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 400));

      const mockRoutines: Routine[] = [
        {
          id: 10,
          title: "Morning Medication",
          detail: "Take 1 pill after breakfast with water",
          category: { id: 2, name: "Medication", icon: "medkit", created_at: "", updated_at: "" },
          carerecipient: { id: 101, name: "Eleanor Vance" } as any,
          notifications_enabled: true,
          is_active: true,
          created_at: "",
          updated_at: "",
        } as Routine,
        {
          id: 11,
          title: "Afternoon Walk",
          detail: "30 minutes light walking around the garden",
          category: { id: 5, name: "Activity", icon: "walk", created_at: "", updated_at: "" },
          carerecipient: { id: 102, name: "Arthur Pendelton" } as any,
          notifications_enabled: true,
          is_active: false,
          created_at: "",
          updated_at: "",
        } as Routine,
      ];

      setRoutines(mockRoutines);
    } catch (err) {
      console.error("Error fetching routines:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRoutine = (id: number, title: string) => {
    Alert.alert(
      "Delete Routine",
      `Are you sure you want to delete "${title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setRoutines((prev) => prev.filter((item) => item.id !== id));
          },
        },
      ]
    );
  };

  const filteredRoutines = routines.filter((item) => {
    const query = searchQuery.toLowerCase();
    const matchTitle = item.title.toLowerCase().includes(query);
    const matchDetail = item.detail?.toLowerCase().includes(query) ?? false;
    const matchRecipient = item.carerecipient?.name?.toLowerCase().includes(query) ?? false;
    return matchTitle || matchDetail || matchRecipient;
  });

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-blue-600">
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
            contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 20 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="py-16 items-center">
                <Ionicons name="clipboard-outline" size={52} color="#9CA3AF" />
                <Text className="text-gray-400 font-bold text-lg mt-3">No routines found</Text>
              </View>
            }
            renderItem={({ item }) => {
              const catConfig = getCategoryIconConfig(item.category?.id);
              return (
                <View className="bg-white p-4 rounded-2xl border border-gray-200/80 mb-4 shadow-sm">
                  
                  <View className="flex-row items-center justify-between mb-2.5">
                    {item.carerecipient ? (
                      <Badge
                        label={item.carerecipient.name}
                        icon="person"
                        variant="secondary"
                      />
                    ) : (
                      <View />
                    )}

                    <Badge
                      label={item.category?.name ?? "Routine"}
                      icon={catConfig.icon}
                      iconSize={15}
                      variant={item.category.variant}
                    />
                  </View>

                  <View className="flex-row items-center justify-between mb-2.5">
                    <Text className="text-lg font-bold text-gray-900 flex-1 mr-2">{item.title}</Text>

                    <Badge
                      label={item.is_active ? "Active" : "Disabled"}
                      icon={item.is_active ? "checkmark-circle" : "ban"}
                      iconSize={14}
                      variant={item.is_active ? "success" : "secondary"}
                    />
                  </View>

                  {item.detail && (
                    <Text className="text-sm text-gray-500 mb-4 leading-relaxed" numberOfLines={2}>
                      {item.detail}
                    </Text>
                  )}

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
                          pathname: "/routine/caregiver/schedule/manage",
                          params: { routineId: item.id },
                        })
                      }
                      className="flex-row items-center bg-indigo-600 px-4 py-2 rounded-xl active:bg-indigo-700 shadow-xs"
                    >
                      <Ionicons name="calendar-outline" size={16} color="white" />
                      <Text className="text-xs font-bold text-white ml-1.5">Schedule</Text>
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
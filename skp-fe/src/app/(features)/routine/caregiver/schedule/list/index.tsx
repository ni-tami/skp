import { ActionButtons } from "@/components/routine/ActionButtons";
import { Badge } from "@/components/shared/Badge";
import { FloatingButton } from "@/components/shared/FloatingButton";
import { SearchBar } from "@/components/shared/SearchBar";
import { DUMMY_SCHEDULES } from "@/constants/dummy";
import { REPEAT_TYPE } from "@/constants/routine";
import { RoutineSchedule } from "@/services/routine";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function ScheduleListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [isLoading, setIsLoading] = useState(true);
  const [schedules, setSchedules] = useState<RoutineSchedule[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 400));

        const mockSchedules: RoutineSchedule[] = DUMMY_SCHEDULES;

        setSchedules(mockSchedules);
      } catch (err) {
        console.error("Error fetching schedules:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const handleDeleteSchedule = (id: number, title?: string) => {
    Alert.alert(
      "Delete Schedule",
      `Are you sure you want to delete the schedule for "${title ?? "this routine"}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setSchedules((prev) => prev.filter((item) => item.id !== id));
          },
        },
      ]
    );
  };

  const filteredSchedules = schedules.filter((item) => {
    const query = searchQuery.toLowerCase();
    const matchTitle = item.routine?.title?.toLowerCase().includes(query) ?? false;
    const matchRecipient = item.routine?.carerecipient?.name?.toLowerCase().includes(query) ?? false;
    return matchTitle || matchRecipient;
  });

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-blue-600">
      <View className="pt-12 pb-5 px-5 shadow-sm">
        <Text className="text-2xl font-bold text-white">Scheduled Routines</Text>
        <Text className="text-sm text-blue-100 mt-0.5 mb-4">
          Schedule recurring reminders
        </Text>

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search schedules or recipient..."
        />
      </View>

      <View className="flex-1 bg-gray-50 rounded-t-2xl overflow-hidden relative">
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#2563EB" />
          </View>
        ) : (
          <FlatList
            data={filteredSchedules}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 80 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="py-16 items-center">
                <Ionicons name="calendar-outline" size={52} color="#9CA3AF" />
                <Text className="text-gray-400 font-bold text-lg mt-3">No active schedules</Text>
                <Text className="text-gray-400 text-sm mt-1">Tap + below to schedule a routine</Text>
              </View>
            }
            renderItem={({ item }) => (
              <View className="bg-white p-4 rounded-2xl border border-gray-200/80 mb-3.5 shadow-sm">
                <View className="flex-row items-center justify-between mb-2.5">
                  <Badge
                    label={`${item.start_time} - ${item.end_time}`}
                    icon="time"
                  />

                  <Badge
                    label={item.repeat_type}
                    icon="refresh"
                    variant="secondary"
                  />
                </View>

                <Text className="text-lg font-bold text-gray-900 mb-1">
                  {item.routine?.title ?? "Routine Schedule"}
                </Text>

                <Text className="text-sm text-gray-500 mb-3">
                  Remind every <Text className="font-bold text-gray-700">{item.interval} min(s)</Text>
                </Text>

                {item.repeat_type === REPEAT_TYPE.WEEKLY && item.day_of_week?.length > 0 && (
                  <View className="flex-row flex-wrap gap-1.5 mb-3">
                    {item.day_of_week.map((day) => (
                      <Badge
                        key={day}
                        label={day.slice(0, 3)}
                        variant="success"
                      />
                    ))}
                  </View>
                )}

                <View className="pt-3 border-t border-gray-100 flex-row items-center align-middle justify-between gap-x-2">
                  {item.routine?.carerecipient && (
                      <Badge
                        label={item.routine.carerecipient.name}
                        icon="person"
                        variant="secondary"
                      />
                  )}
                    <ActionButtons
                      onEdit={() =>
                        router.push({
                          pathname: "/routine/caregiver/schedule/manage",
                          params: { scheduleId: item.id },
                        })
                      }
                      onDelete={() => handleDeleteSchedule(item.id, item.routine?.title)}
                    />
                </View>

              </View>
            )}
          />
        )}
      </View>
      <FloatingButton
        onPress={() => router.push("/routine/caregiver/schedule/manage")}
      />
    </SafeAreaView>
  );
}
import { Badge } from "@/components/shared/Badge";
import { SearchBar } from "@/components/shared/SearchBar";
import { DUMMY_ROUTINES } from "@/constants/dummy";
import {
  DAY_OF_WEEK,
  DayOfWeek,
  REPEAT_TYPE,
  RepeatType,
} from "@/constants/routine";
import { Routine } from "@/services/routine";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DEFAULT_SELECTED_DAYS: Record<DayOfWeek, boolean> = {
  [DAY_OF_WEEK.MONDAY]: true,
  [DAY_OF_WEEK.TUESDAY]: true,
  [DAY_OF_WEEK.WEDNESDAY]: true,
  [DAY_OF_WEEK.THURSDAY]: true,
  [DAY_OF_WEEK.FRIDAY]: true,
  [DAY_OF_WEEK.SATURDAY]: true,
  [DAY_OF_WEEK.SUNDAY]: true,
};

export default function AddOrEditScheduleScreen() {
  const router = useRouter();
  const { scheduleId, routineId } = useLocalSearchParams<{ scheduleId?: string; routineId?: string }>();
  const isEditing = Boolean(scheduleId);

  const [isLoading, setIsLoading] = useState(true);
  const [availableRoutines, setAvailableRoutines] = useState<Routine[]>([]);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const [showRoutineModal, setShowRoutineModal] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");

  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 1);
    return d;
  });
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [interval, setInterval] = useState(1);
  const [repeatType, setRepeatType] = useState<RepeatType>(REPEAT_TYPE.DAILY);
  
  const [selectedDays, setSelectedDays] = useState<Record<DayOfWeek, boolean>>(DEFAULT_SELECTED_DAYS);

  useEffect(() => {
    const loadScheduleData = async () => {
      try {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 400));

        const mockRoutines: Routine[] = DUMMY_ROUTINES;

        setAvailableRoutines(mockRoutines);

        if (routineId) {
          const matched = mockRoutines.find((r) => r.id === Number(routineId));
          if (matched) setSelectedRoutine(matched);
        } else if (mockRoutines.length > 0) {
          setSelectedRoutine(mockRoutines[0]);
        }
      } catch (err) {
        console.error("Error loading schedule data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadScheduleData();
  }, [scheduleId, routineId]);

  const filteredRoutines = availableRoutines.filter((routine) => {
    const query = searchQuery.toLowerCase();
    const matchesTitle = routine.title?.toLowerCase().includes(query);
    const matchesDetail = routine.detail?.toLowerCase().includes(query) ?? false;
    const matchesRecipientName = routine.carerecipient?.name?.toLowerCase().includes(query) ?? false;

    return matchesTitle || matchesDetail || matchesRecipientName;
  });

  const toggleDay = (day: DayOfWeek) => {
    setSelectedDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const handleSaveSchedule = async () => {
    if (!selectedRoutine) return;

    const activeDaysArray = (Object.keys(selectedDays) as DayOfWeek[]).filter(
      (day) => selectedDays[day]
    );

        Alert.alert("Success", "Successfully saved routine.");
    router.back();
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#2563EB" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-gray-50">
      <View className="bg-blue-600 pt-12 pb-4 px-4 flex-row items-center justify-between shadow-sm">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 bg-blue-700/60 items-center justify-center rounded-full active:bg-blue-800"
        >
          <Ionicons name="arrow-back" size={22} color="white" />
        </Pressable>
        <Text className="text-xl font-bold text-white">
          {isEditing ? "Update Setting" : "Create Setting"}
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
        <Text className="text-xs font-bold text-gray-500 uppercase tracking mb-2">
          Select Routine
        </Text>
        <Pressable
          onPress={() => setShowRoutineModal(true)}
          className="bg-white p-4 rounded-2xl border border-gray-200 flex-row items-center justify-between mb-6 active:bg-gray-100"
        >
          <View className="flex-1 pr-2">
            <Text className="text-xs text-gray-400 font-medium">Routine</Text>
            <Text className="text-base font-bold text-gray-900">
              {selectedRoutine?.title ?? "Choose Routine"}
            </Text>
            {selectedRoutine?.carerecipient && (
              <View className="mt-1 self-start">
                <Badge
                  label={selectedRoutine.carerecipient.name}
                  icon="person"
                  variant="secondary"
                />
              </View>
            )}
          </View>
          <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
        </Pressable>

        <View className="bg-white p-4 rounded-2xl border border-gray-200 mb-6 gap-y-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 mr-2">
              <Text className="text-xs font-bold text-gray-500 uppercase tracking mb-1">
                Start Time
              </Text>
              <Pressable
                onPress={() => setShowStartTimePicker(true)}
                className="bg-gray-50 p-3 rounded-xl border border-gray-200 items-center active:bg-gray-100"
              >
                <Text className="text-base font-bold text-gray-900">
                  {startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </Text>
              </Pressable>
            </View>

            <View className="flex-1 ml-2">
              <Text className="text-xs font-bold text-gray-500 uppercase tracking mb-1">
                End Time
              </Text>
              <Pressable
                onPress={() => setShowEndTimePicker(true)}
                className="bg-gray-50 p-3 rounded-xl border border-gray-200 items-center active:bg-gray-100"
              >
                <Text className="text-base font-bold text-gray-900">
                  {endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </Text>
              </Pressable>
            </View>
          </View>

          {showStartTimePicker && (
            <DateTimePicker
              value={startTime}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onValueChange={(e, date) => {
                setShowStartTimePicker(Platform.OS === "ios");
                if (date) setStartTime(date);
              }}
            />
          )}

          {showEndTimePicker && (
            <DateTimePicker
              value={endTime}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onValueChange={(e, date) => {
                setShowEndTimePicker(Platform.OS === "ios");
                if (date) setEndTime(date);
              }}
            />
          )}

          <View className="pt-2 border-t border-gray-100 flex-row items-center justify-between">
            <View className="flex-1 pr-2">
              <Text className="text-xs font-bold text-gray-500 uppercase tracking">
                Interval
              </Text>
              <View className="flex-row items-center gap-2">
                <Text className="text-sm text-gray-400 mt-0.5">
                  Trigger reminder every
                </Text>
                <TextInput
                  value={String(interval)}
                  onChangeText={(val) => setInterval(parseInt(val, 10) || 1)}
                  keyboardType="number-pad"
                  className="bg-gray-50 border border-gray-200 w-16 p-2 rounded-xl text-center font-bold text-gray-900 text-base"
                />
                <Text className="text-xs text-right text-gray-400">
                  min(s)
                </Text>
              </View>
            </View>
          </View>

          <View className="pt-2 border-t border-gray-100">
            <Text className="text-xs font-bold text-gray-500 uppercase tracking mb-2">
              Repeat Type
            </Text>
            <View className="flex-row flex-wrap gap-x-2 gap-y-2.5">
              {Object.values(REPEAT_TYPE).map((type) => {
                const isSelected = repeatType === type;
                return (
                  <Pressable
                    key={type}
                    onPress={() => setRepeatType(type)}
                    className={`w-20 items-center px-4 py-2.5 rounded-xl border ${
                      isSelected ? "bg-blue-600 border-blue-600" : "bg-gray-50 border-gray-200"
                    } active:bg-blue-700`}
                  >
                    <Text className={`text-xs font-bold ${isSelected ? "text-white" : "text-gray-600"}`}>
                      {type}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {repeatType === REPEAT_TYPE.WEEKLY && (
            <View className="pt-2 border-t border-gray-100">
              <Text className="text-xs font-bold text-gray-500 uppercase tracking mb-3">
                Days of Week
              </Text>
              <View className="flex-row justify-between">
                {Object.values(DAY_OF_WEEK).map((day) => {
                  const isSelected = Boolean(selectedDays[day]);
                  return (
                    <Pressable
                      key={day}
                      onPress={() => toggleDay(day)}
                      className={`w-9 h-9 rounded-full items-center justify-center ${
                        isSelected ? "bg-blue-600 active:bg-blue-800" : "bg-gray-100 active:bg-gray-200"
                      }`}
                    >
                      <Text className={`text-xs font-bold ${isSelected ? "text-white" : "text-gray-600"}`}>
                        {day[0]}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <Modal visible={showRoutineModal} transparent animationType="slide">
        <Pressable onPress={() => setShowRoutineModal(false)} className="flex-1 bg-black/40 justify-end">
          <Pressable className="bg-white rounded-t-[32px] p-6 pb-10 h-[80%]">
            <View className="w-12 h-1.5 bg-gray-300 rounded-full self-center mb-6" />
            <Text className="text-lg font-bold text-gray-900 mb-4">Select Routine to Schedule</Text>

            <View className="mb-4">
              <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search by routine or recipient name..."
                isDarkMode={false}
              />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {filteredRoutines.length === 0 ? (
                <View className="py-8 items-center">
                  <Text className="text-gray-400 font-semibold text-sm">No routines found</Text>
                </View>
              ) : (
                filteredRoutines.map((routine) => {
                  const isSelected = selectedRoutine?.id === routine.id;
                  return (
                    <Pressable
                      key={routine.id}
                      onPress={() => {
                        setSelectedRoutine(routine);
                        setShowRoutineModal(false);
                        setSearchQuery("");
                      }}
                      className={`p-4 mb-2.5 rounded-2xl border flex-row items-center justify-between ${
                        isSelected ? "bg-blue-50 border-blue-600" : "bg-gray-50 border-gray-100"
                      } active:bg-gray-200`}
                    >
                      <View className="flex-1 pr-2">
                        <Text className="font-bold text-base text-gray-900">{routine.title}</Text>
                        
                        {routine.detail ? (
                          <Text className="text-xs text-gray-500 mt-0.5">{routine.detail}</Text>
                        ) : null}

                        {routine.carerecipient && (
                          <View className="mt-1 self-start">
                            <Badge
                              label={routine.carerecipient.name}
                              icon="person"
                              variant="secondary"
                            />
                          </View>
                        )}
                      </View>
                      {isSelected && <Ionicons name="checkmark-circle" size={22} color="#2563EB" />}
                    </Pressable>
                  );
                })
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      <View className="p-4 bg-white border-t border-gray-100">
        <Pressable
          onPress={handleSaveSchedule}
          disabled={!selectedRoutine}
          className={`py-4 rounded-2xl items-center justify-center ${
            selectedRoutine ? "bg-blue-600 active:bg-blue-800" : "bg-gray-300"
          }`}
        >
          <Text className="text-white font-bold text-base">
            {isEditing ? "Update Setting" : "Create Setting"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
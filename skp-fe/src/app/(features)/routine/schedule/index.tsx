import { DateHeader } from "@/components/routine/DateHeader";
import RoutineCard from "@/components/routine/RoutineCard";
import { DUMMY_SCHEDULES } from "@/constants/dummy";
import { getRoutineScheduleListQueryOpt } from "@/services/queryOptions/routineQueryOpt";
import { RoutineSchedule } from "@/services/routine";
import { useAuthStore } from "@/stores/auth-store";
import {
  createDateItem,
  DateItem,
  formatToLocalDateString,
  generateInitialDates,
  getTodayString,
} from "@/utils/date";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RoutineScreen() {
  const user = useAuthStore((state) => state.user);
  const [dates, setDates] = useState<DateItem[]>(() => generateInitialDates(14, 14));
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [isLoading, setIsLoading] = useState(false);
  const routinesListRef = useRef<FlatList<RoutineSchedule>>(null);

  const formattedDate = formatToLocalDateString(new Date(selectedDate));
  const isCaregiver = user?.role === "CAREGIVER";

  const queryOptions = getRoutineScheduleListQueryOpt({
    type: user?.role ?? "",
    date: formattedDate,
    caregiver_id: isCaregiver ? user?.id : undefined,
    carerecipient_id: !isCaregiver ? user?.id : undefined,
  });

  const routines = DUMMY_SCHEDULES;

  // const { data: routines = [], isLoading } = useQuery({
  //   ...queryOptions,
  //   enabled: Boolean(user?.id && user?.role),
  // });

  useEffect(() => {
    routinesListRef.current?.scrollToOffset({
      offset: 0,
      animated: true,
    });
  }, [selectedDate]);

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
  };

  const handleLoadMorePast = () => {
    setDates((prev) => {
      if (prev.length === 0) return prev;

      const earliestStr = prev[0].dateString;
      const earliestDate = new Date(earliestStr + "T00:00:00");

      const newPastDates: DateItem[] = [];
      for (let i = 14; i >= 1; i--) {
        const d = new Date(earliestDate);
        d.setDate(d.getDate() - i);
        newPastDates.push(createDateItem(d));
      }

      const existingKeys = new Set(prev.map((d) => d.dateString));
      const uniquePast = newPastDates.filter((d) => !existingKeys.has(d.dateString));

      return [...uniquePast, ...prev];
    });
  };

  const handleLoadMoreFuture = () => {
    setDates((prev) => {
      if (prev.length === 0) return prev;

      const latestStr = prev[prev.length - 1].dateString;
      const latestDate = new Date(latestStr + "T00:00:00");

      const newFutureDates: DateItem[] = [];
      for (let i = 1; i <= 14; i++) {
        const d = new Date(latestDate);
        d.setDate(d.getDate() + i);
        newFutureDates.push(createDateItem(d));
      }

      const existingKeys = new Set(prev.map((d) => d.dateString));
      const uniqueFuture = newFutureDates.filter((d) => !existingKeys.has(d.dateString));

      return [...prev, ...uniqueFuture];
    });
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} className="bg-brand flex-1 pt-4">
      <DateHeader
        dates={dates}
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
        onLoadMorePast={handleLoadMorePast}
        onLoadMoreFuture={handleLoadMoreFuture}
      />
      <View className="flex-1 mt-6 bg-gray-50 px-4 rounded-t-2xl">
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#2563EB" />
          </View>
        ) : (
          <FlatList
            ref={routinesListRef}
            className="pt-4"
            data={routines}
            keyExtractor={(item) => item.id.toString()}
            contentContainerClassName="gap-1"
            renderItem={({ item, index }) => (
              <RoutineCard
                item={item}
                itemBefore={index > 0 ? routines[index - 1] : null}
              />
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
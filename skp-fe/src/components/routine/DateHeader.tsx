import { DateItem } from '@/utils/date';
import { getUserFont } from '@/utils/user';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerChangeEvent } from '@react-native-community/datetimepicker';
import { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';

interface DateHeaderProps {
  dates: DateItem[];
  selectedDate: string;
  onSelectDate: (dateString: string) => void;
  onLoadMorePast: () => void;
  onLoadMoreFuture: () => void;
}

const ITEM_WIDTH = 68;

export function DateHeader({
  dates,
  selectedDate,
  onSelectDate,
  onLoadMorePast,
  onLoadMoreFuture,
}: DateHeaderProps) {
  const flatListRef = useRef<FlatList>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const isFetching = useRef(false);

  const selectedIndex = dates ? dates.findIndex((d) => d.dateString === selectedDate) : -1;

  if (!dates || dates.length === 0) {
    return null;
  }

  const USER_FONT = getUserFont();

  const selectedItem = dates[selectedIndex] ?? dates[0];

  useEffect(() => {
    if (selectedIndex !== -1 && flatListRef.current) {
      flatListRef.current.scrollToOffset({
        offset: selectedIndex * ITEM_WIDTH,
        animated: true,
      });
    }
  }, [selectedDate, selectedIndex]);

  const handleDatePress = (dateString: string) => {
    onSelectDate(dateString);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isFetching.current) return;

    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;

    if (contentOffset.x < 100) {
      isFetching.current = true;
      onLoadMorePast();
      setTimeout(() => {
        isFetching.current = false;
      }, 600);
    }

    if (contentOffset.x + layoutMeasurement.width > contentSize.width - 100) {
      isFetching.current = true;
      onLoadMoreFuture();
      setTimeout(() => {
        isFetching.current = false;
      }, 600);
    }
  };

  const handleCalendarChange = (event: DateTimePickerChangeEvent, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');

    if (!!!date) {
      return;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    if (formattedDate !== selectedDate) {
      onSelectDate(formattedDate);
    }
  };

  const selectedDateTime = new Date(selectedDate + 'T00:00:00');

  return (
    <View className="flex-col gap-3 bg-brand rounded-b-[32px]">
      <View className="px-6 flex-row items-center justify-between">
        <Text className={`${USER_FONT.SUPER_LARGE} font-bold text-white`}>
          {selectedItem?.fullFormattedDate}
        </Text>

        <Pressable
          onPress={() => setShowDatePicker(true)}
          className="bg-brand-press p-2.5 rounded-2xl active:bg-brand"
        >
          <Ionicons name="calendar-outline" size={22} color="white" />
        </Pressable>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDateTime}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onValueChange={handleCalendarChange}
        />
      )}

      <FlatList
        ref={flatListRef}
        data={dates}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.dateString}
        contentContainerStyle={{
          paddingLeft: 16,
          paddingRight: 16,
          gap: 10,
        }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index,
        })}
        renderItem={({ item }) => {
          const isSelected = item.dateString === selectedDate;

          return (
            <Pressable
              onPress={() => handleDatePress(item.dateString)}
              className={`items-center justify-center w-[58px] h-[82px] rounded-full ${isSelected ? 'bg-brand-tint' : 'bg-white'}`}
            >
              <Text className={`${USER_FONT.SUPER_LARGE} font-bold ${isSelected ? 'text-brand-press' : 'text-ink'}`}>{item.dayNumber}</Text>
              <Text className={`${USER_FONT.LARGE} font-bold ${isSelected ? 'text-brand-press' : 'text-slate'}`}>{item.dayName}</Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}
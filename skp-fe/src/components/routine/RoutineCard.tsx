import { USER_FONT_CAREGIVER, USER_FONT_CARERECIPIENT } from '@/constants/user';
import { RoutineCompletion } from '@/services/routine';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { Badge } from '../shared/Badge';
import RoutineStatus from './RoutineStatus';

interface Props {
    item: RoutineCompletion;
    itemBefore?: RoutineCompletion;
    isCaregiver: boolean;
}

export default function RoutineCard({ item, itemBefore, isCaregiver }: Props) {
    const showTimeBadge = item.schedule.start_time !== itemBefore?.schedule.start_time;
    const USER_FONT = isCaregiver ? USER_FONT_CAREGIVER : USER_FONT_CARERECIPIENT;

    return (
        <View className='flex-col gap-4 mb-3'>
            {showTimeBadge && (
                <View className="self-start">
                    <Badge
                        label={item.schedule.start_time}
                        textClassName={`${USER_FONT.LARGE} font-semibold`}
                        className="px-4 py-1.5"
                    />
                </View>
            )}

            <Pressable className="bg-white rounded-2xl p-5 border-2 border-gray-200 active:bg-gray-50">
                <View className="flex-col gap-y-3">
                    <View className="flex-row items-center justify-between mb-1">
                        {item.schedule.routine.carerecipient ? (
                            <Badge
                                label={item.schedule.routine.carerecipient.name}
                                icon="person"
                                variant="secondary"
                                textClassName={`${USER_FONT.SMALL} font-semibold`}
                            />
                        ) : (
                            <View />
                        )}

                        <Badge
                            label={item.schedule.routine.category?.name ?? "Routine"}
                            icon={(item.schedule.routine.category.icon as keyof typeof Ionicons.glyphMap) ?? "pricetag-outline"}
                            iconSize={16}
                            textClassName={`${USER_FONT.SMALL} font-semibold`}
                        />
                    </View>

                    <Text className={`${USER_FONT.SUPER_LARGE} text-gray-900 font-bold`}>
                        {item.schedule.routine.title}
                    </Text>

                    {item.schedule.routine.detail && (
                        <View className="flex-row gap-x-3 bg-gray-50 p-2 border-l-4 border-gray-200">
                            <Text className={`${USER_FONT.LARGE} flex-1 text-gray-700 `}>
                                {item.schedule.routine.detail}
                            </Text>
                        </View>
                    )}

                    <RoutineStatus item={item} isCaregiver={isCaregiver} />
                </View>
            </Pressable>
        </View>
    );
}
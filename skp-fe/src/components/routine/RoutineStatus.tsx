import { ROUTINE_STATUS } from '@/constants/routine';
import { RoutineSchedule } from '@/services/routine';
import { getUserFont } from '@/utils/user';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

interface Props {
    item: RoutineSchedule;
}

export default function RoutineStatus({ item }: Props) {
    const USER_FONT = getUserFont();

    const status = ROUTINE_STATUS[item.status];

    return (
        <View className="flex-row items-center justify-between mt-1">
            <View className={`flex-row items-center gap-2 ${status.bgColor} px-3.5 py-2 rounded-2xl`}>
                <Ionicons name={status.icon} size={24} color={status.hex} />
                <Text className={`${status.color} font-bold ${USER_FONT.LARGE}`}>
                    {status.name}
                </Text>
            </View>
        </View>
    );
}
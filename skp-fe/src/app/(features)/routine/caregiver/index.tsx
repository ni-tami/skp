import { DASHBOARD_SECTIONS } from "@/constants/routine";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CaregiverDashboardScreen() {
  const router = useRouter();

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-blue-600">
      <View className="pt-12 pb-5 px-5 shadow-sm">
        <Text className="text-2xl font-bold text-white">Routine Management</Text>
        <Text className="text-base text-blue-100 mt-1">
          Manage routines, schedules, and track completion status.
        </Text>
      </View>

      <View className="flex-1 bg-gray-50 rounded-t-2xl p-4">
        <Text className="text-sm font-bold text-gray-500 uppercase mb-3">
          Quick Actions
        </Text>
        
        <View className="flex-row gap-3 mb-6">
          <Pressable
            onPress={() => router.push("/routine/caregiver/routine/manage")}
            className="flex-1 bg-white p-3.5 rounded-2xl border border-gray-200 items-center justify-center gap-y-1.5 active:bg-gray-100 shadow-sm"
          >
            <Ionicons name="add-circle" size={35} color="#2563EB" />
            <Text className="font-bold text-gray-900 text-base text-center">
              New Routine
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/routine/caregiver/schedule/manage")}
            className="flex-1 bg-white p-3.5 rounded-2xl border border-gray-200 items-center justify-center gap-y-1.5 active:bg-gray-100 shadow-sm"
          >
            <Ionicons name="calendar" size={30} color="#059669" />
            <Text className="font-bold text-gray-900 text-base text-center">
              New Schedule
            </Text>
          </Pressable>
        </View>

        <Text className="text-sm font-bold text-gray-500 uppercase mb-3">
          Features
        </Text>

        <View className="gap-y-3.5 mb-8">
          {DASHBOARD_SECTIONS.map((section) => (
            <Pressable
              key={section.id}
              onPress={() => router.push(section.route)}
              className="bg-white p-4 rounded-2xl border border-gray-200 flex-row items-center justify-between active:bg-gray-50 shadow-sm"
            >
              <View className="flex-row items-center gap-x-4 flex-1 pr-2">
                <View
                  className="w-12 h-12 rounded-2xl items-center justify-center"
                  style={{ backgroundColor: section.bgColor }}
                >
                  <Ionicons name={section.icon} size={26} color={section.color} />
                </View>

                <View className="flex-1">
                  <View className="flex-row items-center gap-x-2 mb-0.5">
                    <Text className="text-base font-bold text-gray-900">
                      {section.title}
                    </Text>
                  </View>
                  <Text className="text-sm text-gray-500 font-medium" numberOfLines={1}>
                    {section.subtitle}
                  </Text>
                </View>
              </View>

              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
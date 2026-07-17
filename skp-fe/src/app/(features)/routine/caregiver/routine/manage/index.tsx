import { getConnectionQueryOpt } from "@/services/queryOptions/connectQueryOpt";
import {
  createRoutineMutationOpt,
  getRoutineCategoriesQueryOpt,
  updateRoutineMutationOpt,
} from "@/services/queryOptions/routineQueryOpt";
import { RoutineCategory } from "@/services/routine";
import { useAuthStore } from "@/stores/auth-store";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddOrEditRoutineScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<RoutineCategory | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const { data: connection, isLoading: isConnectionLoading } = useQuery({
    ...getConnectionQueryOpt(user?.id),
    enabled: Boolean(user?.id),
  });

  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    ...getRoutineCategoriesQueryOpt(),
  });

  const createRoutineOpt = createRoutineMutationOpt();
  const { mutate: createRoutine, isPending } = useMutation({
    ...createRoutineOpt,
    onSuccess: async (...args) => {
      await createRoutineOpt.onSuccess?.(...args);
      Alert.alert("Success", "Successfully saved routine.");
      router.back();
    },
    onError: (error: any) => {
      Alert.alert(
        "Create routine failed",
        error.response?.data?.message ?? "Something went wrong. Please try again."
      );
    },
  });

  const updateRoutineOpt = updateRoutineMutationOpt();
  const { mutate: updateRoutine, isPending: isPendingUpdate } = useMutation({
    ...updateRoutineOpt,
    onSuccess: async (...args) => {
      await updateRoutineOpt.onSuccess?.(...args);
      Alert.alert("Success", "Successfully updated routine.");
      router.back();
    },
    onError: (error: any) => {
      Alert.alert(
        "Update routine failed",
        error.response?.data?.message ?? "Something went wrong. Please try again."
      );
    },
  });

  const handleSaveRoutine = () => {
    console.log(connection)
    if (!title.trim() || !selectedCategory) return;

    if (!!!connection || connection.length == 0) {
      Alert.alert("Error", "No active connection or care recipient found.");
      return;
    }

    const payload = {
      care_recipient_id: connection[0].recipient_id,
      caregiver_id: user?.id,
      category_id: selectedCategory.id,
      title: title,
      detail: detail,
      is_active: isActive,
    };
    

    console.log("Saving Routine ", payload);
    if (!!id)
      createRoutine(payload);
    else
      updateRoutine(id, payload);
  };

  if (isCategoriesLoading || isConnectionLoading) {
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
          {isEditing ? "Update Routine" : "Add Routine"}
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
        <Text className="text-xs font-bold text-gray-500 uppercase mb-2">
          Routine Title
        </Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Daily Medication"
          placeholderTextColor="#9CA3AF"
          className="bg-white p-4 rounded-2xl border border-gray-200 text-gray-900 font-semibold mb-6 text-base"
        />

        <Text className="text-xs font-bold text-gray-500 uppercase mb-2">
          Category
        </Text>
        <Pressable
          onPress={() => setShowCategoryModal(true)}
          className="bg-white p-4 rounded-2xl border border-gray-200 flex-row items-center justify-between mb-6 active:bg-gray-100"
        >
          <Text className="text-base font-bold text-gray-900">
            {selectedCategory?.name ?? "Select Category"}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
        </Pressable>

        <Text className="text-xs font-bold text-gray-500 uppercase tracking mb-2">
          Instructions / Details
        </Text>
        <TextInput
          value={detail}
          onChangeText={setDetail}
          placeholder="Steps, side effects, or special notes..."
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={3}
          style={{ textAlignVertical: "top" }}
          className="bg-white p-4 rounded-2xl border border-gray-200 text-gray-900 font-medium text-base mb-6 min-h-[90px]"
        />

        <View className="bg-white p-4 rounded-2xl border border-gray-200 mb-8 gap-y-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="font-bold text-gray-900 text-base">Active Status</Text>
              <Text className="text-sm text-gray-500 mt-0.5">Toggle off to temporarily pause</Text>
            </View>
            <Switch
              value={isActive}
              onValueChange={setIsActive}
              trackColor={{ false: "#E5E7EB", true: "#93C5FD" }}
              thumbColor={isActive ? "#2563EB" : "#9CA3AF"}
            />
          </View>
        </View>
      </ScrollView>

      <Modal visible={showCategoryModal} transparent animationType="slide">
        <Pressable onPress={() => setShowCategoryModal(false)} className="flex-1 bg-black/40 justify-end">
          <Pressable className="bg-white rounded-t-[32px] p-6 pb-10 max-h-[70%]">
            <View className="w-12 h-1.5 bg-gray-300 rounded-full self-center mb-6" />
            <Text className="text-lg font-bold text-gray-900 mb-4">Select Category</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {categories?.map((cat) => {
                const isSelected = selectedCategory?.id === cat.id;
                return (
                  <Pressable
                    key={cat.id}
                    onPress={() => {
                      setSelectedCategory(cat);
                      setShowCategoryModal(false);
                    }}
                    className={`flex-row items-center justify-between p-4 mb-2.5 rounded-2xl border ${
                      isSelected ? "bg-blue-50/70 border-blue-600" : "bg-gray-50 border-gray-100"
                    }`}
                  >
                    <Text className={`font-bold text-base ${isSelected ? "text-blue-600" : "text-gray-900"}`}>
                      {cat.name}
                    </Text>
                    {isSelected && <Ionicons name="checkmark-circle" size={22} color="#2563EB" />}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      <View className="p-4 bg-white border-t border-gray-100">
        <Pressable
          onPress={handleSaveRoutine}
          disabled={!title.trim() || !selectedCategory || isPending || isPendingUpdate}
          className={`py-4 rounded-2xl items-center justify-center ${
            title.trim() && selectedCategory && !isPending ? "bg-blue-600 active:bg-blue-800" : "bg-gray-300"
          }`}
        >
          {isPending || isPendingUpdate ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-base">
              {isEditing ? "Update Routine" : "Save Routine"}
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

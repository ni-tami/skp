import { SearchBar } from "@/components/shared/SearchBar";
import { DUMMY_CATEGORIES, DUMMY_USER } from "@/constants/dummy";
import {
  CATEGORY_ICON_MAPPING,
  IconName,
} from "@/constants/routine";
import { RoutineCategory } from "@/services/routine";
import { User } from "@/services/user";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const getBgColor = (colorHex?: string) => `${colorHex ?? "#2563EB"}26`;

const getCategoryIconConfig = (categoryId?: number) => {
  if (!categoryId) return { icon: "pricetag-outline" as IconName, color: "#2563EB" };
  const mapped = CATEGORY_ICON_MAPPING[String(categoryId) as keyof typeof CATEGORY_ICON_MAPPING];
  return {
    icon: (mapped?.icon as IconName) ?? ("pricetag-outline" as IconName),
    color: mapped?.color ?? "#2563EB",
  };
};

export default function AddOrEditRoutineScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = Boolean(id);

  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<RoutineCategory[]>([]);
  const [carerecipients, setCarerecipients] = useState<User[]>([]);

  const [selectedRecipient, setSelectedRecipient] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showRecipientModal, setShowRecipientModal] = useState(false);

  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<RoutineCategory | null>(null);
  const [isActive, setIsActive] = useState(true);

  const [showCategoryModal, setShowCategoryModal] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 400));

        const mockCategories: RoutineCategory[] = DUMMY_CATEGORIES;

        const mockRecipients: User[] = DUMMY_USER;

        setCategories(mockCategories);
        setCarerecipients(mockRecipients);

        if (mockCategories.length > 0) setSelectedCategory(mockCategories[0]);
        if (mockRecipients.length > 0) setSelectedRecipient(mockRecipients[0]);
      } catch (err) {
        console.error("Error loading routine form:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [id]);

  const filteredRecipients = carerecipients.filter((r) =>
    r.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveRoutine = async () => {
    if (!title.trim() || !selectedCategory || !selectedRecipient) return;

    const routinePayload = {
      carerecipient_id: selectedRecipient.id,
      category_id: selectedCategory.id,
      title,
      detail,
      is_active: isActive,
    };

    console.log("Saving Routine:", routinePayload);
    router.back();
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#2563EB" />
      </SafeAreaView>
    );
  }

  const categoryConfig = getCategoryIconConfig(selectedCategory?.id);

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
          Care Recipient
        </Text>
        <Pressable
          onPress={() => setShowRecipientModal(true)}
          className="bg-white p-4 rounded-2xl border border-gray-200 flex-row items-center justify-between mb-6 active:bg-gray-100"
        >
          <View className="flex-row items-center gap-x-3">
            <View className="w-10 h-10 rounded-xl bg-blue-50 items-center justify-center">
              <Ionicons name="person" size={20} color="#2563EB" />
            </View>
            <View>
              <Text className="text-base font-bold text-gray-900">
                {selectedRecipient?.name ?? "Select Care Recipient"}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
        </Pressable>

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
          <View className="flex-row items-center gap-x-3">
            <View
              className="w-10 h-10 rounded-xl items-center justify-center"
              style={{ backgroundColor: getBgColor(categoryConfig.color) }}
            >
              <Ionicons name={categoryConfig.icon} size={20} color={categoryConfig.color} />
            </View>
            <View>
              <Text className="text-xs text-gray-400 font-medium">Selected Category</Text>
              <Text className="text-base font-bold text-gray-900">
                {selectedCategory?.name ?? "Select Category"}
              </Text>
            </View>
          </View>
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

      <Modal visible={showRecipientModal} transparent animationType="slide">
        <Pressable onPress={() => setShowRecipientModal(false)} className="flex-1 bg-black/40 justify-end">
          <Pressable className="bg-white rounded-t-[32px] p-6 pb-10 h-[80%]">
            <View className="w-12 h-1.5 bg-gray-300 rounded-full self-center mb-6" />
            <Text className="text-lg font-bold text-gray-900 mb-4">Select Care Recipient</Text>

            <View className="mb-4">
              <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search recipient name..."
                isDarkMode={false}
              />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {filteredRecipients.length === 0 ? (
                <View className="py-8 items-center">
                  <Text className="text-gray-400 font-semibold text-sm">No recipients found</Text>
                </View>
              ) : (
                filteredRecipients.map((recipient) => {
                  const isSelected = selectedRecipient?.id === recipient.id;
                  return (
                    <Pressable
                      key={recipient.id}
                      onPress={() => {
                        setSelectedRecipient(recipient);
                        setShowRecipientModal(false);
                        setSearchQuery("");
                      }}
                      className={`flex-row items-center justify-between p-4 mb-2.5 rounded-2xl border ${
                        isSelected ? "bg-blue-50 border-blue-600" : "bg-gray-50 border-gray-100"
                      } active:bg-gray-200`}
                    >
                      <View className="flex-row items-center gap-x-3">
                        <View className="w-10 h-10 rounded-xl bg-blue-100 items-center justify-center">
                          <Ionicons name="person" size={20} color="#2563EB" />
                        </View>
                        <View>
                          <Text className={`font-bold text-base ${isSelected ? "text-blue-600" : "text-gray-900"}`}>
                            {recipient.name}
                          </Text>
                        </View>
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

      <Modal visible={showCategoryModal} transparent animationType="slide">
        <Pressable onPress={() => setShowCategoryModal(false)} className="flex-1 bg-black/40 justify-end">
          <Pressable className="bg-white rounded-t-[32px] p-6 pb-10 max-h-[70%]">
            <View className="w-12 h-1.5 bg-gray-300 rounded-full self-center mb-6" />
            <Text className="text-lg font-bold text-gray-900 mb-4">Select Category</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {categories.map((cat) => {
                const isSelected = selectedCategory?.id === cat.id;
                const config = getCategoryIconConfig(cat.id);
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
                    <View className="flex-row items-center gap-x-3">
                      <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: getBgColor(config.color) }}>
                        <Ionicons name={config.icon} size={20} color={config.color} />
                      </View>
                      <Text className={`font-bold text-base ${isSelected ? "text-blue-600" : "text-gray-900"}`}>{cat.name}</Text>
                    </View>
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
          disabled={!title.trim() || !selectedCategory || !selectedRecipient}
          className={`py-4 rounded-2xl items-center justify-center ${
            title.trim() && selectedCategory && selectedRecipient ? "bg-blue-600 active:bg-blue-800" : "bg-gray-300"
          }`}
        >
          <Text className="text-white font-bold text-base">
            {isEditing ? "Update Routine" : "Save Routine"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
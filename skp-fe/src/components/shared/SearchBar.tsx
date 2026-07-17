import { Ionicons } from "@expo/vector-icons";
import React, { useRef } from "react";
import { Pressable, TextInput } from "react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  containerClassName?: string;
  isDarkMode?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = "Search...",
  onClear,
  containerClassName = "",
  isDarkMode = true,
}) => {
  const inputRef = useRef<TextInput>(null);

  const handleClear = () => {
    onChangeText("");
    onClear?.();
    inputRef.current?.focus();
  };

  const dynamicStyles = isDarkMode
    ? {
        container: "bg-white/10 border-white/20",
        iconColor: "#93C5FD",
        textColor: "text-white",
        placeholderColor: "#93C5FD",
      }
    : {
        container: "bg-gray-50 border-gray-200",
        iconColor: "#9CA3AF",
        textColor: "text-gray-900",
        placeholderColor: "#9CA3AF",
      };

  return (
    <Pressable
      onPress={() => inputRef.current?.focus()}
      className={`flex-row items-center p-4 rounded-2xl border ${dynamicStyles.container} ${containerClassName}`}
    >
      <Ionicons name="search" size={20} color={dynamicStyles.iconColor} />
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={dynamicStyles.placeholderColor}
        className={`flex-1 ml-2 font-medium text-base p-0 ${dynamicStyles.textColor}`}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <Pressable
          onPress={handleClear}
          hitSlop={8}
          className="active:opacity-60"
        >
          <Ionicons
            name="close-circle"
            size={20}
            color={dynamicStyles.iconColor}
          />
        </Pressable>
      )}
    </Pressable>
  );
};
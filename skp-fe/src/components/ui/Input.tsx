import { useState } from 'react';
import { Pressable, TextInput, View, type TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '@/lib/utils';
import StyledText from '@/components/ui/StyledText';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export default function Input({
  label,
  error,
  containerClassName,
  className,
  secureTextEntry,
  ...rest
}: Props) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View className={cn('gap-1.5', containerClassName)}>
      {label && (
        <StyledText size={14} className="font-semibold text-ink">
          {label}
        </StyledText>
      )}
      <View className="relative justify-center">
        <TextInput
          placeholderTextColor="#5B6472"
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          className={cn(
            'font-sans rounded-xl border px-4 py-3 text-[16px] text-ink',
            secureTextEntry && 'pr-11',
            error ? 'border-danger' : 'border-mist',
            className,
          )}
          {...rest}
        />
        {secureTextEntry && (
          <Pressable
            onPress={() => setIsPasswordVisible((prev) => !prev)}
            className="absolute right-3 p-1"
            hitSlop={8}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#5B6472"
            />
          </Pressable>
        )}
      </View>
      {error && (
        <StyledText size={12} className="text-danger">
          {error}
        </StyledText>
      )}
    </View>
  );
}

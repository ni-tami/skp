import { View, Text, Pressable } from 'react-native';
import { ReactNode } from 'react';
import { router } from 'expo-router';
import { cn } from '@/lib/utils';

interface Props {
  route?: string;
  children: ReactNode;
  block?: boolean;
  className?: string;
  type?: 'default' | 'danger';
  onPress?: () => void;
  disabled?: boolean;
}

const COLOR_MAP: Record<Props['type'] & string, string> = {
  default: 'bg-[#007FFF]',
  danger: 'bg-[#E92A2A]',
};

export default function Button({
  route,
  children,
  block,
  className,
  type = 'default',
  onPress,
  disabled,
}: Props) {
  return (
    <Pressable
      disabled={disabled}
      className={cn(
        block && 'w-full',
        COLOR_MAP[type],
        disabled && 'opacity-50',
        className,
      )}
      onPress={() => {
        onPress?.();
        if (route) {
          router.push(route as any);
        }
      }}
    >
      {children}
    </Pressable>
  );
}

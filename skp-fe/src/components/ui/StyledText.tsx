import { Text, type TextProps } from 'react-native';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Props extends TextProps {
  size?: number;
  type?: 'title' | 'text';
  className?: string;
  children: ReactNode;
}

const StyledText = ({ size, type = 'text', className, children, ...rest }: Props) => {
  return (
    <Text
      className={cn(
        type === 'title' ? 'font-sans-bold' : 'font-sans',
        className,
      )}
      style={[{ fontSize: size }, rest.style]}
      {...rest}
    >
      {children}
    </Text>
  );
};

export default StyledText;

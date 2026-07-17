import { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, Alert, Pressable } from 'react-native';
import { Link, router, Stack } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import StyledText from '@/components/ui/StyledText';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { signUpMutationOpt } from '@/services/queryOptions/authQueryOpt';

const ROLES = [
  { label: 'Caregiver', value: 'caregiver' },
  { label: 'Recipient', value: 'recipient' },
] as const;

export default function SignUpScreen() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<(typeof ROLES)[number]['value']>('caregiver');

  const { mutate: signUp, isPending } = useMutation({
    ...signUpMutationOpt(),
    onSuccess: () => {
      router.replace('/login')
    },
    onError: (error) => {
      Alert.alert(
        'Sign up failed',
        error.response?.data?.message ?? 'Please check your details and try again.',
      );
    },
  });

  const canSubmit = !!displayName && !!email && !!password && !isPending;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-brand"
    >
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 justify-center px-6">
        <View className="items-center mb-10">
          <StyledText size={28} type="title" className="text-white">
            DemensiApp
          </StyledText>
          <StyledText size={14} className="text-white/80 mt-1">
            Create an account to get started
          </StyledText>
        </View>

        <View className="bg-white rounded-3xl p-6 gap-4 shadow">
          <Input
            label="Full name"
            placeholder="Jane Doe"
            value={displayName}
            onChangeText={setDisplayName}
          />
          <Input
            label="Email"
            placeholder="you@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <Input
            label="Password"
            placeholder="••••••••"
            placeholderTextColor="#9AA4B2"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <View className="gap-1.5">
            <StyledText size={14} className="font-semibold text-ink">
              I am a
            </StyledText>
            <View className="flex-row gap-2">
              {ROLES.map((option) => (
                <Pressable
                  key={option.value}
                  onPress={() => setRole(option.value)}
                  className={cn(
                    'flex-1 items-center rounded-xl border py-3',
                    role === option.value
                      ? 'bg-brand border-brand'
                      : 'border-mist',
                  )}
                >
                  <StyledText
                    size={14}
                    className={cn(
                      'font-semibold',
                      role === option.value ? 'text-white' : 'text-ink',
                    )}
                  >
                    {option.label}
                  </StyledText>
                </Pressable>
              ))}
            </View>
          </View>

          <Button
            block
            disabled={!canSubmit}
            onPress={() =>
              signUp({ email, password, role, display_name: displayName })
            }
            className="rounded-xl p-4 items-center mt-2"
          >
            <StyledText size={16} type="title" className="text-white">
              {isPending ? 'Creating account...' : 'Sign up'}
            </StyledText>
          </Button>
        </View>

        <View className="flex-row justify-center mt-6 gap-1">
          <StyledText size={14} className="text-white/80">
            Already have an account?
          </StyledText>
          <Link href="/(auth)/login">
            <StyledText size={14} className="text-white font-semibold underline">
              Log in
            </StyledText>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

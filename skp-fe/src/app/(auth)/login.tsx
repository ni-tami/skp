import { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Link, router, Stack } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import StyledText from '@/components/ui/StyledText';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { loginMutationOpt } from '@/services/queryOptions/authQueryOpt';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginOpt = loginMutationOpt();
  const { mutate: login, isPending } = useMutation({
    ...loginOpt,
    onSuccess: async (...args) => {
      await loginOpt.onSuccess?.(...args);
      router.replace('/');
    },
    onError: (error) => {
      Alert.alert(
        'Login failed',
        error.response?.data?.message ?? 'Please check your email and password.',
      );
    },
  });

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
            Log in to keep track of your loved ones
          </StyledText>
        </View>

        <View className="bg-white rounded-3xl p-6 gap-4 shadow">
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

          <Button
            block
            disabled={!email || !password || isPending}
            onPress={() => login({ email, password })}
            className="rounded-xl p-4 items-center mt-2"
          >
            <StyledText size={16} type="title" className="text-white">
              {isPending ? 'Logging in...' : 'Log in'}
            </StyledText>
          </Button>
        </View>

        <View className="flex-row justify-center mt-6 gap-1">
          <StyledText size={14} className="text-white/80">
            Don&apos;t have an account?
          </StyledText>
          <Link href="/(auth)/signup">
            <StyledText size={14} className="text-white font-semibold underline">
              Sign up
            </StyledText>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

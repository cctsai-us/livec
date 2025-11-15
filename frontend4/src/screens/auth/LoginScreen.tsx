import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';

// Detect market based on locale (simplified for now)
const getMarket = () => {
  // This would use react-native-localize in production
  return 'taiwan'; // or 'thailand'
};

export default function LoginScreen({
  onLogin,
  onRegister,
}: {
  onLogin: () => void;
  onRegister: () => void;
}) {
  const [inputMode, setInputMode] = useState<'phone' | 'email'>('phone');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const market = getMarket();

  // Social login providers based on market
  const socialProviders =
    market === 'taiwan'
      ? [
          { id: 'line', name: 'LINE', icon: '💬', color: '#00B900' },
          { id: 'facebook', name: 'Facebook', icon: 'f', color: '#1877F2' },
          { id: 'google', name: 'Google', icon: 'G', color: '#DB4437' },
          { id: 'apple', name: 'Apple', icon: '', color: '#000' },
        ]
      : [
          { id: 'facebook', name: 'Facebook', icon: 'f', color: '#1877F2' },
          { id: 'line', name: 'LINE', icon: '💬', color: '#00B900' },
          { id: 'google', name: 'Google', icon: 'G', color: '#DB4437' },
          { id: 'apple', name: 'Apple', icon: '', color: '#000' },
        ];

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    // In production, this would trigger OAuth flow
    onLogin();
  };

  const handleLogin = () => {
    console.log('Login with', inputMode, phoneOrEmail);
    // In production, validate and call API
    onLogin();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>🛍️</Text>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Login to continue shopping</Text>
      </View>

      {/* Social Login Buttons */}
      <View style={styles.socialSection}>
        {socialProviders.map((provider) => (
          <TouchableOpacity
            key={provider.id}
            style={[styles.socialButton, { backgroundColor: provider.color }]}
            onPress={() => handleSocialLogin(provider.id)}
          >
            <Text style={styles.socialIcon}>{provider.icon}</Text>
            <Text style={styles.socialButtonText}>
              Continue with {provider.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Divider */}
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Input Mode Toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            inputMode === 'phone' && styles.toggleButtonActive,
          ]}
          onPress={() => setInputMode('phone')}
        >
          <Text
            style={[
              styles.toggleButtonText,
              inputMode === 'phone' && styles.toggleButtonTextActive,
            ]}
          >
            Phone
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            inputMode === 'email' && styles.toggleButtonActive,
          ]}
          onPress={() => setInputMode('email')}
        >
          <Text
            style={[
              styles.toggleButtonText,
              inputMode === 'email' && styles.toggleButtonTextActive,
            ]}
          >
            Email
          </Text>
        </TouchableOpacity>
      </View>

      {/* Input Fields */}
      <View style={styles.formSection}>
        <TextInput
          style={styles.input}
          placeholder={
            inputMode === 'phone' ? 'Phone number' : 'Email address'
          }
          value={phoneOrEmail}
          onChangeText={setPhoneOrEmail}
          keyboardType={inputMode === 'phone' ? 'phone-pad' : 'email-address'}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>

      {/* Register Link */}
      <View style={styles.registerSection}>
        <Text style={styles.registerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={onRegister}>
          <Text style={styles.registerLink}>Register</Text>
        </TouchableOpacity>
      </View>

      {/* Terms */}
      <Text style={styles.terms}>
        By continuing, you agree to our{' '}
        <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
        <Text style={styles.termsLink}>Privacy Policy</Text>
      </Text>

      {/* Guest Mode */}
      <TouchableOpacity style={styles.guestButton} onPress={onLogin}>
        <Text style={styles.guestButtonText}>Continue as Guest</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 32,
  },
  logo: {
    fontSize: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  socialSection: {
    gap: 12,
    marginBottom: 24,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 8,
    gap: 12,
  },
  socialIcon: {
    fontSize: 20,
    color: '#fff',
  },
  socialButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#999',
    fontSize: 14,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 4,
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#fff',
  },
  toggleButtonText: {
    fontSize: 15,
    color: '#666',
  },
  toggleButtonTextActive: {
    color: '#6C5CE7',
    fontWeight: 'bold',
  },
  formSection: {
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    color: '#6C5CE7',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#6C5CE7',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  registerText: {
    fontSize: 15,
    color: '#666',
  },
  registerLink: {
    fontSize: 15,
    color: '#6C5CE7',
    fontWeight: 'bold',
  },
  terms: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 18,
  },
  termsLink: {
    color: '#6C5CE7',
  },
  guestButton: {
    marginTop: 16,
    padding: 14,
    alignItems: 'center',
  },
  guestButtonText: {
    color: '#666',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
});

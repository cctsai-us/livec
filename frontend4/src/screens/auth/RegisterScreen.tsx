import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';

export default function RegisterScreen({
  onRegister,
  onLogin,
  onVerifyPhone,
}: {
  onRegister: () => void;
  onLogin: () => void;
  onVerifyPhone: (phone: string) => void;
}) {
  const [inputMode, setInputMode] = useState<'phone' | 'email'>('phone');
  const [name, setName] = useState('');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleRegister = () => {
    if (!name || !phoneOrEmail || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (!agreeToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }

    // If phone mode, go to verification
    if (inputMode === 'phone') {
      onVerifyPhone(phoneOrEmail);
    } else {
      // Email registration goes straight through
      onRegister();
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>🛍️</Text>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join Yoii LiveComm today</Text>
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

      {/* Form */}
      <View style={styles.formSection}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

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

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        {/* Terms Checkbox */}
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setAgreeToTerms(!agreeToTerms)}
        >
          <View style={styles.checkbox}>
            {agreeToTerms && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>
            I agree to the{' '}
            <Text style={styles.link}>Terms of Service</Text> and{' '}
            <Text style={styles.link}>Privacy Policy</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.registerButton,
            !agreeToTerms && styles.registerButtonDisabled,
          ]}
          onPress={handleRegister}
          disabled={!agreeToTerms}
        >
          <Text style={styles.registerButtonText}>
            {inputMode === 'phone' ? 'Continue' : 'Register'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Login Link */}
      <View style={styles.loginSection}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <TouchableOpacity onPress={onLogin}>
          <Text style={styles.loginLink}>Login</Text>
        </TouchableOpacity>
      </View>

      {/* Password Requirements */}
      <View style={styles.requirements}>
        <Text style={styles.requirementsTitle}>Password must contain:</Text>
        <Text style={styles.requirementText}>• At least 8 characters</Text>
        <Text style={styles.requirementText}>• One uppercase letter</Text>
        <Text style={styles.requirementText}>• One number</Text>
      </View>
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#6C5CE7',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#6C5CE7',
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  link: {
    color: '#6C5CE7',
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: '#6C5CE7',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  registerButtonDisabled: {
    backgroundColor: '#ccc',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    fontSize: 15,
    color: '#666',
  },
  loginLink: {
    fontSize: 15,
    color: '#6C5CE7',
    fontWeight: 'bold',
  },
  requirements: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  requirementText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
});

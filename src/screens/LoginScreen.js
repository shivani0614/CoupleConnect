import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { COLORS, SPACING, RADIUS, SHADOW } from '../theme';
import { useAuth } from '../context/AuthContext';
import { AppInput, PrimaryBtn, GhostBtn } from '../components/UI';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { users, loginWithId, loginWithEmail, register } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleQuickLogin = async (id) => {
    setError('');
    const success = await loginWithId(id);
    if (!success) {
      setError('Unable to sign in. Please try again.');
    }
  };

  const handleLogin = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      setError('Enter both email and password.');
      return;
    }

    const success = await loginWithEmail(trimmedEmail, password);
    if (!success) {
      setError('Email or password is incorrect.');
    }
  };

  const handleRegister = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail || !password || !confirmPassword) {
      setError('Enter name, email and password.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const success = await register(trimmedName, trimmedEmail, password);
    if (!success) {
      setError('Unable to create account. Email may already be in use.');
    }
  };

  const toggleMode = () => {
    setError('');
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setIsRegistering((current) => !current);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.root, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}
    >
      <LinearGradient colors={COLORS.headerGrad} style={styles.hero}>
        <Text style={styles.title}>{isRegistering ? 'Create account' : 'CoupleConnect'}</Text>
        <Text style={styles.subtitle}>{isRegistering ? 'Sign up and start your love story' : 'Login to continue your love story'}</Text>
      </LinearGradient>

      <View style={styles.body}>
        {!isRegistering ? (
          <>
            <Text style={styles.prompt}>Quick sign-in</Text>
            {users.map((user) => (
              <TouchableOpacity
                key={user.id}
                style={styles.userBtn}
                activeOpacity={0.8}
                onPress={() => handleQuickLogin(user.id)}
              >
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userHint}>{user.email}</Text>
              </TouchableOpacity>
            ))}

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or sign in with email</Text>
              <View style={styles.dividerLine} />
            </View>
          </>
        ) : (
          <Text style={styles.prompt}>Create a new account using your email</Text>
        )}

        {isRegistering && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Name</Text>
            <AppInput
              value={name}
              onChangeText={setName}
              placeholder="Your name"
            />
          </View>
        )}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <AppInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="alex@example.com"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Password</Text>
          <AppInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Enter password"
          />
        </View>

        {isRegistering && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Confirm password</Text>
            <AppInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholder="Repeat password"
            />
          </View>
        )}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <PrimaryBtn
          title={isRegistering ? 'Create account' : 'Sign in'}
          onPress={isRegistering ? handleRegister : handleLogin}
          style={styles.signInBtn}
        />

        {!isRegistering ? (
          <GhostBtn
            title="Need a hint?"
            onPress={() => setError('Use alex@example.com or jordan@example.com with password love123')}
            style={styles.hintBtn}
          />
        ) : null}

        <View style={styles.switchRow}>
          <Text style={styles.switchText}>{isRegistering ? 'Already have an account?' : "Don't have an account?"}</Text>
          <TouchableOpacity onPress={toggleMode}>
            <Text style={styles.switchLink}>{isRegistering ? 'Sign in' : 'Create account'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  hero: {
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 260,
  },
  body: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
  },
  prompt: {
    fontSize: 14,
    color: COLORS.subtle,
    marginBottom: SPACING.md,
  },
  userBtn: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.ink,
  },
  userHint: {
    fontSize: 12,
    color: COLORS.subtle,
    marginTop: 4,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.lg,
    gap: SPACING.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    color: COLORS.subtle,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  formGroup: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 12,
    color: COLORS.muted,
    marginBottom: SPACING.xs,
  },
  errorText: {
    color: '#B00020',
    marginBottom: SPACING.md,
    fontSize: 13,
  },
  signInBtn: {
    marginTop: SPACING.sm,
  },
  hintBtn: {
    marginTop: SPACING.md,
  },
  switchRow: {
    marginTop: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.xs,
    alignItems: 'center',
  },
  switchText: {
    color: COLORS.subtle,
    fontSize: 13,
  },
  switchLink: {
    color: COLORS.rose,
    fontSize: 13,
    fontWeight: '600',
  },
});

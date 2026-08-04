import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { ScreenHeader } from '../components/ui/ScreenHeader';
import { OtpInput } from '../components/ui/OtpInput';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { twoFactorService } from '../services/twoFactorService';
import { showAppModal } from '../store/modalStore';

type PendingAction = null | 'disable' | 'regenerate';

export default function TwoFactorScreen() {
  const router = useRouter();
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [enabled, setEnabled] = useState(false);

  // Enrollment flow
  const [setupData, setSetupData] = useState<{ manual_entry_key: string; qr_code_url: string } | null>(null);
  const [setupCode, setSetupCode] = useState('');
  const [setupCodeError, setSetupCodeError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);

  // Disable / regenerate flow (both need a fresh code)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [actionCode, setActionCode] = useState('');
  const [actionCodeError, setActionCodeError] = useState('');

  const loadStatus = async () => {
    setLoadingStatus(true);
    try {
      const envelope = await twoFactorService.getStatus();
      setEnabled(!!(envelope.data ?? envelope)?.enabled);
    } catch {
      // keep last-known state
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const startSetup = async () => {
    setSubmitting(true);
    try {
      const envelope = await twoFactorService.initiateSetup();
      setSetupData(envelope.data ?? envelope);
    } catch (e: any) {
      showAppModal({
        variant: 'error',
        title: 'Could not start setup',
        message: e.response?.data?.message || 'Could not start 2FA setup.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const confirmSetup = async () => {
    if (setupCode.length !== 6) return;
    setSubmitting(true);
    try {
      const envelope = await twoFactorService.confirmSetup(setupCode);
      const data = envelope.data ?? envelope;
      setRecoveryCodes(data.recovery_codes || []);
      setEnabled(true);
      setSetupData(null);
      setSetupCode('');
    } catch (e: any) {
      setSetupCodeError(e.response?.data?.message || 'That code did not match. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const submitPendingAction = async () => {
    if (actionCode.length !== 6 || !pendingAction) return;
    setSubmitting(true);
    try {
      if (pendingAction === 'disable') {
        await twoFactorService.disable(actionCode);
        setEnabled(false);
        showAppModal({ variant: 'success', title: 'Two-factor authentication disabled' });
      } else {
        const envelope = await twoFactorService.regenerateRecoveryCodes(actionCode);
        const data = envelope.data ?? envelope;
        setRecoveryCodes(data.recovery_codes || []);
      }
      setPendingAction(null);
      setActionCode('');
    } catch (e: any) {
      setActionCodeError(e.response?.data?.message || 'That code did not match. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-background dark:bg-backgroundDark">
      <ScreenHeader title="Two-Factor Authentication" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 }}>
        {loadingStatus ? (
          <ActivityIndicator className="mt-8" />
        ) : recoveryCodes ? (
          <View>
            <Text className="text-subheading font-serif-bold text-textOnLight dark:text-textOnDark mb-2">
              Save your recovery codes
            </Text>
            <Text className="text-body text-textSecondaryLight dark:text-textSecondaryDark mb-4 leading-6">
              Store these somewhere safe. Each code can be used once if you lose access to your
              authenticator app. They won't be shown again.
            </Text>
            <View className="bg-surfaceGray dark:bg-surfaceGrayDark rounded-card p-4 mb-6">
              {recoveryCodes.map((code) => (
                <Text
                  key={code}
                  className="text-body font-serif-semibold text-textOnLight dark:text-textOnDark mb-1"
                  style={{ fontVariant: ['tabular-nums'] }}>
                  {code}
                </Text>
              ))}
            </View>
            <PrimaryButton title="Done" onPress={() => setRecoveryCodes(null)} />
          </View>
        ) : setupData ? (
          <View>
            <Text className="text-subheading font-serif-bold text-textOnLight dark:text-textOnDark mb-2">
              Scan or enter manually
            </Text>
            <Text className="text-body text-textSecondaryLight dark:text-textSecondaryDark mb-4 leading-6">
              Add this key to your authenticator app (Google Authenticator, Authy, 1Password…), then
              enter the 6-digit code it generates.
            </Text>
            <View className="bg-surfaceGray dark:bg-surfaceGrayDark rounded-card p-4 mb-6">
              <Text className="text-caption text-textSecondaryLight dark:text-textSecondaryDark mb-1">
                Manual entry key
              </Text>
              <Text
                className="text-body font-serif-bold text-textOnLight dark:text-textOnDark"
                selectable
                style={{ fontVariant: ['tabular-nums'] }}>
                {setupData.manual_entry_key}
              </Text>
            </View>
            <OtpInput
              value={setupCode}
              onChangeText={(val) => { setSetupCode(val); setSetupCodeError(''); }}
              error={setupCodeError}
            />
            <PrimaryButton
              title="Confirm & enable"
              onPress={confirmSetup}
              disabled={setupCode.length !== 6}
              loading={submitting}
            />
          </View>
        ) : pendingAction ? (
          <View>
            <Text className="text-subheading font-serif-bold text-textOnLight dark:text-textOnDark mb-2">
              {pendingAction === 'disable' ? 'Confirm disabling 2FA' : 'Confirm regenerating codes'}
            </Text>
            <Text className="text-body text-textSecondaryLight dark:text-textSecondaryDark mb-4 leading-6">
              Enter the current 6-digit code from your authenticator app.
            </Text>
            <OtpInput
              value={actionCode}
              onChangeText={(val) => { setActionCode(val); setActionCodeError(''); }}
              error={actionCodeError}
            />
            <PrimaryButton
              title="Confirm"
              onPress={submitPendingAction}
              disabled={actionCode.length !== 6}
              loading={submitting}
            />
          </View>
        ) : enabled ? (
          <View>
            <View className="flex-row items-center bg-success/10 rounded-card p-4 mb-6">
              <Text className="text-body font-serif-semibold text-success">Two-factor authentication is enabled</Text>
            </View>
            <PrimaryButton
              title="Regenerate recovery codes"
              onPress={() => { setActionCodeError(''); setPendingAction('regenerate'); }}
              className="mb-3"
            />
            <PrimaryButton
              title="Disable 2FA"
              onPress={() => { setActionCodeError(''); setPendingAction('disable'); }}
              className="bg-error"
            />
          </View>
        ) : (
          <View>
            <Text className="text-body text-textSecondaryLight dark:text-textSecondaryDark mb-6 leading-6">
              Two-factor authentication adds an extra step at sign-in using an authenticator app on
              your phone.
            </Text>
            <PrimaryButton title="Enable 2FA" onPress={startSetup} loading={submitting} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

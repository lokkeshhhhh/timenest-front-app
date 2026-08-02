import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AuthService } from '../../services/auth';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { ImageSelectCard } from '../../components/ui/ImageSelectCard';
import { AuthHeader } from '../../components/brand/AuthHeader';
import { getAccountTypeVisual } from '../../utils/accountType';

export default function AccountTypeScreen() {
  const router = useRouter();
  const [types, setTypes] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      const res = await AuthService.fetchAccountTypes();
      setTypes(res.data || []);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to load account types');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (selectedType) {
      router.push({ pathname: '/(auth)/register', params: { accountType: selectedType } });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40, flexGrow: 1 }} bounces={false}>
        <AuthHeader />

        <Image
          source={require('../../assets/images/auth/account-type.png')}
          resizeMode="contain"
          style={{ width: 168, height: 168 * (900 / 649), alignSelf: 'center', marginBottom: 8 }}
        />

        <Text className="text-textOnLight text-heading font-serif-bold mt-2">How will you use Arcana?</Text>
        <Text className="text-textSecondaryLight text-body mt-2 mb-6 leading-6">
          Select the profile that best fits your needs.
        </Text>

        {loading ? (
          <Text className="text-center text-textMuted mt-4">Loading options...</Text>
        ) : (
          types.map((type) => {
            const visual = getAccountTypeVisual(type.value);
            return (
              <ImageSelectCard
                key={type.value}
                image={visual.photo}
                title={type.label}
                description={type.description}
                badges={[visual.badge]}
                selected={selectedType === type.value}
                onSelect={() => setSelectedType(type.value)}
              />
            );
          })
        )}

        <PrimaryButton
          title="Continue"
          disabled={!selectedType || loading}
          onPress={handleContinue}
          className="mt-4"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

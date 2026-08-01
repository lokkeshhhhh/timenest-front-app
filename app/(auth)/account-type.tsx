import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthService } from '../../services/auth';
import { AuthCard } from '../../components/ui/AuthCard';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { SelectableCard } from '../../components/ui/SelectableCard';

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
    <View className="flex-1 bg-background pt-12">
      <View className="px-8 pb-6">
        <Text className="text-textOnDark text-heading font-serif-bold mb-2">Join Arcana</Text>
        <Text className="text-textSecondaryDark text-body">Select how you want to use the platform.</Text>
      </View>
      <AuthCard className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false}>
          {loading ? (
            <Text className="text-center text-textMuted mt-4">Loading options...</Text>
          ) : (
            types.map((type) => (
              <SelectableCard
                key={type.value}
                title={type.label}
                description={type.description}
                selected={selectedType === type.value}
                onSelect={() => setSelectedType(type.value)}
              />
            ))
          )}
        </ScrollView>
        <PrimaryButton
          title="Continue"
          disabled={!selectedType || loading}
          onPress={handleContinue}
          className="mt-4"
        />
      </AuthCard>
    </View>
  );
}

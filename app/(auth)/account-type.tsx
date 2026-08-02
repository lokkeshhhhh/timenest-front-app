import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthService } from '../../services/auth';
import { AuthCard } from '../../components/ui/AuthCard';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { SelectableCard } from '../../components/ui/SelectableCard';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ArcanaHeroBackground } from '../../components/brand/ArcanaHeroBackground';
import { StyleSheet } from 'react-native';

const getAccountIcon = (value: string, selected: boolean) => {
  const color = selected ? '#FFFFFF' : '#1A1A1A';
  if (value.includes('organization') || value.includes('business')) return <Feather name="briefcase" size={20} color={color} />;
  if (value.includes('team')) return <Feather name="users" size={20} color={color} />;
  return <Feather name="user" size={20} color={color} />;
};

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
    <View className="flex-1 bg-background">
      {/* Premium Purple Hero Header */}
      <View className="absolute top-0 left-0 right-0 h-[380px] rounded-b-[40px] overflow-hidden">
        <LinearGradient
          colors={['#3C3B75', '#4C49ED', '#5D58A6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        <View className="absolute top-[-50px] right-[-50px] opacity-20">
          <ArcanaHeroBackground size={400} />
        </View>
      </View>
      
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
        {/* Hero Header Text */}
        <View className="relative w-full min-h-[200px] justify-center px-8 pt-20 pb-4">
          <Text className="text-textOnDark text-heading font-serif-bold mt-4">How will you use Arcana?</Text>
          <Text className="text-textSecondaryDark text-body mt-2 leading-6 pr-4">
            Select the profile that best fits your needs.
          </Text>
        </View>

        {/* Form Area (Light) */}
        <View className="bg-surfaceLight rounded-card mx-4 px-6 py-10 shadow-lg shadow-black/5 mb-8 mt-2 flex-1">
          {loading ? (
            <Text className="text-center text-textMuted mt-4">Loading options...</Text>
          ) : (
            types.map((type) => (
              <SelectableCard
                key={type.value}
                title={type.label}
                description={type.description}
                icon={
                  <View className={`w-14 h-14 rounded-2xl items-center justify-center ${selectedType === type.value ? 'bg-primary' : 'bg-surfaceGray'}`}>
                    {getAccountIcon(type.value, selectedType === type.value)}
                  </View>
                }
                badges={(() => {
                  if (type.value.includes('organization') || type.value.includes('business')) return [{ label: 'Enterprise', color: 'primary' }];
                  if (type.value.includes('team')) return [{ label: 'Team', color: 'success' }];
                  return [{ label: 'Individual', color: 'gray' }];
                })()}
                selected={selectedType === type.value}
                onSelect={() => setSelectedType(type.value)}
              />
            ))
          )}
          
          <PrimaryButton
            title="Continue"
            disabled={!selectedType || loading}
            onPress={handleContinue}
            className="mt-4"
          />
        </View>
      </ScrollView>
    </View>
  );
}

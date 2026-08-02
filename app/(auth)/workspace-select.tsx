import React, { useEffect, useState } from 'react';
import { View, Text, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthService } from '../../services/auth';
import { AuthCard } from '../../components/ui/AuthCard';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { SelectableCard } from '../../components/ui/SelectableCard';
import { useAuthStore } from '../../store/authStore';
import { useOrgStore } from '../../store/orgStore';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ArcanaHeroBackground } from '../../components/brand/ArcanaHeroBackground';
import { StyleSheet } from 'react-native';
import { resolveAvatarUrl } from '../../utils/avatar';

export default function WorkspaceSelectScreen() {
  const router = useRouter();
  
  const { tempToken, tempWorkspaces, setAuth, clearTempAuth } = useAuthStore();
  const setActiveOrg = useOrgStore(state => state.setActiveOrg);
  
  const workspaces = tempWorkspaces || [];
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);



  const handleSelect = async () => {
    if (!selectedWorkspace || !tempToken) return;
    
    setSubmitting(true);
    try {
      const res = await AuthService.selectOrganization(tempToken, selectedWorkspace);
      const data = res.data || res;
      // Success, token issued
      setAuth(data.access_token, data.user);
      setActiveOrg(data.organization);
      clearTempAuth();
      router.replace('/(tabs)/');
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || 'Failed to select organization');
    } finally {
      setSubmitting(false);
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
          <Text className="text-textOnDark text-heading font-serif-bold mt-4">Select Workspace</Text>
          <Text className="text-textSecondaryDark text-body mt-2 leading-6 pr-4">
            Choose the organization or team you want to log into.
          </Text>
        </View>

        {/* Form Area (Light) */}
        <View className="bg-surfaceLight rounded-card mx-4 px-6 py-10 shadow-lg shadow-black/5 mb-8 mt-2 flex-1">
          <Text className="text-label font-serif-semibold text-textSecondaryLight uppercase mb-4">
            {workspaces.length} {workspaces.length === 1 ? 'Workspace' : 'Workspaces'}
          </Text>

          {workspaces.map((org) => {
            const displayName = org.trading_name || org.legal_name;
            const badges = [{ label: org.role || 'Member', color: 'primary' as const }];
            if (org.type_label) {
              badges.push({ label: org.type_label, color: 'gray' as const });
            }

            return (
              <SelectableCard
                key={org.organization_uuid}
                title={displayName}
                subtitle={org.trading_name && org.trading_name !== org.legal_name ? org.legal_name : undefined}
                avatarUrl={resolveAvatarUrl(displayName, org.logo_url)}
                avatarShape="square"
                badges={badges}
                selected={selectedWorkspace === org.organization_uuid}
                onSelect={() => setSelectedWorkspace(org.organization_uuid)}
              />
            );
          })}

          <PrimaryButton
            title="Continue"
            disabled={!selectedWorkspace || submitting}
            loading={submitting}
            onPress={handleSelect}
            className="mt-4"
          />
        </View>
      </ScrollView>
    </View>
  );
}

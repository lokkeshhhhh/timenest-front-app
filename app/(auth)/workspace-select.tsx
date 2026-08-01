import React, { useEffect, useState } from 'react';
import { View, Text, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthService } from '../../services/auth';
import { AuthCard } from '../../components/ui/AuthCard';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { SelectableCard } from '../../components/ui/SelectableCard';
import { useAuthStore } from '../../store/authStore';
import { useOrgStore } from '../../store/orgStore';

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
    <View className="flex-1 bg-background pt-12">
      <View className="px-8 pb-6">
        <Text className="text-textOnDark text-heading font-serif-bold mb-2">Select Workspace</Text>
        <Text className="text-textSecondaryDark text-body">Choose the organization you want to log into.</Text>
      </View>
      <AuthCard className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false}>
          {workspaces.map((org) => (
            <SelectableCard
              key={org.organization_uuid}
              title={org.legal_name}
              description={org.role}
              selected={selectedWorkspace === org.organization_uuid}
              onSelect={() => setSelectedWorkspace(org.organization_uuid)}
            />
          ))}
        </ScrollView>
        <PrimaryButton
          title="Continue"
          disabled={!selectedWorkspace || submitting}
          loading={submitting}
          onPress={handleSelect}
          className="mt-4"
        />
      </AuthCard>
    </View>
  );
}

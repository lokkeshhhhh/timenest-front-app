import React, { useEffect, useState } from 'react';
import { View, Text, Alert, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AuthService } from '../../services/auth';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { ImageSelectCard } from '../../components/ui/ImageSelectCard';
import { AuthHeader } from '../../components/brand/AuthHeader';
import { useAuthStore } from '../../store/authStore';
import { applySessionData } from '../../utils/session';
import { resolveAvatarUrl } from '../../utils/avatar';

// Rotated across org cards so consecutive cards don't show the identical photo.
const WORKSPACE_PHOTOS = [
  require('../../assets/images/photos/workspace.jpg'),
  require('../../assets/images/photos/team.jpg'),
  require('../../assets/images/photos/organization.jpg'),
];

export default function WorkspaceSelectScreen() {
  const router = useRouter();
  
  const { tempToken, tempWorkspaces, clearTempAuth } = useAuthStore();

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
      applySessionData(data);
      clearTempAuth();
      router.replace('/(tabs)/');
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || 'Failed to select organization');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-backgroundDark">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40, flexGrow: 1 }} bounces={false}>
        <AuthHeader />

        <Image
          source={require('../../assets/images/auth/workspace-select-2.png')}
          resizeMode="contain"
          style={{ width: 168, height: 168 * (824 / 900), alignSelf: 'center', marginBottom: 8 }}
        />

        <Text className="text-textOnLight dark:text-textOnDark text-heading font-serif-bold mt-2">Select workspace</Text>
        <Text className="text-textSecondaryLight dark:text-textSecondaryDark text-body mt-2 mb-6 leading-6">
          Choose the organization or team you want to log into.
        </Text>

        <Text className="text-label font-serif-semibold text-textSecondaryLight dark:text-textSecondaryDark uppercase mb-4">
          {workspaces.length} {workspaces.length === 1 ? 'Workspace' : 'Workspaces'}
        </Text>

        {workspaces.map((org, index) => {
          const displayName = org.trading_name || org.legal_name;
          const badges = [org.role || 'Member'];
          if (org.type_label) badges.push(org.type_label);

          return (
            <ImageSelectCard
              key={org.organization_uuid}
              image={WORKSPACE_PHOTOS[index % WORKSPACE_PHOTOS.length]}
              avatarUrl={resolveAvatarUrl(displayName, org.logo_url)}
              title={displayName}
              description={org.trading_name && org.trading_name !== org.legal_name ? org.legal_name : undefined}
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
      </ScrollView>
    </SafeAreaView>
  );
}

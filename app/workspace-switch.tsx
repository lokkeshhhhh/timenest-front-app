import React, { useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { ScreenHeader } from '../components/ui/ScreenHeader';
import { SelectableCard, CardBadge } from '../components/ui/SelectableCard';
import { useOrgStore } from '../store/orgStore';
import { AuthService } from '../services/auth';
import { applySessionData } from '../utils/session';
import { resolveAvatarUrl } from '../utils/avatar';
import { showAppModal } from '../store/modalStore';

export default function WorkspaceSwitchScreen() {
  const router = useRouter();
  const workspaces = useOrgStore((state) => state.workspaces);
  const activeOrg = useOrgStore((state) => state.activeOrg);
  const [switchingTo, setSwitchingTo] = useState<string | null>(null);

  const handleSwitch = async (organizationUuid: string) => {
    if (organizationUuid === activeOrg?.uuid || switchingTo) return;
    setSwitchingTo(organizationUuid);
    try {
      const res = await AuthService.switchOrganization(organizationUuid);
      const data = res.data || res;
      applySessionData(data);
      router.back();
    } catch (e: any) {
      showAppModal({
        variant: 'error',
        title: 'Could not switch workspace',
        message: e.response?.data?.message || 'Failed to switch workspace.',
      });
    } finally {
      setSwitchingTo(null);
    }
  };

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-background dark:bg-backgroundDark">
      <ScreenHeader title="Switch Workspace" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 32 }}>
        <Text className="text-body text-textSecondaryLight dark:text-textSecondaryDark mb-5 leading-6">
          Choose the organization you want to switch into.
        </Text>
        {workspaces.map((org) => {
          const displayName = org.trading_name || org.legal_name || 'Untitled';
          const isActive = org.organization_uuid === activeOrg?.uuid;
          const badges: CardBadge[] = [{ label: org.role || 'Member', color: 'primary' }];
          if (org.type_label) badges.push({ label: org.type_label, color: 'gray' });
          if (isActive) badges.push({ label: 'Current', color: 'success' });

          return (
            <SelectableCard
              key={org.organization_uuid}
              title={displayName}
              avatarUrl={resolveAvatarUrl(displayName, org.logo_url)}
              badges={badges}
              selected={isActive}
              onSelect={() => handleSwitch(org.organization_uuid!)}
            />
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

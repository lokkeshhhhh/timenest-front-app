import React, { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { useAuthStore } from '../../store/authStore';
import { useOrgStore, useIsMultiOrg } from '../../store/orgStore';
import { usePermission, useAnyPermission } from '../../store/permissionStore';
import { PERMISSIONS } from '../../constants/permissions';
import { AuthService } from '../../services/auth';
import { clearSession } from '../../utils/session';
import { Avatar } from '../../components/ui/Avatar';
import { RoleBadge } from '../../components/ui/RoleBadge';
import { MenuRow } from '../../components/ui/MenuRow';

function SectionLabel({ children }: { children: string }) {
  return (
    <Text className="text-label font-serif-semibold text-textSecondaryLight dark:text-textSecondaryDark uppercase mb-2 mt-6">
      {children}
    </Text>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const activeOrg = useOrgStore((state) => state.activeOrg);
  const roleLabel = useOrgStore((state) => state.roleLabel);
  const isMultiOrg = useIsMultiOrg();
  const [signingOut, setSigningOut] = useState(false);

  const canViewAttendance = usePermission(PERMISSIONS.ATTENDANCE_VIEW);
  const canViewLeaves = usePermission(PERMISSIONS.LEAVES_VIEW);
  const canViewWorklog = usePermission(PERMISSIONS.WORKLOG_VIEW);
  const canSeeMembers = useAnyPermission([PERMISSIONS.INVITATIONS_VIEW, PERMISSIONS.USERS_MANAGE]);
  const canSeeOrgSettings = usePermission(PERMISSIONS.SETTINGS_MANAGE);
  const showOrgSection = canSeeMembers || canSeeOrgSettings;
  const showModulesSection = canViewAttendance || canViewLeaves || canViewWorklog;

  const orgName = activeOrg?.trading_name || activeOrg?.legal_name;

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          setSigningOut(true);
          try {
            await AuthService.logout();
          } catch {
            // best-effort — clear the local session regardless of server outcome
          } finally {
            clearSession();
            router.replace('/(auth)/login');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background dark:bg-backgroundDark">
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <Text className="text-heading font-serif-bold text-textOnLight dark:text-textOnDark mt-4 mb-6">
          Profile
        </Text>

        {/* Identity card */}
        <View className="bg-surfaceLight dark:bg-white/5 rounded-card p-5 border border-border dark:border-white/10 items-center mb-2">
          <Avatar name={user?.name || 'User'} url={user?.avatar_url} size={72} />
          <Text className="text-subheading font-serif-bold text-textOnLight dark:text-textOnDark mt-3">
            {user?.name}
          </Text>
          <Text className="text-label text-textSecondaryLight dark:text-textSecondaryDark mb-3">
            {user?.email}
          </Text>
          {roleLabel ? <RoleBadge label={roleLabel} /> : null}
          {orgName ? (
            <Text className="text-caption text-textSecondaryLight dark:text-textSecondaryDark mt-3">
              {orgName}
            </Text>
          ) : null}
        </View>

        {/* Modules — same gating as Home */}
        {showModulesSection && (
          <>
            <SectionLabel>Modules</SectionLabel>
            <View className="bg-surfaceLight dark:bg-white/5 rounded-card px-4 border border-border dark:border-white/10">
              {canViewAttendance && (
                <MenuRow
                  icon="clock-o"
                  label="Attendance"
                  onPress={() => router.push('/attendance')}
                  last={!canViewLeaves && !canViewWorklog}
                />
              )}
              {canViewLeaves && (
                <MenuRow
                  icon="calendar"
                  label="Leave"
                  onPress={() => router.push('/leave')}
                  last={!canViewWorklog}
                />
              )}
              {canViewWorklog && (
                <MenuRow icon="file-text-o" label="Worklogs" onPress={() => router.push('/worklogs')} last />
              )}
            </View>
          </>
        )}

        {/* Account settings — always visible; every user can manage their own account */}
        <SectionLabel>Account</SectionLabel>
        <View className="bg-surfaceLight dark:bg-white/5 rounded-card px-4 border border-border dark:border-white/10">
          <MenuRow icon="user-circle-o" label="Edit profile" onPress={() => router.push('/edit-profile')} />
          <MenuRow icon="lock" label="Change password" onPress={() => router.push('/change-password')} />
          <MenuRow
            icon="shield"
            label="Two-factor authentication"
            onPress={() => router.push('/two-factor')}
            last
          />
        </View>

        {/* Organization — gated: invitations.view OR users.manage (members), settings.manage (org settings) */}
        {showOrgSection && (
          <>
            <SectionLabel>Organization</SectionLabel>
            <View className="bg-surfaceLight dark:bg-white/5 rounded-card px-4 border border-border dark:border-white/10">
              {canSeeMembers && (
                <MenuRow
                  icon="users"
                  label="Members & invitations"
                  onPress={() => router.push('/members')}
                  last={!canSeeOrgSettings}
                />
              )}
              {canSeeOrgSettings && (
                <MenuRow icon="cog" label="Organization settings" onPress={() => router.push('/settings')} last />
              )}
            </View>
          </>
        )}

        {/* Workspace & session */}
        <SectionLabel>Workspace</SectionLabel>
        <View className="bg-surfaceLight dark:bg-white/5 rounded-card px-4 border border-border dark:border-white/10">
          {isMultiOrg && (
            <MenuRow icon="exchange" label="Switch workspace" onPress={() => router.push('/workspace-switch')} />
          )}
          <MenuRow
            icon="sign-out"
            label={signingOut ? 'Signing out…' : 'Sign out'}
            destructive
            showChevron={false}
            onPress={signingOut ? undefined : handleSignOut}
            last
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

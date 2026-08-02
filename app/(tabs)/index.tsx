import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { useAuthStore } from '../../store/authStore';
import { useOrgStore, useIsMultiOrg } from '../../store/orgStore';
import { usePermission, useAnyPermission } from '../../store/permissionStore';
import { PERMISSIONS } from '../../constants/permissions';
import { attendanceService } from '../../services/attendanceService';
import { refreshSession } from '../../hooks/useBootstrapSession';
import { Avatar } from '../../components/ui/Avatar';
import { ModuleCard } from '../../components/ui/ModuleCard';
import { StatCard } from '../../components/ui/StatCard';
import { formatMinutesAsHours, formatTime } from '../../utils/format';

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const activeOrg = useOrgStore((state) => state.activeOrg);
  const isMultiOrg = useIsMultiOrg();

  // Every visibility decision below is gated on a permission string, never on role.
  const canViewAttendance = usePermission(PERMISSIONS.ATTENDANCE_VIEW);
  const canViewLeaves = usePermission(PERMISSIONS.LEAVES_VIEW);
  const canViewWorklog = usePermission(PERMISSIONS.WORKLOG_VIEW);
  const canSeeApprovals = useAnyPermission([
    PERMISSIONS.ATTENDANCE_APPROVE,
    PERMISSIONS.ATTENDANCE_APPROVE_ANY,
    PERMISSIONS.WORKLOG_APPROVE,
    PERMISSIONS.WORKLOG_APPROVE_ANY,
    PERMISSIONS.LEAVES_APPROVE,
    PERMISSIONS.LEAVES_APPROVE_ANY,
  ]);
  const showStats = canSeeApprovals || canViewWorklog;
  const hasAnyModule = canViewAttendance || canViewLeaves || canViewWorklog;

  const [today, setToday] = useState<any>(null);
  const [loadingToday, setLoadingToday] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadToday = useCallback(async () => {
    if (!canViewAttendance) return;
    setLoadingToday(true);
    try {
      const envelope = await attendanceService.getToday();
      setToday(envelope.data ?? null);
    } catch {
      setToday(null);
    } finally {
      setLoadingToday(false);
    }
  }, [canViewAttendance]);

  useEffect(() => {
    loadToday();
  }, [loadToday]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refreshSession(), loadToday()]);
    setRefreshing(false);
  };

  const firstName = user?.first_name || user?.name?.split(' ')[0] || 'there';
  const orgName = activeOrg?.trading_name || activeOrg?.legal_name;
  const lastSession = today?.sessions?.[today.sessions.length - 1];

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background dark:bg-backgroundDark">
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Greeting + active-org indicator (permission: none — identity only) */}
        <View className="flex-row items-center justify-between mt-4 mb-6">
          <View className="flex-1 pr-4">
            <Text className="text-label text-textSecondaryLight dark:text-textSecondaryDark">
              {greeting()}
            </Text>
            <Text
              className="text-heading font-serif-bold text-textOnLight dark:text-textOnDark"
              numberOfLines={1}>
              {firstName}
            </Text>
            <TouchableOpacity
              disabled={!isMultiOrg}
              onPress={() => router.push('/workspace-switch')}
              className="flex-row items-center mt-1.5">
              <Text
                className="text-label text-textSecondaryLight dark:text-textSecondaryDark"
                numberOfLines={1}>
                {orgName || 'No workspace'}
              </Text>
              {isMultiOrg && (
                <FontAwesome name="exchange" size={11} color="#8FA0B5" style={{ marginLeft: 6 }} />
              )}
            </TouchableOpacity>
          </View>
          <Avatar name={user?.name || firstName} url={user?.avatar_url} size={52} />
        </View>

        {/* Attendance status — gated on attendance.view, hidden for freelancers/no-org */}
        {canViewAttendance && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/attendance')}
            className="bg-surfaceLight dark:bg-white/5 rounded-card p-5 border border-border dark:border-white/10 mb-5">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-label font-serif-semibold text-textSecondaryLight dark:text-textSecondaryDark uppercase">
                Today
              </Text>
              <FontAwesome name="angle-right" size={18} color="#C7CDD6" />
            </View>
            {today ? (
              <>
                <Text className="text-subheading font-serif-bold text-textOnLight dark:text-textOnDark mb-3">
                  {today.attendance_status?.label ?? 'Recorded'}
                </Text>
                <View className="flex-row justify-between">
                  <View>
                    <Text className="text-caption text-textSecondaryLight dark:text-textSecondaryDark mb-1">
                      Clock in
                    </Text>
                    <Text className="text-body font-serif-semibold text-textOnLight dark:text-textOnDark">
                      {formatTime(today.sessions?.[0]?.clock_in_at)}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-caption text-textSecondaryLight dark:text-textSecondaryDark mb-1">
                      Clock out
                    </Text>
                    <Text className="text-body font-serif-semibold text-textOnLight dark:text-textOnDark">
                      {formatTime(lastSession?.clock_out_at)}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-caption text-textSecondaryLight dark:text-textSecondaryDark mb-1">
                      Worked
                    </Text>
                    <Text className="text-body font-serif-semibold text-textOnLight dark:text-textOnDark">
                      {formatMinutesAsHours(today.total_work_minutes)}
                    </Text>
                  </View>
                </View>
              </>
            ) : (
              <Text className="text-body text-textSecondaryLight dark:text-textSecondaryDark">
                {loadingToday ? 'Loading…' : 'No clock-in recorded today.'}
              </Text>
            )}
          </TouchableOpacity>
        )}

        {/* Summary stats — gated on *.approve/*.approve_any and worklog.view respectively */}
        {showStats && (
          <View className="flex-row mb-1" style={{ gap: 12 }}>
            {canSeeApprovals && (
              <StatCard label="Pending approvals" value="–" trendLabel="Live count coming soon" />
            )}
            {canViewWorklog && (
              <StatCard label="Worklog hours" value="–" trendLabel="This week · coming soon" />
            )}
          </View>
        )}

        <Text className="text-label font-serif-semibold text-textSecondaryLight dark:text-textSecondaryDark uppercase mb-3 mt-2">
          Modules
        </Text>
        <View className="flex-row flex-wrap justify-between">
          {canViewAttendance && (
            <ModuleCard icon="clock-o" label="Attendance" onPress={() => router.push('/attendance')} />
          )}
          {canViewLeaves && (
            <ModuleCard icon="calendar" label="Leave" onPress={() => router.push('/leave')} />
          )}
          {canViewWorklog && (
            <ModuleCard icon="file-text-o" label="Worklogs" onPress={() => router.push('/worklogs')} />
          )}
          <ModuleCard icon="users" label="Shift Management" disabled badge="Soon" />
          <ModuleCard icon="bar-chart" label="Reports" disabled badge="Soon" />
        </View>

        {!hasAnyModule && (
          <View className="items-center mt-8 px-4">
            <Text className="text-body text-textSecondaryLight dark:text-textSecondaryDark text-center leading-6">
              Nothing to show yet — once you're added to a team with modules assigned, they'll appear
              here.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

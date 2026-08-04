import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { useAuthStore } from '../../store/authStore';
import { useOrgStore, useIsMultiOrg } from '../../store/orgStore';
import { usePermission } from '../../store/permissionStore';
import { PERMISSIONS } from '../../constants/permissions';
import { attendanceService } from '../../services/attendanceService';
import { worklogService } from '../../services/worklogService';
import { refreshSession } from '../../hooks/useBootstrapSession';
import { showAppModal } from '../../store/modalStore';
import {
  getCurrentLocation,
  LocationPermissionDeniedError,
  LocationServicesDisabledError,
  LocationUnavailableError,
} from '../../utils/location';
import { formatMinutesAsHours } from '../../utils/format';
import { Avatar } from '../../components/ui/Avatar';
import { ModuleCard } from '../../components/ui/ModuleCard';
import { StatCard } from '../../components/ui/StatCard';
import { AttendanceStatusCard } from '../../components/ui/AttendanceStatusCard';

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const activeOrg = useOrgStore((state) => state.activeOrg);
  const isMultiOrg = useIsMultiOrg();

  // Every visibility decision below is gated on a permission string, never on role.
  const canViewAttendance = usePermission(PERMISSIONS.ATTENDANCE_VIEW);
  const canClockAttendance = usePermission(PERMISSIONS.ATTENDANCE_CREATE);
  const canViewLeaves = usePermission(PERMISSIONS.LEAVES_VIEW);
  const canViewWorklog = usePermission(PERMISSIONS.WORKLOG_VIEW);
  const hasAnyModule = canViewAttendance || canViewLeaves || canViewWorklog;

  const [today, setToday] = useState<any>(null);
  const [loadingToday, setLoadingToday] = useState(false);
  const [clockActionLoading, setClockActionLoading] = useState(false);
  const [worklogHoursThisWeek, setWorklogHoursThisWeek] = useState<number | null>(null);
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

  const loadWorklogStat = useCallback(async () => {
    if (!canViewWorklog) return;
    try {
      const envelope = await worklogService.list();
      const worklogs = envelope.data ?? [];
      const cutoff = Date.now() - SEVEN_DAYS_MS;
      const minutes = worklogs
        .filter((w: any) => w.start_time && new Date(w.start_time).getTime() >= cutoff)
        .reduce((sum: number, w: any) => sum + (w.logged_minutes ?? 0), 0);
      setWorklogHoursThisWeek(minutes);
    } catch {
      setWorklogHoursThisWeek(null);
    }
  }, [canViewWorklog]);

  useEffect(() => {
    loadToday();
    loadWorklogStat();
  }, [loadToday, loadWorklogStat]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refreshSession(), loadToday(), loadWorklogStat()]);
    setRefreshing(false);
  };

  const handleClockAction = async (action: 'in' | 'out') => {
    setClockActionLoading(true);
    try {
      const location = await getCurrentLocation();
      if (action === 'in') {
        await attendanceService.clockIn(location);
      } else {
        await attendanceService.clockOut(location);
      }
      await loadToday();
    } catch (e: any) {
      if (e instanceof LocationServicesDisabledError) {
        showAppModal({ variant: 'warning', title: 'Location services off', message: e.message });
      } else if (e instanceof LocationPermissionDeniedError) {
        showAppModal({ variant: 'warning', title: 'Location permission denied', message: e.message });
      } else if (e instanceof LocationUnavailableError) {
        showAppModal({ variant: 'warning', title: 'Location unavailable', message: e.message });
      } else if (e.response?.status === 403 || e.response?.status === 422) {
        // A real server-side rejection — distinct from any of the on-device
        // location problems above. 403 = no attendance.create permission;
        // 422 = a business rule (BusinessRuleViolationException) like
        // PROFILE_NOT_FOUND, NO_POLICY_CONFIGURED, ACTIVE_SESSION_EXISTS,
        // LOCATION_REQUIRED, etc. error_code pinpoints exactly which one.
        showAppModal({
          variant: 'error',
          title: 'Not allowed',
          message: `${e.response?.data?.message || 'You do not have permission to do this.'}${
            e.response?.data?.error_code ? `\n\n(${e.response.data.error_code})` : ''
          }`,
        });
      } else {
        showAppModal({
          variant: 'error',
          title: 'Error',
          message: e.response?.data?.message || `Could not clock ${action}.`,
        });
      }
    } finally {
      setClockActionLoading(false);
    }
  };

  const firstName = user?.first_name || user?.name?.split(' ')[0] || 'there';
  const orgName = activeOrg?.trading_name || activeOrg?.legal_name;

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background dark:bg-backgroundDark">
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 110 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Greeting + avatar + notifications (display-only) */}
        <View className="flex-row items-center justify-between mt-4 mb-2">
          <View className="flex-1 pr-4">
            <Text
              className="text-subheading font-serif-bold text-textOnLight dark:text-textOnDark"
              numberOfLines={1}>
              {greeting()}, {firstName} 👋
            </Text>
            <TouchableOpacity
              disabled={!isMultiOrg}
              onPress={() => router.push('/workspace-switch')}
              className="flex-row items-center mt-1">
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
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => showAppModal({ variant: 'info', title: 'Notifications', message: 'Coming soon.' })}
              className="w-11 h-11 rounded-full bg-surfaceGray dark:bg-surfaceGrayDark items-center justify-center mr-3">
              <FontAwesome name="bell-o" size={17} color="#8FA0B5" />
            </TouchableOpacity>
            <Avatar name={user?.name || firstName} url={user?.avatar_url} size={44} />
          </View>
        </View>

        <View className="mt-4">
          {/* Attendance status + real Clock In/Out — gated on attendance.view */}
          {canViewAttendance && (
            <AttendanceStatusCard
              today={today}
              loading={loadingToday}
              canClock={canClockAttendance}
              clockActionLoading={clockActionLoading}
              onClockIn={() => handleClockAction('in')}
              onClockOut={() => handleClockAction('out')}
            />
          )}

          {/* Worklog hours — real data from GET /attendance/worklogs, gated worklog.view */}
          {canViewWorklog && (
            <View className="flex-row mb-1" style={{ gap: 12 }}>
              <StatCard
                label="Worklog hours"
                value={formatMinutesAsHours(worklogHoursThisWeek)}
                trendLabel="Last 7 days"
              />
            </View>
          )}

          <Text className="text-label font-serif-semibold text-textSecondaryLight dark:text-textSecondaryDark uppercase mb-3 mt-2">
            Modules
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {canViewAttendance && (
              <ModuleCard
                icon="clock-o"
                label="Attendance"
                description="Clock in/out and view your history"
                onPress={() => router.push('/attendance')}
              />
            )}
            {canViewLeaves && (
              <ModuleCard
                icon="calendar"
                label="Leave"
                description="Apply for and track leave requests"
                onPress={() => router.push('/leave')}
              />
            )}
            {canViewWorklog && (
              <ModuleCard
                icon="file-text-o"
                label="Worklogs"
                description="Review logged work hours"
                onPress={() => router.push('/worklogs')}
              />
            )}
            <ModuleCard icon="users" label="Shift Management" description="Team scheduling" disabled badge="Soon" />
            <ModuleCard icon="bar-chart" label="Reports" description="Org-wide analytics" disabled badge="Soon" />
          </View>

          {!hasAnyModule && (
            <View className="items-center mt-8 px-4">
              <Text className="text-body text-textSecondaryLight dark:text-textSecondaryDark text-center leading-6">
                Nothing to show yet — once you're added to a team with modules assigned, they'll appear
                here.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

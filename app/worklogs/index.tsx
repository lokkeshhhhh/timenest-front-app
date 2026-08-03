import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { worklogService } from '../../services/worklogService';
import { formatMinutesAsHours } from '../../utils/format';

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

const STATUS_COLOR: Record<string, string> = {
  approved: 'text-success',
  rejected: 'text-error',
  submitted: 'text-warning',
  pending: 'text-warning',
  draft: 'text-textSecondaryLight dark:text-textSecondaryDark',
};

export default function WorklogsScreen() {
  const [worklogs, setWorklogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const envelope = await worklogService.list();
      setWorklogs(envelope.data ?? []);
    } catch {
      setWorklogs([]);
    }
  }, []);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-background dark:bg-backgroundDark">
      <ScreenHeader title="Worklogs" />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {loading ? (
          <ActivityIndicator className="mt-10" />
        ) : worklogs.length === 0 ? (
          <Text className="text-body text-textSecondaryLight dark:text-textSecondaryDark text-center mt-10">
            No worklogs yet.
          </Text>
        ) : (
          worklogs.map((worklog) => {
            const statusKey = (worklog.worklog_status?.value ?? '').toLowerCase();
            return (
              <View
                key={worklog.uuid}
                className="bg-surfaceLight dark:bg-white/5 rounded-card p-4 border border-border dark:border-white/10 mb-3">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-label font-serif-semibold text-textSecondaryLight dark:text-textSecondaryDark">
                    {formatDate(worklog.start_time)}
                  </Text>
                  <Text className={`text-caption font-serif-semibold uppercase ${STATUS_COLOR[statusKey] ?? 'text-textSecondaryLight dark:text-textSecondaryDark'}`}>
                    {worklog.worklog_status?.label ?? 'Draft'}
                  </Text>
                </View>
                {worklog.description ? (
                  <Text className="text-body text-textOnLight dark:text-textOnDark mb-2" numberOfLines={2}>
                    {worklog.description}
                  </Text>
                ) : null}
                <View className="flex-row items-center justify-between">
                  <Text className="text-caption text-textSecondaryLight dark:text-textSecondaryDark">
                    {worklog.project?.name ?? 'No project'}
                  </Text>
                  <Text className="text-label font-serif-bold text-textOnLight dark:text-textOnDark">
                    {formatMinutesAsHours(worklog.logged_minutes)}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

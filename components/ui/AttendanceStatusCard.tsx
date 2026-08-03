import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { formatMinutesAsHours, formatTime } from '../../utils/format';

interface AttendanceStatusCardProps {
  today: any;
  loading: boolean;
  /** Gates the Clock In/Out button on attendance.create — separate from attendance.view, which only unlocks read-only status. */
  canClock: boolean;
  clockActionLoading: boolean;
  onClockIn: () => void;
  onClockOut: () => void;
}

/**
 * Read-only today summary (from GET /attendance/today) plus the one real
 * action this screen hosts: Clock In / Clock Out. The button's label and
 * handler flip based on whether the last session today is still open
 * (no clock_out_at yet) — that's the only signal needed to know which
 * action is valid right now; the backend enforces every other business
 * rule (holidays, leave, duplicate sessions, geofence) itself.
 */
export function AttendanceStatusCard({
  today,
  loading,
  canClock,
  clockActionLoading,
  onClockIn,
  onClockOut,
}: AttendanceStatusCardProps) {
  const router = useRouter();
  const sessions = today?.sessions ?? [];
  const lastSession = sessions[sessions.length - 1];
  const isClockedIn = !!lastSession && !lastSession.clock_out_at;

  return (
    <View className="bg-surfaceLight dark:bg-white/5 rounded-card p-5 border border-border dark:border-white/10 mb-5">
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => router.push('/attendance')}
        className="flex-row items-center justify-between mb-3">
        <Text className="text-label font-serif-semibold text-textSecondaryLight dark:text-textSecondaryDark uppercase">
          Today
        </Text>
        <FontAwesome name="angle-right" size={18} color="#C7CDD6" />
      </TouchableOpacity>

      {today ? (
        <>
          <View className="flex-row items-center mb-4">
            <View
              className={`w-2 h-2 rounded-full mr-2 ${isClockedIn ? 'bg-success' : 'bg-textMuted'}`}
            />
            <Text className="text-subheading font-serif-bold text-textOnLight dark:text-textOnDark">
              {isClockedIn ? 'Clocked in' : (today.attendance_status?.label ?? 'Recorded')}
            </Text>
          </View>
          <View className="flex-row justify-between mb-5">
            <View>
              <Text className="text-caption text-textSecondaryLight dark:text-textSecondaryDark mb-1">
                Clock in
              </Text>
              <Text className="text-body font-serif-semibold text-textOnLight dark:text-textOnDark">
                {formatTime(sessions[0]?.clock_in_at)}
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
        <Text className="text-body text-textSecondaryLight dark:text-textSecondaryDark mb-5">
          {loading ? 'Loading…' : 'No clock-in recorded today.'}
        </Text>
      )}

      {canClock && (
        <TouchableOpacity
          onPress={isClockedIn ? onClockOut : onClockIn}
          disabled={clockActionLoading}
          activeOpacity={0.85}
          className={`rounded-button py-3.5 items-center flex-row justify-center ${
            isClockedIn ? 'bg-error' : 'bg-primary'
          } ${clockActionLoading ? 'opacity-60' : ''}`}>
          {clockActionLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <FontAwesome name={isClockedIn ? 'sign-out' : 'sign-in'} size={16} color="#FFFFFF" />
              <Text className="text-white text-body font-serif-bold ml-2">
                {isClockedIn ? 'Clock Out' : 'Clock In'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

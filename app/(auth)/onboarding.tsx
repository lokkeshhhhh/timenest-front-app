import React, { useCallback, useRef, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Circle, Path } from 'react-native-svg';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  type SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useAuthStore } from '../../store/authStore';
import { PrimaryButton } from '../../components/ui/PrimaryButton';

// Brand accent hexes, mirrored from tailwind.config.js (primary/success/warning) —
// react-native-svg fill/stroke props can't consume Tailwind class names directly.
const ACCENT = {
  primary: '#4C49ED',
  success: '#10B981',
  warning: '#FFAB2E',
};

function GeofenceIllustration({ color }: { color: string }) {
  return (
    <Svg width={104} height={104} viewBox="0 0 100 100">
      <Circle cx={50} cy={50} r={40} stroke={color} strokeWidth={2.5} strokeDasharray="6 6" fill="none" opacity={0.4} />
      <Path d="M50 28c-9.4 0-17 7.6-17 17 0 12.4 17 27 17 27s17-14.6 17-27c0-9.4-7.6-17-17-17z" fill={color} />
      <Circle cx={50} cy={45} r={6} fill="#FFFFFF" />
    </Svg>
  );
}

function TeamIllustration({ color }: { color: string }) {
  return (
    <Svg width={104} height={104} viewBox="0 0 100 100">
      <Circle cx={38} cy={42} r={16} fill={color} opacity={0.35} />
      <Circle cx={62} cy={42} r={16} fill={color} opacity={0.55} />
      <Circle cx={50} cy={62} r={18} fill={color} />
      <Path d="M50 68l4 4 8-9" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

function ScaleIllustration({ color }: { color: string }) {
  return (
    <Svg width={104} height={104} viewBox="0 0 100 100">
      <Path d="M22 78 L34 78 L28 62 Z" fill={color} opacity={0.4} />
      <Path d="M42 78 L60 78 L51 48 Z" fill={color} opacity={0.7} />
      <Path d="M64 78 L88 78 L76 34 Z" fill={color} />
    </Svg>
  );
}

const SLIDES = [
  {
    id: '1',
    title: 'Attendance, made effortless',
    description: 'Clock in and out automatically with geo-fenced accuracy — no paperwork, no guesswork.',
    Illustration: GeofenceIllustration,
    color: ACCENT.primary,
  },
  {
    id: '2',
    title: 'Your team, organized',
    description: 'Manage roles, leave requests, and daily worklogs from one place, with permissions that fit how you work.',
    Illustration: TeamIllustration,
    color: ACCENT.success,
  },
  {
    id: '3',
    title: 'Built for how you work',
    description: 'From solo freelancers to growing teams and full organizations — Arcana scales with you.',
    Illustration: ScaleIllustration,
    color: ACCENT.warning,
  },
];

function Dot({ index, scrollX, width }: { index: number; scrollX: SharedValue<number>; width: number }) {
  const style = useAnimatedStyle(() => {
    const input = [(index - 1) * width, index * width, (index + 1) * width];
    return {
      width: interpolate(scrollX.value, input, [8, 24, 8], Extrapolation.CLAMP),
      opacity: interpolate(scrollX.value, input, [0.3, 1, 0.3], Extrapolation.CLAMP),
    };
  });
  // Inline (not className) on purpose: NativeWind's cssInterop isn't registered
  // for react-native-reanimated's Animated.View in this project, so class-driven
  // color/height/radius silently no-op here — verified by screenshot, not a guess.
  return (
    <Animated.View
      style={[{ height: 8, borderRadius: 999, marginHorizontal: 4, backgroundColor: ACCENT.primary }, style]}
    />
  );
}

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList) as typeof FlatList;

export default function OnboardingScreen() {
  const router = useRouter();
  const setHasSeenOnboarding = useAuthStore((state) => state.setHasSeenOnboarding);
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const listRef = useRef<any>(null);
  const scrollX = useSharedValue(0);

  const completeOnboarding = useCallback(() => {
    setHasSeenOnboarding(true);
    router.replace('/(auth)/login');
  }, [router, setHasSeenOnboarding]);

  const goNext = useCallback(() => {
    if (currentIndex < SLIDES.length - 1) {
      listRef.current?.scrollToOffset({ offset: (currentIndex + 1) * width, animated: true });
    } else {
      completeOnboarding();
    }
  }, [currentIndex, width, completeOnboarding]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      const index = Math.round(event.contentOffset.x / width);
      runOnJS(setCurrentIndex)(index);
    },
  });

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-backgroundDark">
      <View className="flex-row justify-end px-6 pt-2 z-10">
        {currentIndex < SLIDES.length - 1 ? (
          <TouchableOpacity
            onPress={completeOnboarding}
            className="px-4 py-2"
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Text className="text-textSecondaryLight dark:text-textSecondaryDark text-label font-serif-semibold">
              Skip
            </Text>
          </TouchableOpacity>
        ) : (
          <View className="px-4 py-2 opacity-0" pointerEvents="none">
            <Text>Skip</Text>
          </View>
        )}
      </View>

      <View className="flex-1 pt-4 pb-8">
        <AnimatedFlatList
          ref={listRef}
          data={SLIDES}
          horizontal
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item: (typeof SLIDES)[number]) => item.id}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          renderItem={({ item }: { item: (typeof SLIDES)[number] }) => (
            <View style={{ width }} className="items-center justify-center px-10">
              <View
                className="w-40 h-40 rounded-[32px] items-center justify-center mb-10"
                style={{ backgroundColor: `${item.color}1A` }}
              >
                <item.Illustration color={item.color} />
              </View>
              <Text className="text-textOnLight dark:text-textOnDark text-[26px] font-serif-bold text-center mb-4 leading-8">
                {item.title}
              </Text>
              <Text className="text-textSecondaryLight dark:text-textSecondaryDark text-[16px] text-center leading-6">
                {item.description}
              </Text>
            </View>
          )}
        />
      </View>

      <View className="px-8 pb-12 pt-6">
        <View className="flex-row justify-center items-center mb-8 h-4">
          {SLIDES.map((_, index) => (
            <Dot key={index} index={index} scrollX={scrollX} width={width} />
          ))}
        </View>

        <PrimaryButton
          title={currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          onPress={goNext}
          showArrow
        />
      </View>
    </SafeAreaView>
  );
}

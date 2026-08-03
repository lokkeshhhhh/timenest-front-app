import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Circle, Path } from 'react-native-svg';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  type SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useAuthStore } from '../../store/authStore';
import { useSplashStore } from '../../store/splashStore';
import { useTheme } from '../../hooks/useTheme';
import { PrimaryButton } from '../../components/ui/PrimaryButton';

// The app-wide accent, read directly from tailwind.config.js — the one place
// that value lives. react-native-svg fill/stroke props can't consume Tailwind
// class names, so this is a read of the same token, not a second copy of it:
// change the color in tailwind.config.js and both Tailwind classes and this
// import move together.
const PRIMARY: string = require('../../tailwind.config.js').theme.extend.colors.primary;

// Slide 1's own illustration accent — intentionally its previous purple, not
// tied to the app-wide accent above (only slides 2/3 use their own colors too).
const ACCENT = { primary: '#4C49ED', success: '#10B981', warning: '#FFAB2E' };

// Illustrations: unDraw (MIT-licensed, free for commercial use, no attribution
// required — see assets/images/onboarding/UNDRAW_LICENSE.txt), rasterized to PNG.
const SLIDES = [
  {
    id: '1',
    title: 'Attendance, made effortless',
    description: 'Clock in and out automatically with geo-fenced accuracy — no paperwork, no guesswork.',
    image: require('../../assets/images/onboarding/attendance.png'),
    ratio: 900 / 669,
    accent: ACCENT.primary,
    Watermark: AttendanceWatermark,
  },
  {
    id: '2',
    title: 'Your team, organized',
    description: 'Manage roles, leave requests, and daily worklogs from one place, with permissions that fit how you work.',
    image: require('../../assets/images/onboarding/team.png'),
    ratio: 900 / 689,
    accent: ACCENT.success,
    Watermark: TeamWatermark,
  },
  {
    id: '3',
    title: 'Built for how you work',
    description: 'From solo freelancers to growing teams and full organizations — Arcana scales with you.',
    image: require('../../assets/images/onboarding/scale.png'),
    ratio: 900 / 667,
    accent: ACCENT.warning,
    Watermark: RocketWatermark,
  },
];

// Modern line-icon watermarks — one per slide, replacing a single generic
// brand mark repeated on every screen. Stroke-only, rounded joins, no fill:
// reads as a background accent rather than a literal icon-font glyph.
// Clock (time) overlapping a person-with-gear-checkmark (attendance/approval).
function AttendanceWatermark({ color }: { color: string }) {
  return (
    <Svg width={140} height={140} viewBox="0 0 100 100">
      {/* clock */}
      <Circle cx={32} cy={30} r={19} stroke={color} strokeWidth={4.5} fill="none" />
      <Path d="M32 19 L32 30 L41 30" stroke={color} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* person bust */}
      <Circle cx={64} cy={47} r={13} stroke={color} strokeWidth={4.5} fill="none" />
      <Path d="M42 91c0-13.3 9.8-23 22-23s22 9.7 22 23" stroke={color} strokeWidth={4.5} fill="none" strokeLinecap="round" />
      {/* gear + checkmark */}
      <Circle cx={64} cy={80} r={11} stroke={color} strokeWidth={3.5} fill="none" />
      <Path
        d="M64 66v4.5M64 89.5V94M78 80h-4.5M54.5 80H50M74.4 69.6l-3.2 3.2M56.8 87.2l-3.2 3.2M74.4 90.4l-3.2-3.2M56.8 72.8l-3.2-3.2"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <Path d="M59 80.5l3.5 3.5 7-7.5" stroke={color} strokeWidth={3.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function TeamWatermark({ color }: { color: string }) {
  return (
    <Svg width={140} height={140} viewBox="0 0 100 100">
      <Circle cx={50} cy={22} r={11} stroke={color} strokeWidth={5} fill="none" />
      <Circle cx={24} cy={64} r={11} stroke={color} strokeWidth={5} fill="none" />
      <Circle cx={76} cy={64} r={11} stroke={color} strokeWidth={5} fill="none" />
      <Path d="M50 33 L50 46 M50 46 L24 53 M50 46 L76 53" stroke={color} strokeWidth={4} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

function RocketWatermark({ color }: { color: string }) {
  return (
    <Svg width={140} height={140} viewBox="0 0 100 100">
      <Path
        d="M50 10c8 8 12 20 12 32v20H38V42c0-12 4-24 12-32z"
        stroke={color}
        strokeWidth={5}
        fill="none"
        strokeLinejoin="round"
      />
      <Circle cx={50} cy={36} r={7} stroke={color} strokeWidth={4.5} fill="none" />
      <Path d="M38 50 L24 68 L38 64" stroke={color} strokeWidth={4.5} fill="none" strokeLinejoin="round" />
      <Path d="M62 50 L76 68 L62 64" stroke={color} strokeWidth={4.5} fill="none" strokeLinejoin="round" />
      <Path
        d="M44 62 L42 78 L50 71 L58 78 L56 62"
        stroke={color}
        strokeWidth={4.5}
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </Svg>
  );
}

// Small drifting accent dots around (not on top of) the illustration — sit at
// the fringe of an oversized box so they read against the page background
// rather than blending into the illustration's own similarly-colored blob.
// The last slide's drift upward, echoing a launch/rocket trail to match its
// "scaling up" theme.
const PARTICLE_LAYOUTS = [
  { top: '-2%', left: '2%', size: 9 },
  { top: '78%', right: '0%', size: 12 },
  { top: '40%', right: '-3%', size: 7 },
] as const;

function FloatingParticles({ color, rising }: { color: string; rising: boolean }) {
  return (
    <>
      {PARTICLE_LAYOUTS.map((layout, i) => (
        <Particle key={i} layout={layout} color={color} rising={rising} delay={i * 350} />
      ))}
    </>
  );
}

function Particle({
  layout,
  color,
  rising,
  delay,
}: {
  layout: (typeof PARTICLE_LAYOUTS)[number];
  color: string;
  rising: boolean;
  delay: number;
}) {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: rising ? 1400 : 2000, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: rising ? 1400 : 2000, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      )
    );
  }, [t, delay, rising]);

  const style = useAnimatedStyle(() => ({
    opacity: interpolate(t.value, [0, 1], [0.35, 0.95]),
    transform: [{ translateY: interpolate(t.value, [0, 1], rising ? [8, -14] : [-5, 5]) }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          width: layout.size,
          height: layout.size,
          borderRadius: layout.size,
          backgroundColor: color,
          top: layout.top,
          left: 'left' in layout ? layout.left : undefined,
          right: 'right' in layout ? layout.right : undefined,
        },
        style,
      ]}
    />
  );
}

function SlideItem({
  item,
  index,
  scrollX,
  width,
}: {
  item: (typeof SLIDES)[number];
  index: number;
  scrollX: SharedValue<number>;
  width: number;
}) {
  const float = useSharedValue(0);

  useEffect(() => {
    float.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, [float]);

  const imageStyle = useAnimatedStyle(() => {
    const input = [(index - 1) * width, index * width, (index + 1) * width];
    const focus = interpolate(scrollX.value, input, [0, 1, 0], Extrapolation.CLAMP);
    return {
      opacity: interpolate(focus, [0, 1], [0.35, 1]),
      transform: [
        { scale: interpolate(focus, [0, 1], [0.85, 1]) },
        { translateY: interpolate(float.value, [0, 1], [0, -6]) },
      ],
    };
  });

  const textStyle = useAnimatedStyle(() => {
    const input = [(index - 1) * width, index * width, (index + 1) * width];
    const focus = interpolate(scrollX.value, input, [0, 1, 0], Extrapolation.CLAMP);
    return {
      opacity: interpolate(focus, [0, 1], [0, 1]),
      transform: [{ translateY: interpolate(focus, [0, 1], [18, 0]) }],
    };
  });

  const imageWidth = 260;
  const imageHeight = imageWidth / item.ratio;
  const Watermark = item.Watermark;

  return (
    <View style={{ width }} className="items-center justify-center px-8">
      <View
        pointerEvents="none"
        style={{ position: 'absolute', top: 0, right: 8, opacity: 0.12 }}
      >
        <Watermark color={item.accent} />
      </View>

      <View
        style={{
          width: imageWidth + 40,
          height: imageHeight + 40,
          marginBottom: 32,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <FloatingParticles color={item.accent} rising={item.id === '3'} />
        <Animated.Image
          source={item.image}
          resizeMode="contain"
          style={[{ width: imageWidth, height: imageHeight }, imageStyle]}
        />
      </View>

      <Animated.View style={textStyle}>
        <Text className="text-textOnLight dark:text-textOnDark text-[26px] font-serif-bold text-center mb-4 leading-8">
          {item.title}
        </Text>
        <Text className="text-textSecondaryLight dark:text-textSecondaryDark text-[16px] text-center leading-6">
          {item.description}
        </Text>
      </Animated.View>
    </View>
  );
}

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
      style={[{ height: 8, borderRadius: 999, marginHorizontal: 4, backgroundColor: PRIMARY }, style]}
    />
  );
}

// Track spanning slide 1 → the last slide, with a fill that grows as you swipe
// toward the end — a visible sense of "journey" rather than just static dots.
function ProgressTrack({ scrollX, width, trackColor }: { scrollX: SharedValue<number>; width: number; trackColor: string }) {
  const fillStyle = useAnimatedStyle(() => ({
    width: `${interpolate(scrollX.value, [0, (SLIDES.length - 1) * width], [0, 100], Extrapolation.CLAMP)}%`,
  }));
  return (
    <View
      style={{ width: 120, height: 4, borderRadius: 2, backgroundColor: trackColor, overflow: 'hidden', alignSelf: 'center', marginBottom: 20 }}
    >
      <Animated.View style={[{ height: 4, borderRadius: 2, backgroundColor: PRIMARY }, fillStyle]} />
    </View>
  );
}

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList) as typeof FlatList;

export default function OnboardingScreen() {
  const router = useRouter();
  const { scheme: colorScheme } = useTheme();
  const setHasSeenOnboarding = useAuthStore((state) => state.setHasSeenOnboarding);
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const listRef = useRef<any>(null);
  const scrollX = useSharedValue(0);
  const screenEnter = useSharedValue(0);
  const splashDone = useSplashStore((state) => state.splashDone);

  useEffect(() => {
    // Gated on the splash overlay actually finishing, not on mount: this screen
    // mounts underneath the splash well before it fades away, so an
    // on-mount timer would finish unseen, hidden behind the still-visible splash.
    if (!splashDone) return;
    screenEnter.value = withTiming(1, { duration: 550, easing: Easing.out(Easing.cubic) });
  }, [splashDone, screenEnter]);

  const screenEnterStyle = useAnimatedStyle(() => ({
    opacity: screenEnter.value,
    transform: [{ translateY: interpolate(screenEnter.value, [0, 1], [14, 0]) }],
  }));

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
      <Animated.View style={[{ flex: 1 }, screenEnterStyle]}>
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
            renderItem={({ item, index }: { item: (typeof SLIDES)[number]; index: number }) => (
              <SlideItem item={item} index={index} scrollX={scrollX} width={width} />
            )}
          />
        </View>

        <View className="px-8 pb-12 pt-6">
          <ProgressTrack
            scrollX={scrollX}
            width={width}
            trackColor={colorScheme === 'dark' ? 'rgba(226,232,240,0.15)' : 'rgba(143,160,181,0.25)'}
          />

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
      </Animated.View>
    </SafeAreaView>
  );
}

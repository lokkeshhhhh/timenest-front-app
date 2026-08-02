import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const AnimatedPath = Animated.createAnimatedComponent(Path);

// Outline of the Arcana mark (components/brand/ArcanaLogo.tsx), traced as a
// single stroke so it can be "drawn on" rather than just faded in.
const LOGO_PATH = 'M50 15 L20 85 H40 L45 70 H65 L70 85 H90 L50 15 Z';
const LOGO_PATH_LENGTH = 249; // sum of segment lengths in the 0-100 viewBox, rounded up

const DRAW_DURATION = 900;
const SETTLE_DURATION = 280;
const TEXT_DELAY = 120;
const TEXT_DURATION = 420;
const MIN_HOLD = 500;
const FADE_OUT_DURATION = 380;

interface AnimatedSplashScreenProps {
  /** Whether the app has finished the work gating navigation (auth hydration). */
  ready: boolean;
  onFinish: () => void;
}

export function AnimatedSplashScreen({ ready, onFinish }: AnimatedSplashScreenProps) {
  const drawProgress = useSharedValue(0);
  const strokeOpacity = useSharedValue(1);
  const fillOpacity = useSharedValue(0);
  const markScale = useSharedValue(0.94);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(10);
  const containerOpacity = useSharedValue(1);

  const [holdReached, setHoldReached] = useState(false);
  const exitStarted = useRef(false);

  useEffect(() => {
    // Native splash (see app.json: no image, just the near-black backgroundColor)
    // is visually identical to this component's resting frame, so hiding it the
    // instant we mount produces no visible handoff flash.
    SplashScreen.hideAsync();

    drawProgress.value = withTiming(1, { duration: DRAW_DURATION, easing: Easing.out(Easing.cubic) });

    const settleTimer = setTimeout(() => {
      fillOpacity.value = withTiming(1, { duration: SETTLE_DURATION });
      strokeOpacity.value = withTiming(0, { duration: SETTLE_DURATION });
      markScale.value = withSpring(1, { damping: 10, stiffness: 140 });
    }, DRAW_DURATION);

    const textTimer = setTimeout(() => {
      textOpacity.value = withTiming(1, { duration: TEXT_DURATION, easing: Easing.out(Easing.quad) });
      textTranslateY.value = withTiming(0, { duration: TEXT_DURATION, easing: Easing.out(Easing.quad) });
    }, DRAW_DURATION + SETTLE_DURATION + TEXT_DELAY);

    const holdTimer = setTimeout(() => {
      setHoldReached(true);
    }, DRAW_DURATION + SETTLE_DURATION + TEXT_DELAY + TEXT_DURATION + MIN_HOLD);

    return () => {
      clearTimeout(settleTimer);
      clearTimeout(textTimer);
      clearTimeout(holdTimer);
    };
  }, []);

  useEffect(() => {
    if (!holdReached || !ready || exitStarted.current) return;
    exitStarted.current = true;
    containerOpacity.value = withTiming(
      0,
      { duration: FADE_OUT_DURATION, easing: Easing.in(Easing.cubic) },
      (finished) => {
        if (finished) runOnJS(onFinish)();
      }
    );
  }, [holdReached, ready]);

  const containerStyle = useAnimatedStyle(() => ({ opacity: containerOpacity.value }));
  const markStyle = useAnimatedStyle(() => ({ transform: [{ scale: markScale.value }] }));
  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const strokeAnimatedProps = useAnimatedProps(() => ({
    strokeDashoffset: LOGO_PATH_LENGTH * (1 - drawProgress.value),
    opacity: strokeOpacity.value,
  }));
  const fillAnimatedProps = useAnimatedProps(() => ({
    opacity: fillOpacity.value,
  }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.container, containerStyle]} pointerEvents="none">
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Animated.View style={markStyle}>
            <Svg width={96} height={96} viewBox="0 0 100 100">
              <AnimatedPath
                d={LOGO_PATH}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth={5}
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeDasharray={[LOGO_PATH_LENGTH, LOGO_PATH_LENGTH]}
                animatedProps={strokeAnimatedProps}
              />
              <AnimatedPath d={LOGO_PATH} fill="#FFFFFF" animatedProps={fillAnimatedProps} />
            </Svg>
          </Animated.View>
          <Animated.Text style={[styles.wordmark, textStyle]}>Arcana</Animated.Text>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0A0A0A',
    zIndex: 50,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmark: {
    marginTop: 16,
    fontSize: 28,
    fontFamily: 'LibertinusSerif-Bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
});

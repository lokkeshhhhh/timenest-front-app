import React, { useEffect } from 'react';
import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

interface ImageSelectCardProps {
  image: ImageSourcePropType;
  /** Small circular avatar sitting beside the title — for cases (like
   * workspace logos) where there's no natural photo per option. */
  avatarUrl?: string;
  title: string;
  description?: string;
  badges?: string[];
  selected: boolean;
  onSelect: () => void;
}

const CARD_HEIGHT = 190;
const AnimatedImage = Animated.createAnimatedComponent(Image);

// Full-bleed photo card: the image *is* the card, with title/description/
// badges overlaid at the bottom over a dark gradient — no separate button,
// tapping anywhere on the card selects it. A slow Ken-Burns zoom on the photo
// keeps it from feeling like a static poster.
export function ImageSelectCard({
  image,
  avatarUrl,
  title,
  description,
  badges,
  selected,
  onSelect,
}: ImageSelectCardProps) {
  const zoom = useSharedValue(0);

  useEffect(() => {
    zoom.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 9000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 9000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, [zoom]);

  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + zoom.value * 0.08 }],
  }));

  return (
    <TouchableOpacity
      onPress={onSelect}
      activeOpacity={0.92}
      className={`rounded-card overflow-hidden mb-5 border-2 ${selected ? 'border-primary' : 'border-transparent'}`}
      style={{ height: CARD_HEIGHT }}
    >
      <AnimatedImage
        source={image}
        resizeMode="cover"
        style={[{ position: 'absolute', width: '100%', height: '100%' }, imageStyle]}
      />

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.82)']}
        locations={[0, 0.4, 1]}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
      />

      <View
        className="absolute top-3 right-3 w-7 h-7 rounded-full items-center justify-center"
        style={{
          backgroundColor: selected ? '#FFFFFF' : 'rgba(255,255,255,0.22)',
          borderWidth: selected ? 0 : 1.5,
          borderColor: 'rgba(255,255,255,0.85)',
        }}
      >
        {selected && <Feather name="check" size={15} color="#2A1220" />}
      </View>

      <View className="absolute left-0 right-0 bottom-0 p-4">
        <View className="flex-row items-center mb-1">
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={{ width: 26, height: 26, borderRadius: 13, marginRight: 8, borderWidth: 1.5, borderColor: '#FFFFFF' }}
            />
          ) : null}
          <Text className="text-white text-body font-serif-bold flex-1" numberOfLines={1}>
            {title}
          </Text>
        </View>

        {description ? (
          <Text className="text-white/85 text-label leading-5 mb-2" numberOfLines={2}>
            {description}
          </Text>
        ) : null}

        {badges && badges.length > 0 && (
          <View className="flex-row flex-wrap" style={{ gap: 6 }}>
            {badges.map((badge, i) => (
              <View key={i} className="bg-white/20 rounded-full px-2.5 py-1">
                <Text className="text-white text-caption font-serif-semibold">{badge}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

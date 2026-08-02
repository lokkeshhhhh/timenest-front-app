import React, { useState, useRef } from 'react';
import { View, Text, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { Feather } from '@expo/vector-icons';
import { PrimaryButton } from '../../components/ui/PrimaryButton';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Smart Geo-fenced Attendance',
    description: 'Effortlessly track clock-ins and clock-outs based on precise, verified locations.',
    icon: 'map-pin',
    color: '#4C49ED', // primary
    bgColor: '#F0EEFF' // primaryLight
  },
  {
    id: '2',
    title: 'Advanced Team Management',
    description: 'Govern your entire organization seamlessly with granular, role-based access control.',
    icon: 'shield',
    color: '#10B981', // success
    bgColor: 'rgba(16, 185, 129, 0.1)'
  },
  {
    id: '3',
    title: 'Leave & Worklog Tracking',
    description: 'Keep projects on schedule with transparent daily worklogs and automated leave management.',
    icon: 'calendar',
    color: '#F59E0B', // warning
    bgColor: '#FFF6E9' // warningBg
  },
  {
    id: '4',
    title: 'Built for Everyone',
    description: 'Whether you are a solo freelancer, a growing team, or an enterprise organization, Arcana adapts to you.',
    icon: 'layers',
    color: '#3C3B75', // primaryDark
    bgColor: '#E2E8F0' // textSecondaryDark used as pastel
  }
];

export default function OnboardingScreen() {
  const router = useRouter();
  const setHasSeenOnboarding = useAuthStore(state => state.setHasSeenOnboarding);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const completeOnboarding = () => {
    setHasSeenOnboarding(true);
    router.replace('/(auth)/login');
  };

  const nextSlide = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      completeOnboarding();
    }
  };

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };

  const renderItem = ({ item }: { item: typeof SLIDES[0] }) => {
    return (
      <View style={{ width, paddingHorizontal: 40 }} className="items-center justify-center pt-10">
        <View 
          className="w-48 h-48 rounded-[40px] items-center justify-center mb-12 shadow-sm"
          style={{ backgroundColor: item.bgColor }}
        >
          <Feather name={item.icon as any} size={80} color={item.color} />
        </View>
        <Text className="text-textOnLight text-[28px] font-serif-bold text-center mb-4 leading-9">
          {item.title}
        </Text>
        <Text className="text-textSecondaryLight text-[16px] text-center leading-6">
          {item.description}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row justify-end px-6 pt-4 z-10">
        {currentIndex < SLIDES.length - 1 ? (
          <TouchableOpacity 
            onPress={completeOnboarding} 
            className="px-4 py-2"
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Text className="text-textSecondaryLight text-label font-serif-semibold">Skip</Text>
          </TouchableOpacity>
        ) : (
          <View className="px-4 py-2 opacity-0"><Text>Skip</Text></View> // placeholder to maintain height
        )}
      </View>
      
      <View className="flex-1 pt-4 pb-8">
        <FlatList
          ref={flatListRef}
          data={SLIDES}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          keyExtractor={(item) => item.id}
        />
      </View>
      
      <View className="px-8 pb-12 pt-6">
        {/* Pagination Dots */}
        <View className="flex-row justify-center items-center mb-8 h-4">
          {SLIDES.map((_, index) => (
            <View
              key={index}
              className={`h-2 rounded-full mx-1 transition-all duration-300 ${
                index === currentIndex ? 'w-6 bg-primary' : 'w-2 bg-textSecondaryLight/30'
              }`}
            />
          ))}
        </View>

        <PrimaryButton
          title={currentIndex === SLIDES.length - 1 ? "Get Started" : "Continue"}
          onPress={nextSlide}
          showArrow={true}
        />
      </View>
    </SafeAreaView>
  );
}

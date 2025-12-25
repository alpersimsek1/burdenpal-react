import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Users, Sparkles, GraduationCap, MessageSquare, Trophy } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';

import { BuddyNavigator } from './BuddyNavigator';
import { PalScreen } from '../screens/PalScreen';
import { MentoringScreen } from '../screens/MentoringScreen';
import { CommunityNavigator } from './CommunityNavigator';
import { SmallWinsScreen } from '../screens/SmallWinsScreen';
import { colors } from '../theme/colors';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserProfileScreen } from '../screens/UserProfileScreen';

// ... imports

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopColor: colors.border,
                    elevation: 0,
                    shadowOpacity: 0,
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
                tabBarShowLabel: false,
            }}
        >
            <Tab.Screen
                name="Buddy"
                component={BuddyNavigator}
                options={{
                    tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
                    tabBarLabel: 'Buddy',
                }}
            />
            <Tab.Screen
                name="Pal"
                component={PalScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Sparkles color={color} size={size} />,
                    tabBarLabel: 'Pal AI',
                }}
            />
            <Tab.Screen
                name="Community"
                component={CommunityNavigator}
                options={{
                    tabBarIcon: ({ color, size }) => <MessageSquare color={color} size={size} />,
                    tabBarLabel: 'Community',
                }}
            />
            <Tab.Screen
                name="SmallWins"
                component={SmallWinsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Trophy color={color} size={size} />,
                    tabBarLabel: 'Wins',
                }}
            />
        </Tab.Navigator>
    );
}

export function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="MainTabs" component={TabNavigator} />
                <Stack.Screen
                    name="UserProfile"
                    component={UserProfileScreen}
                    options={{
                        headerShown: true,
                        headerTitle: 'Profile',
                        headerShadowVisible: false,
                        headerStyle: { backgroundColor: '#F0F4F8' }, // Match screen background
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <StatusBar style="auto" />
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                    name="user-profile"
                    options={{
                        headerShown: true,
                        headerTitle: 'Profile',
                        headerBackTitle: 'Back',
                        headerShadowVisible: false,
                        headerStyle: { backgroundColor: '#F0F4F8' },
                    }}
                />
                <Stack.Screen
                    name="chat-detail"
                    options={{
                        headerShown: true,
                        headerTitle: 'Chat',
                        headerBackTitle: 'Back',
                        headerShadowVisible: false,
                    }}
                />
                <Stack.Screen
                    name="post-detail"
                    options={{
                        headerShown: true,
                        headerTitle: 'Post',
                        headerBackTitle: 'Back',
                        headerShadowVisible: false,
                    }}
                />
                <Stack.Screen
                    name="topic-feed"
                    options={{
                        headerShown: true,
                        headerTitle: 'Topic',
                        headerBackTitle: 'Back',
                        headerShadowVisible: false,
                    }}
                />
            </Stack>
        </SafeAreaProvider>
    );
}

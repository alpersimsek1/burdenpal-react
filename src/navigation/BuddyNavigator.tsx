import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BuddyScreen } from '../screens/BuddyScreen';
import { ChatDetailScreen } from '../screens/ChatDetailScreen';

const Stack = createNativeStackNavigator();

export function BuddyNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="BuddyMain" component={BuddyScreen} />
            <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
        </Stack.Navigator>
    );
}

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CommunityScreen } from '../screens/CommunityScreen';
import { TopicFeedScreen } from '../screens/TopicFeedScreen';
import { PostDetailScreen } from '../screens/PostDetailScreen';

const Stack = createNativeStackNavigator();

export function CommunityNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="CommunityList" component={CommunityScreen} />
            <Stack.Screen name="TopicFeed" component={TopicFeedScreen} />
            <Stack.Screen name="PostDetail" component={PostDetailScreen} />
        </Stack.Navigator>
    );
}

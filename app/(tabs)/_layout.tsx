import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import React from 'react';
import { DynamicColorIOS, Platform } from 'react-native';

/**
 * iOS 26 Liquid Glass Tab Bar Layout
 * 
 * Uses NativeTabs for native iOS tab bar with liquid glass effect.
 * SF Symbols are used for iOS icons, which automatically adapt to the liquid glass styling.
 */
export default function TabLayout() {
    // Dynamic color for liquid glass - automatically adapts to light/dark backgrounds
    const dynamicTintColor = Platform.OS === 'ios'
        ? DynamicColorIOS({ dark: '#FFFFFF', light: '#007AFF' })
        : '#007AFF';

    const dynamicLabelColor = Platform.OS === 'ios'
        ? DynamicColorIOS({ dark: '#FFFFFF', light: '#000000' })
        : '#000000';

    return (
        <NativeTabs
            minimizeBehavior="onScrollDown"
            tintColor={dynamicTintColor}
            labelStyle={{
                color: dynamicLabelColor,
            }}
        >
            {/* Buddy Tab - using person.2 SF Symbol */}
            <NativeTabs.Trigger name="index">
                <Label>Buddy</Label>
                <Icon
                    sf={{ default: 'person.2', selected: 'person.2.fill' }}
                    drawable="ic_group"
                />
            </NativeTabs.Trigger>

            {/* Pal AI Tab - using sparkles SF Symbol */}
            <NativeTabs.Trigger name="pal">
                <Label>Pal AI</Label>
                <Icon
                    sf={{ default: 'sparkles', selected: 'sparkles' }}
                    drawable="ic_sparkles"
                />
            </NativeTabs.Trigger>

            {/* Community Tab - using bubble.left.and.bubble.right SF Symbol */}
            <NativeTabs.Trigger name="community">
                <Label>Community</Label>
                <Icon
                    sf={{ default: 'bubble.left.and.bubble.right', selected: 'bubble.left.and.bubble.right.fill' }}
                    drawable="ic_forum"
                />
            </NativeTabs.Trigger>

            {/* Small Wins Tab - using trophy SF Symbol */}
            <NativeTabs.Trigger name="wins">
                <Label>Wins</Label>
                <Icon
                    sf={{ default: 'trophy', selected: 'trophy.fill' }}
                    drawable="ic_trophy"
                />
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}

import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import React from 'react';
import { DynamicColorIOS, Platform } from 'react-native';
import { colors } from '../../src/theme/colors';

/**
 * iOS 26 Liquid Glass Tab Bar Layout
 * 
 * Uses NativeTabs for native iOS tab bar with liquid glass effect.
 * SF Symbols are used for iOS icons, which automatically adapt to the liquid glass styling.
 */
export default function TabLayout() {
    // Dynamic color for liquid glass - Blueish tones for modern look
    const dynamicTintColor = Platform.OS === 'ios'
        ? DynamicColorIOS({ dark: '#F0F5F9', light: colors.primary })
        : colors.primary;

    const dynamicLabelColor = Platform.OS === 'ios'
        ? DynamicColorIOS({ dark: '#F0F5F9', light: colors.primary })
        : colors.primary;

    return (
        <NativeTabs
            minimizeBehavior="onScrollDown"
            tintColor={dynamicTintColor}
            labelStyle={{
                color: dynamicLabelColor,
            }}
        >
            {/* Pal Tab - using person.2 SF Symbol */}
            <NativeTabs.Trigger name="index">
                <Label>Pal</Label>
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

            {/* Spaces Tab - using bubble.left.and.bubble.right SF Symbol */}
            <NativeTabs.Trigger name="community">
                <Label>Spaces</Label>
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

            {/* Profile Tab - using person.crop.circle SF Symbol */}
            <NativeTabs.Trigger name="profile">
                <Label>Profile</Label>
                <Icon
                    sf={{ default: 'person.crop.circle', selected: 'person.crop.circle.fill' }}
                    drawable="ic_person"
                />
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}

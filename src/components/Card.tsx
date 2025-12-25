import React from 'react';
import { View, StyleSheet, ViewStyle, ViewProps, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';

interface CardProps extends ViewProps {
    children: React.ReactNode;
    style?: ViewStyle;
    intensity?: number;
}

export function Card({ children, style, intensity = 60, ...props }: CardProps) {
    return (
        <BlurView
            intensity={intensity}
            tint="light"
            style={[styles.card, style]}
            {...props}
        >
            <View style={styles.innerContent}>
                {children}
            </View>
        </BlurView>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: layout.borderRadius.xl,
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: colors.border,
        backgroundColor: colors.liquidGlass,
    },
    innerContent: {
        flex: 1,
        width: '100%',
        padding: layout.spacing.md,
    },
});

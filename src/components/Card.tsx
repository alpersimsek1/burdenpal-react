import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';

interface CardProps extends ViewProps {
    children: React.ReactNode;
    style?: ViewStyle;
    intensity?: number;
    variant?: 'default' | 'glass' | 'solid';
}

export function Card({ children, style, intensity = 50, variant = 'glass', ...props }: CardProps) {
    if (variant === 'solid') {
        return (
            <View style={[styles.solidCard, style]} {...props}>
                {children}
            </View>
        );
    }

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
        borderRadius: layout.borderRadius.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.glassBorder,
        backgroundColor: colors.glass,
    },
    solidCard: {
        borderRadius: layout.borderRadius.lg,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.borderDark,
        padding: layout.spacing.md,
    },
    innerContent: {
        flex: 1,
        width: '100%',
        padding: layout.spacing.md,
    },
});

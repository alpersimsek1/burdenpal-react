import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { typography } from '../theme/typography';

interface ButtonProps {
    onPress: () => void;
    title: string;
    variant?: 'primary' | 'secondary' | 'outline';
    style?: ViewStyle;
    disabled?: boolean;
    loading?: boolean;
}

export function Button({
    onPress,
    title,
    variant = 'primary',
    style,
    disabled,
    loading
}: ButtonProps) {

    const getBackgroundColor = () => {
        if (disabled) return colors.textSecondary + '40'; // opacity
        if (variant === 'primary') return colors.primary;
        if (variant === 'secondary') return colors.surface;
        return 'transparent';
    };

    const getTextColor = () => {
        if (disabled) return colors.surface;
        if (variant === 'primary') return colors.surface;
        return colors.primary;
    };

    const getBorder = () => {
        if (variant === 'outline') return { borderWidth: 1, borderColor: colors.primary };
        return {};
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: getBackgroundColor() },
                getBorder(),
                style
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <Text style={[styles.text, { color: getTextColor() }]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        height: 48,
        borderRadius: layout.borderRadius.circle,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: layout.spacing.lg,
    },
    text: {
        fontWeight: typography.weight.bold as any,
        fontSize: typography.size.md,
    },
});

import React from 'react';
import { View, StyleSheet, ViewStyle, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

interface ScreenProps {
    children: React.ReactNode;
    style?: ViewStyle;
    unsafe?: boolean; // If true, don't use SafeAreaView
}

export function Screen({ children, style, unsafe }: ScreenProps) {
    const Container = unsafe ? View : SafeAreaView;

    return (
        <View style={styles.root}>
            {/* Aurora Background Elements */}
            <View style={[styles.orb, styles.orb1]} />
            <View style={[styles.orb, styles.orb2]} />
            <View style={[styles.orb, styles.orb3]} />

            <Container
                style={[styles.container, style]}
                edges={['top', 'left', 'right']}
            >
                {children}
            </Container>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#F0F4F8',
        overflow: 'hidden',
    },
    container: {
        flex: 1,
    },
    orb: {
        position: 'absolute',
        borderRadius: 9999,
        filter: 'blur(80px)', // Note: standard RN doesn't support filter. We'll use large radius and opacity.
        opacity: 0.4,
    },
    orb1: {
        width: width * 1.2,
        height: width * 1.2,
        top: -width * 0.5,
        right: -width * 0.4,
        backgroundColor: colors.primaryLight,
    },
    orb2: {
        width: width,
        height: width,
        bottom: -width * 0.2,
        left: -width * 0.3,
        backgroundColor: '#E0F2FE',
    },
    orb3: {
        width: width * 0.8,
        height: width * 0.8,
        top: height * 0.3,
        left: -width * 0.4,
        backgroundColor: colors.accent + '20',
    },
});

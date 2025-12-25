import React, { forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    interpolate,
    Extrapolation,
    runOnJS,
} from 'react-native-reanimated';
import { MapPin, Briefcase } from 'lucide-react-native';
import { Card } from './Card';
import { layout } from '../theme/layout';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

interface TinderCardProps {
    item: {
        id: string;
        name: string;
        age: number;
        role: string;
        bio: string;
        location: string;
        tags: string[];
    };
    onSwipeLeft: () => void;
    onSwipeRight: () => void;
}

export interface SwipeCardRef {
    swipeLeft: () => void;
    swipeRight: () => void;
}

export const SwipeCard = forwardRef<SwipeCardRef, TinderCardProps>(({ item, onSwipeLeft, onSwipeRight }, ref) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const gesture = Gesture.Pan()
        .onUpdate((event) => {
            translateX.value = event.translationX;
            translateY.value = event.translationY;
        })
        .onEnd((event) => {
            if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
                const destX = event.translationX > 0 ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5;
                translateX.value = withSpring(destX, {}, () => {
                    if (event.translationX > 0) {
                        runOnJS(onSwipeRight)();
                    } else {
                        runOnJS(onSwipeLeft)();
                    }
                });
            } else {
                translateX.value = withSpring(0);
                translateY.value = withSpring(0);
            }
        });

    const animatedStyle = useAnimatedStyle(() => {
        const rotate = interpolate(
            translateX.value,
            [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
            [-10, 0, 10],
            Extrapolation.CLAMP
        );

        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
                { rotate: `${rotate}deg` },
            ],
        };
    });

    const likeStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            translateX.value,
            [0, SCREEN_WIDTH / 4],
            [0, 1],
            Extrapolation.CLAMP
        );
        return { opacity };
    });

    const nopeStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            translateX.value,
            [-SCREEN_WIDTH / 4, 0],
            [1, 0],
            Extrapolation.CLAMP
        );
        return { opacity };
    });

    useImperativeHandle(ref, () => ({
        swipeLeft: () => {
            translateX.value = withSpring(-SCREEN_WIDTH * 1.5, {}, () => {
                runOnJS(onSwipeLeft)();
            });
        },
        swipeRight: () => {
            translateX.value = withSpring(SCREEN_WIDTH * 1.5, {}, () => {
                runOnJS(onSwipeRight)();
            });
        },
    }));

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
            <GestureDetector gesture={gesture}>
                <Animated.View style={[styles.cardContainer, animatedStyle]}>
                    <Card style={styles.card}>
                        <Animated.View style={[styles.stamp, styles.likeStamp, likeStyle]}>
                            <Text style={styles.likeText}>REQUEST</Text>
                        </Animated.View>
                        <Animated.View style={[styles.stamp, styles.nopeStamp, nopeStyle]}>
                            <Text style={styles.nopeText}>LATER</Text>
                        </Animated.View>

                        <View style={styles.content}>
                            <View style={styles.header}>
                                <Text style={styles.name}>{item.name}, {item.age}</Text>
                                <Text style={styles.role}>{item.role}</Text>
                            </View>

                            <View style={styles.row}>
                                <MapPin size={16} color={colors.textSecondary} />
                                <Text style={styles.detailText}>{item.location}</Text>
                            </View>

                            <View style={styles.tags}>
                                {item.tags.map((tag, i) => (
                                    <View key={i} style={styles.tag}>
                                        <Text style={styles.tagText}>{tag}</Text>
                                    </View>
                                ))}
                            </View>

                            <View style={styles.divider} />

                            <Text style={styles.bio}>{item.bio}</Text>
                        </View>
                    </Card>
                </Animated.View>
            </GestureDetector>
        </View>
    );
});

const styles = StyleSheet.create({
    cardContainer: {
        width: '100%',
        height: SCREEN_HEIGHT * 0.65, // Longer card
        justifyContent: 'center',
        alignItems: 'center',
        padding: layout.spacing.lg,
        marginTop: 20,
    },
    card: {
        width: '100%',
        height: '100%',
        padding: layout.spacing.xl,
    },
    content: {
        flex: 1,
        gap: layout.spacing.md,
    },
    header: {
        marginBottom: layout.spacing.xs,
    },
    name: {
        fontSize: typography.size.xxl,
        fontWeight: typography.weight.bold as any,
        color: colors.textPrimary,
    },
    role: {
        fontSize: typography.size.md,
        fontWeight: typography.weight.medium as any,
        color: colors.primary,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    detailText: {
        fontSize: typography.size.sm,
        color: colors.textSecondary,
    },
    tags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tag: {
        backgroundColor: colors.background,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.borderDark,
    },
    tagText: {
        fontSize: 12,
        color: colors.textSecondary,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: colors.borderDark,
        opacity: 0.5,
        marginVertical: 4,
    },
    bio: {
        fontSize: typography.size.md,
        color: colors.textPrimary,
        lineHeight: 24,
    },
    stamp: {
        position: 'absolute',
        top: 40,
        zIndex: 10,
        borderWidth: 4,
        borderRadius: 8,
        padding: 8,
        transform: [{ rotate: '-15deg' }],
    },
    likeStamp: {
        left: 40,
        borderColor: '#4ADE80', // Green
        transform: [{ rotate: '-15deg' }],
    },
    nopeStamp: {
        right: 40,
        borderColor: '#EF4444', // Red
        transform: [{ rotate: '15deg' }],
    },
    likeText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#4ADE80',
        letterSpacing: 2,
    },
    nopeText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#EF4444',
        letterSpacing: 2,
    },
});

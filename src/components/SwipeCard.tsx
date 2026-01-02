import { Clock, Handshake } from 'lucide-react-native';
import React, { forwardRef, useImperativeHandle } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    Extrapolation,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { layout } from '../theme/layout';
import { typography } from '../theme/typography';

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
        feelings: { label: string; subtext: string }[];
        color: string;
        accent: string;
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
                    <View style={[styles.card, { backgroundColor: item.color }]}>
                        {/* Swipable Stamps */}
                        <Animated.View style={[styles.stamp, styles.likeStamp, likeStyle]}>
                            <Text style={styles.likeText}>Feeling Same</Text>
                        </Animated.View>
                        <Animated.View style={[styles.stamp, styles.nopeStamp, nopeStyle]}>
                            <Text style={styles.nopeText}>Not Today</Text>
                        </Animated.View>

                        <View style={styles.content}>
                            {/* Header: Name moved to top */}
                            <View style={styles.headerSection}>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.subHeaderText}>{item.age} • {item.role}</Text>
                            </View>

                            {/* Divider / Spacer */}
                            <View style={styles.spacer} />

                            {/* Center: Feelings Side by Side */}
                            <View style={styles.moodSection}>
                                <Text style={styles.moodLabel}>CURRENTLY FEELING</Text>
                                <View style={styles.feelingsContainer}>
                                    {item.feelings.map((feeling, index) => (
                                        <View key={index} style={styles.feelingItem}>
                                            <Text style={styles.feelingLabel}>{feeling.label}</Text>
                                            <Text style={styles.feelingSubtext}>{feeling.subtext}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            {/* Spacer */}
                            <View style={styles.miniSpacer} />

                            {/* Tags */}
                            <View style={styles.tags}>
                                {item.tags.slice(0, 2).map((tag, i) => (
                                    <View key={i} style={styles.tag}>
                                        <Text style={styles.tagText}>{tag}</Text>
                                    </View>
                                ))}
                            </View>

                            {/* Footer Actions / Info */}
                            <View style={styles.footerRow}>
                                <View style={styles.iconButton}>
                                    <Clock size={24} color="#FFF" />
                                </View>
                                <View style={[styles.iconButton, { backgroundColor: '#FFF' }]}>
                                    <Handshake size={24} color={item.color} />
                                </View>
                            </View>
                        </View>
                    </View>
                </Animated.View>
            </GestureDetector>
        </View>
    );
});

const styles = StyleSheet.create({
    cardContainer: {
        width: '100%',
        height: SCREEN_HEIGHT * 0.65, // Slightly taller
        justifyContent: 'center',
        alignItems: 'center',
        padding: layout.spacing.lg,
        marginTop: 20,
    },
    card: {
        width: '100%',
        flex: 1,
        borderRadius: 32,
        padding: layout.spacing.xl,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.25,
        shadowRadius: 24,
        elevation: 12,
        alignItems: 'center',
    },
    content: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: layout.spacing.md,
    },
    headerSection: {
        alignItems: 'center',
        marginTop: layout.spacing.sm,
        gap: 4,
    },
    name: {
        fontSize: 36, // Larger name
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    subHeaderText: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '500',
    },
    moodSection: {
        width: '100%',
        alignItems: 'center',
        gap: 16,
    },
    moodLabel: {
        fontSize: typography.size.xs,
        color: 'rgba(255,255,255,0.7)',
        letterSpacing: 2.5,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    feelingsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 32,
        flexWrap: 'wrap',
    },
    feelingItem: {
        alignItems: 'center',
        gap: 4,
    },
    feelingLabel: {
        fontSize: 32, // Reduced for side-by-side
        fontWeight: '300',
        color: '#fff',
        fontStyle: 'italic',
        lineHeight: 40,
        textAlign: 'center',
    },
    feelingSubtext: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        fontWeight: '500',
        textAlign: 'center',
        maxWidth: 120, // Prevent wide text from breaking layout
    },
    tags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
    },
    tag: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    tagText: {
        fontSize: typography.size.sm,
        color: '#fff',
        fontWeight: '600',
    },
    spacer: {
        width: 40,
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 2,
        alignSelf: 'center',
    },
    miniSpacer: {
        height: 20,
    },
    footerRow: {
        flexDirection: 'row',
        gap: 40,
        marginTop: 30,
        alignItems: 'center',
    },
    iconButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    stamp: {
        position: 'absolute',
        top: 50,
        zIndex: 100,
        borderWidth: 4,
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: 'rgba(0,0,0,0.2)', // Semi-transparent background for contrast
    },
    likeStamp: {
        right: 40,
        borderColor: '#4ADE80',
        transform: [{ rotate: '-15deg' }],
    },
    nopeStamp: {
        left: 40,
        borderColor: '#EF4444',
        transform: [{ rotate: '15deg' }],
    },
    likeText: {
        fontSize: 24,
        fontWeight: '900',
        color: '#4ADE80',
        textTransform: 'uppercase',
    },
    nopeText: {
        fontSize: 24,
        fontWeight: '900',
        color: '#EF4444',
        textTransform: 'uppercase',
    },
});

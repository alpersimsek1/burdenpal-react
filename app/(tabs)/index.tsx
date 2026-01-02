import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Bell, Heart, Layers, MessageCircle, Sparkles, User, Users, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
    Extrapolation,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { ProfileButton } from '../../src/components/ProfileButton';
import { colors } from '../../src/theme/colors';
import { layout } from '../../src/theme/layout';
import { typography } from '../../src/theme/typography';

const BG_PAL = require('../../assets/backgrounds/bg_pal.png');

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const TAB_BAR_HEIGHT = 100;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

// Mock Pal data with feelings, hobbies, and ideals
const MOCK_PALS = [
    {
        id: '1',
        name: 'Sarah Chen',
        avatar: require('../../assets/avatars/female1.png'),
        isAvailable: true,
        rating: 4.8,
        feeling: 'Hopeful & Curious',
        hobbies: 'Hiking • Photography • Cooking',
        ideals: 'Growth mindset • Authenticity • Kindness',
        mutualConnections: [
            require('../../assets/avatars/male1.png'),
            require('../../assets/avatars/male2.png'),
        ]
    },
    {
        id: '2',
        name: 'Marcus Johnson',
        avatar: require('../../assets/avatars/male1.png'),
        isAvailable: true,
        rating: 4.9,
        feeling: 'Peaceful & Content',
        hobbies: 'Music • Reading • Yoga',
        ideals: 'Compassion • Balance • Learning',
        mutualConnections: [
            require('../../assets/avatars/female1.png'),
            require('../../assets/avatars/female2.png'),
        ]
    },
    {
        id: '3',
        name: 'Emma Williams',
        avatar: require('../../assets/avatars/female2.png'),
        isAvailable: false,
        rating: 4.7,
        feeling: 'Energetic & Inspired',
        hobbies: 'Painting • Dancing • Traveling',
        ideals: 'Creativity • Adventure • Connection',
        mutualConnections: [
            require('../../assets/avatars/male1.png'),
            require('../../assets/avatars/female1.png'),
        ]
    },
    {
        id: '4',
        name: 'David Kim',
        avatar: require('../../assets/avatars/male2.png'),
        isAvailable: true,
        rating: 5.0,
        feeling: 'Calm & Reflective',
        hobbies: 'Meditation • Writing • Chess',
        ideals: 'Wisdom • Patience • Empathy',
        mutualConnections: [
            require('../../assets/avatars/female2.png'),
            require('../../assets/avatars/male1.png'),
        ]
    },
];

// Recent chats mock data
const RECENT_CHATS = [
    {
        id: '1',
        name: 'Sarah Chen',
        avatar: require('../../assets/avatars/female1.png'),
        lastMessage: 'That sounds like a great idea! Let me know how it goes.',
        time: '2m ago',
        unread: 2,
    },
    {
        id: '2',
        name: 'Marcus Johnson',
        avatar: require('../../assets/avatars/male1.png'),
        lastMessage: 'Thanks for sharing that with me. I really appreciate it.',
        time: '1h ago',
        unread: 0,
    },
    {
        id: '3',
        name: 'Emma Williams',
        avatar: require('../../assets/avatars/female2.png'),
        lastMessage: 'How are you feeling today?',
        time: '3h ago',
        unread: 1,
    },
];

// Tab types
type TabType = 'pal' | 'mentor' | 'circles';

// Swipeable Pal Card Component
function SwipeablePalCard({
    pal,
    onSwipeLeft,
    onSwipeRight
}: {
    pal: typeof MOCK_PALS[0];
    onSwipeLeft: () => void;
    onSwipeRight: () => void;
}) {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const gesture = Gesture.Pan()
        .onUpdate((event) => {
            translateX.value = event.translationX;
            translateY.value = event.translationY * 0.5;
        })
        .onEnd((event) => {
            if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
                const destX = event.translationX > 0 ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5;
                translateX.value = withTiming(destX, { duration: 250 }, () => {
                    if (event.translationX > 0) {
                        runOnJS(onSwipeRight)();
                    } else {
                        runOnJS(onSwipeLeft)();
                    }
                });
            } else {
                translateX.value = withSpring(0, { damping: 20, stiffness: 300 });
                translateY.value = withSpring(0, { damping: 20, stiffness: 300 });
            }
        });

    const animatedCardStyle = useAnimatedStyle(() => {
        const rotate = interpolate(
            translateX.value,
            [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
            [-15, 0, 15],
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

    const likeOverlayStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            translateX.value,
            [0, SCREEN_WIDTH / 4],
            [0, 0.8],
            Extrapolation.CLAMP
        );
        return { opacity };
    });

    const nopeOverlayStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            translateX.value,
            [-SCREEN_WIDTH / 4, 0],
            [0.8, 0],
            Extrapolation.CLAMP
        );
        return { opacity };
    });

    const handleButtonSwipeLeft = () => {
        translateX.value = withTiming(-SCREEN_WIDTH * 1.5, { duration: 250 }, () => {
            runOnJS(onSwipeLeft)();
        });
    };

    const handleButtonSwipeRight = () => {
        translateX.value = withTiming(SCREEN_WIDTH * 1.5, { duration: 250 }, () => {
            runOnJS(onSwipeRight)();
        });
    };

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View style={[styles.palCardContainer, animatedCardStyle]}>
                <ImageBackground
                    source={pal.avatar}
                    style={styles.palCardBackground}
                    resizeMode="cover"
                >
                    {/* Like overlay */}
                    <Animated.View style={[styles.swipeOverlay, styles.likeOverlay, likeOverlayStyle]}>
                        <View style={styles.swipeStamp}>
                            <Text style={styles.swipeStampTextLike}>CONNECT</Text>
                        </View>
                    </Animated.View>

                    {/* Nope overlay */}
                    <Animated.View style={[styles.swipeOverlay, styles.nopeOverlay, nopeOverlayStyle]}>
                        <View style={styles.swipeStamp}>
                            <Text style={styles.swipeStampTextNope}>PASS</Text>
                        </View>
                    </Animated.View>

                    {/* Spacer for top area */}
                    <View style={{ flex: 1 }} />

                    {/* Bottom gradient overlay with info */}
                    <LinearGradient
                        colors={['transparent', 'rgba(255,255,255,0.85)', 'rgba(255,255,255,0.98)']}
                        style={styles.palCardBottomGradient}
                    >
                        {/* Name */}
                        <Text style={styles.palName}>{pal.name}</Text>

                        {/* Info chips */}
                        <View style={styles.infoChipsContainer}>
                            <View style={styles.infoChip}>
                                <Text style={styles.infoChipIcon}>💭</Text>
                                <Text style={styles.infoChipText}>{pal.feeling}</Text>
                            </View>
                            <View style={styles.infoChip}>
                                <Text style={styles.infoChipIcon}>✨</Text>
                                <Text style={styles.infoChipText}>{pal.hobbies}</Text>
                            </View>
                            <View style={styles.infoChip}>
                                <Text style={styles.infoChipIcon}>💫</Text>
                                <Text style={styles.infoChipText}>{pal.ideals}</Text>
                            </View>
                        </View>

                        {/* Action buttons */}
                        <View style={styles.actionButtonsContainer}>
                            <TouchableOpacity
                                style={styles.rejectButton}
                                onPress={handleButtonSwipeLeft}
                                activeOpacity={0.8}
                            >
                                <X size={28} color={colors.textSecondary} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.acceptButton}
                                onPress={handleButtonSwipeRight}
                                activeOpacity={0.8}
                            >
                                <Heart size={28} color="#FFF" fill="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                </ImageBackground>
            </Animated.View>
        </GestureDetector>
    );
}

export default function PalScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('pal');
    const [viewMode, setViewMode] = useState<'cards' | 'messages'>('cards');
    const [likedPals, setLikedPals] = useState<string[]>([]);
    const [rejectedPals, setRejectedPals] = useState<string[]>([]);

    // Filter out liked and rejected pals
    const availablePals = MOCK_PALS.filter(
        pal => !likedPals.includes(pal.id) && !rejectedPals.includes(pal.id)
    );

    const handleSwipeLeft = (palId: string) => {
        setRejectedPals(prev => [...prev, palId]);
    };

    const handleSwipeRight = (palId: string) => {
        setLikedPals(prev => [...prev, palId]);
    };

    const toggleViewMode = () => {
        setViewMode(prev => prev === 'cards' ? 'messages' : 'cards');
    };

    const getTabTitle = () => {
        switch (activeTab) {
            case 'pal': return 'Pal';
            case 'mentor': return 'Mentor';
            case 'circles': return 'Circles';
        }
    };

    const renderCirclesComingSoon = () => (
        <View style={styles.comingSoonContainer}>
            <View style={styles.heroBox}>
                <Text style={styles.heroTitle}>COMING SOON</Text>
                <Text style={styles.heroSubtitle}>
                    FIND YOUR CIRCLE.{'\n'}
                    CONNECT WITH LIKE-{'\n'}
                    MINDED PEOPLE.
                </Text>
            </View>

            <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>FEATURE PREVIEW</Text>
                <View style={styles.featureItem}>
                    <Text style={styles.featureBullet}>01 /</Text>
                    <Text style={styles.featureText}>SMART MATCHING ALGORITHM</Text>
                </View>
                <View style={styles.featureItem}>
                    <Text style={styles.featureBullet}>02 /</Text>
                    <Text style={styles.featureText}>SHARED INTERESTS & GOALS</Text>
                </View>
                <View style={styles.featureItem}>
                    <Text style={styles.featureBullet}>03 /</Text>
                    <Text style={styles.featureText}>SAFE & SUPPORTIVE SPACE</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.notifyButton} activeOpacity={0.8}>
                <Bell size={20} color={colors.textPrimary} style={{ marginRight: 10 }} />
                <Text style={styles.notifyButtonText}>NOTIFY ME WHEN READY</Text>
            </TouchableOpacity>
        </View>
    );

    const renderNoMoreCards = () => (
        <View style={styles.noMoreCardsContainer}>
            <BlurView intensity={50} tint="light" style={styles.noMoreCardsCard}>
                <Text style={styles.noMoreCardsEmoji}>🎉</Text>
                <Text style={styles.noMoreCardsTitle}>You've seen everyone!</Text>
                <Text style={styles.noMoreCardsSubtitle}>
                    Check back later for new pals
                </Text>
                <TouchableOpacity
                    style={styles.resetButton}
                    onPress={() => {
                        setLikedPals([]);
                        setRejectedPals([]);
                    }}
                >
                    <Text style={styles.resetButtonText}>Start Over</Text>
                </TouchableOpacity>
            </BlurView>
        </View>
    );

    const renderRecentChats = () => (
        <View style={styles.recentChatsContainer}>
            <View style={styles.recentChatsHeader}>
                <Text style={styles.recentChatsTitle}>Recent Conversations</Text>
            </View>
            <ScrollView
                style={styles.chatsList}
                contentContainerStyle={styles.chatsListContent}
                showsVerticalScrollIndicator={false}
            >
                {RECENT_CHATS.map((chat) => (
                    <TouchableOpacity
                        key={chat.id}
                        style={styles.chatItem}
                        onPress={() => router.push({ pathname: '/chat-detail', params: { id: chat.id, name: chat.name } })}
                        activeOpacity={0.7}
                    >
                        <Image source={chat.avatar} style={styles.chatAvatar} />
                        <View style={styles.chatContent}>
                            <View style={styles.chatHeader}>
                                <Text style={styles.chatName}>{chat.name}</Text>
                                <Text style={styles.chatTime}>{chat.time}</Text>
                            </View>
                            <Text style={styles.chatMessage} numberOfLines={1}>
                                {chat.lastMessage}
                            </Text>
                        </View>
                        {chat.unread > 0 && (
                            <View style={styles.unreadBadge}>
                                <Text style={styles.unreadText}>{chat.unread}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );

    const renderCardStack = () => {
        // Render up to 3 cards in a stack
        const cardsToRender = availablePals.slice(0, 3);

        return (
            <View style={styles.cardStackWrapper}>
                {cardsToRender.map((pal, index) => {
                    // Calculate scale and offset for stack effect
                    const scale = 1 - (index * 0.04);
                    const translateY = index * 12;

                    // Only the top card (index 0) is swipeable
                    if (index === 0) {
                        return (
                            <SwipeablePalCard
                                key={pal.id}
                                pal={pal}
                                onSwipeLeft={() => handleSwipeLeft(pal.id)}
                                onSwipeRight={() => handleSwipeRight(pal.id)}
                            />
                        );
                    }

                    // Background cards are static
                    return (
                        <View
                            key={pal.id}
                            style={[
                                styles.backgroundCard,
                                {
                                    transform: [
                                        { scale },
                                        { translateY },
                                    ],
                                    zIndex: -index,
                                }
                            ]}
                        >
                            <ImageBackground
                                source={pal.avatar}
                                style={styles.palCardBackground}
                                resizeMode="cover"
                            >
                                <LinearGradient
                                    colors={['transparent', 'rgba(255,255,255,0.85)', 'rgba(255,255,255,0.98)']}
                                    style={styles.backgroundCardGradient}
                                >
                                    <Text style={styles.backgroundCardName}>{pal.name}</Text>
                                </LinearGradient>
                            </ImageBackground>
                        </View>
                    );
                }).reverse()}
            </View>
        );
    };

    const renderCardContent = () => {
        if (activeTab === 'circles') {
            return renderCirclesComingSoon();
        }

        if (viewMode === 'messages') {
            return renderRecentChats();
        }

        return (
            <View style={styles.cardsContainer}>
                {availablePals.length > 0 ? (
                    renderCardStack()
                ) : (
                    renderNoMoreCards()
                )}
            </View>
        );
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <LinearGradient
                colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
                style={styles.container}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        {/* Left side - View toggle button (icon only) */}
                        {activeTab !== 'circles' && (
                            <TouchableOpacity
                                style={[
                                    styles.viewToggleButton,
                                    viewMode === 'messages' && styles.viewToggleButtonActive
                                ]}
                                onPress={toggleViewMode}
                            >
                                {viewMode === 'cards' ? (
                                    <MessageCircle size={20} color={colors.textPrimary} />
                                ) : (
                                    <Layers size={20} color={colors.accent} />
                                )}
                            </TouchableOpacity>
                        )}
                        {activeTab === 'circles' && <View style={{ width: 44 }} />}

                        {/* Center - Tab navigation with icons */}
                        <BlurView intensity={40} tint="light" style={styles.tabContainer}>
                            <TouchableOpacity
                                style={[styles.tabButton, activeTab === 'pal' && styles.activeTabButton]}
                                onPress={() => setActiveTab('pal')}
                            >
                                {activeTab === 'pal' ? (
                                    <Text style={styles.activeTabText}>Pal</Text>
                                ) : (
                                    <User size={20} color={colors.textSecondary} />
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.tabButton, activeTab === 'mentor' && styles.activeTabButton]}
                                onPress={() => setActiveTab('mentor')}
                            >
                                {activeTab === 'mentor' ? (
                                    <Text style={styles.activeTabText}>Mentor</Text>
                                ) : (
                                    <Sparkles size={20} color={colors.textSecondary} />
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.tabButton, activeTab === 'circles' && styles.activeTabButton]}
                                onPress={() => setActiveTab('circles')}
                            >
                                {activeTab === 'circles' ? (
                                    <Text style={styles.activeTabText}>Circles</Text>
                                ) : (
                                    <Users size={20} color={colors.textSecondary} />
                                )}
                            </TouchableOpacity>
                        </BlurView>

                        {/* Right side - Profile button */}
                        <ProfileButton />
                    </View>
                </View>

                {/* Content */}
                {renderCardContent()}
            </LinearGradient>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: layout.spacing.lg,
        paddingTop: 60,
        paddingBottom: layout.spacing.sm,
        zIndex: 10,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    viewToggleButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.glass,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.glassBorder,
    },
    viewToggleButtonActive: {
        backgroundColor: colors.glassOverlay,
        borderColor: colors.accent,
    },
    tabContainer: {
        flexDirection: 'row',
        padding: 4,
        borderRadius: layout.borderRadius.xl,
        borderWidth: 1,
        borderColor: colors.glassBorder,
        overflow: 'hidden',
    },
    tabButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: layout.borderRadius.lg,
        minWidth: 50,
    },
    activeTabButton: {
        backgroundColor: colors.textPrimary,
        paddingHorizontal: 20,
    },
    activeTabText: {
        fontSize: typography.size.sm,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    // Cards Container
    cardsContainer: {
        flex: 1,
        paddingBottom: TAB_BAR_HEIGHT,
    },
    // Card stack wrapper
    cardStackWrapper: {
        flex: 1,
        position: 'relative',
    },
    // Background card styles for stacked cards
    backgroundCard: {
        position: 'absolute',
        top: 0,
        left: layout.spacing.md,
        right: layout.spacing.md,
        bottom: layout.spacing.md,
        borderRadius: layout.borderRadius.xl,
        overflow: 'hidden',
        backgroundColor: colors.surface,
    },
    backgroundCardGradient: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: layout.spacing.lg,
        paddingBottom: 100,
    },
    backgroundCardName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.textPrimary,
        opacity: 0.6,
    },
    // Pal Card Styles
    palCardContainer: {
        position: 'absolute',
        top: 0,
        left: layout.spacing.md,
        right: layout.spacing.md,
        bottom: layout.spacing.md,
        borderRadius: layout.borderRadius.xl,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 24,
        elevation: 10,
        zIndex: 10,
        backgroundColor: colors.surface,
    },
    palCardBackground: {
        flex: 1,
        justifyContent: 'space-between',
    },
    swipeOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    likeOverlay: {
        backgroundColor: 'rgba(154, 184, 154, 0.3)',
    },
    nopeOverlay: {
        backgroundColor: 'rgba(212, 165, 165, 0.3)',
    },
    swipeStamp: {
        borderWidth: 4,
        borderRadius: 12,
        padding: 16,
        backgroundColor: 'rgba(255,255,255,0.9)',
    },
    swipeStampTextLike: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.success,
        letterSpacing: 3,
    },
    swipeStampTextNope: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.error,
        letterSpacing: 3,
    },
    palCardTopBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: layout.spacing.md,
        paddingTop: layout.spacing.md,
    },
    availabilityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        overflow: 'hidden',
    },
    availabilityDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    availabilityText: {
        fontSize: typography.size.sm,
        fontWeight: '500',
        color: colors.textPrimary,
    },
    mutualConnectionsContainer: {
        position: 'absolute',
        right: layout.spacing.md,
        top: '40%',
        alignItems: 'center',
    },
    mutualAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 3,
        borderColor: '#FFF',
    },
    palCardBottomGradient: {
        paddingHorizontal: layout.spacing.lg,
        paddingTop: 60,
        paddingBottom: layout.spacing.lg,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end',
        gap: 4,
        marginBottom: 8,
    },
    ratingLeaf: {
        fontSize: 16,
    },
    ratingValue: {
        fontSize: typography.size.lg,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    ratingLabel: {
        fontSize: typography.size.xs,
        color: colors.textSecondary,
    },
    palName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: layout.spacing.md,
    },
    infoChipsContainer: {
        gap: 8,
        marginBottom: layout.spacing.lg,
    },
    infoChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: colors.glass,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 16,
        alignSelf: 'flex-start',
    },
    infoChipIcon: {
        fontSize: 16,
    },
    infoChipText: {
        fontSize: typography.size.sm,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 24,
        marginTop: layout.spacing.md,
    },
    rejectButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        borderWidth: 1,
        borderColor: colors.borderDark,
    },
    acceptButton: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: colors.accent,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.accent,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
        elevation: 8,
    },
    // No more cards state
    noMoreCardsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: layout.spacing.xl,
    },
    noMoreCardsCard: {
        padding: layout.spacing.xl,
        borderRadius: layout.borderRadius.lg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.glassBorder,
        overflow: 'hidden',
    },
    noMoreCardsEmoji: {
        fontSize: 64,
        marginBottom: layout.spacing.lg,
    },
    noMoreCardsTitle: {
        fontSize: typography.size.xl,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: layout.spacing.sm,
    },
    noMoreCardsSubtitle: {
        fontSize: typography.size.md,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: layout.spacing.lg,
    },
    resetButton: {
        backgroundColor: colors.textPrimary,
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: layout.borderRadius.xl,
    },
    resetButtonText: {
        fontSize: typography.size.md,
        fontWeight: '600',
        color: '#FFF',
    },
    // Recent Chats Styles
    recentChatsContainer: {
        flex: 1,
        paddingHorizontal: layout.spacing.lg,
    },
    recentChatsHeader: {
        paddingVertical: layout.spacing.md,
    },
    recentChatsTitle: {
        fontSize: typography.size.lg,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    chatsList: {
        flex: 1,
    },
    chatsListContent: {
        paddingBottom: TAB_BAR_HEIGHT + layout.spacing.lg,
        gap: layout.spacing.sm,
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: layout.spacing.md,
        backgroundColor: colors.glass,
        borderRadius: layout.borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.glassBorder,
    },
    chatAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        marginRight: layout.spacing.md,
    },
    chatContent: {
        flex: 1,
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    chatName: {
        fontSize: typography.size.md,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    chatTime: {
        fontSize: typography.size.xs,
        color: colors.textSecondary,
    },
    chatMessage: {
        fontSize: typography.size.sm,
        color: colors.textSecondary,
    },
    unreadBadge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.accent,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: layout.spacing.sm,
    },
    unreadText: {
        fontSize: typography.size.xs,
        fontWeight: 'bold',
        color: '#FFF',
    },
    // Coming Soon styles
    comingSoonContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: layout.spacing.xl,
        paddingBottom: TAB_BAR_HEIGHT,
        gap: 40,
    },
    heroBox: {
        gap: 16,
    },
    heroTitle: {
        fontSize: 42,
        fontWeight: '900',
        color: colors.textPrimary,
        letterSpacing: -1,
    },
    heroSubtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textSecondary,
        lineHeight: 28,
        letterSpacing: 0.5,
    },
    infoBox: {
        gap: 16,
        padding: 24,
        borderWidth: 1,
        borderColor: colors.borderDark,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    infoLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.textSecondary,
        marginBottom: 8,
        letterSpacing: 1,
    },
    featureItem: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
    },
    featureBullet: {
        fontSize: 14,
        fontFamily: 'Courier',
        color: colors.textSecondary,
        fontWeight: 'bold',
    },
    featureText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.textPrimary,
        letterSpacing: 0.5,
    },
    notifyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        borderWidth: 1,
        borderColor: colors.textPrimary,
        backgroundColor: colors.surfaceWarm,
    },
    notifyButtonText: {
        fontSize: 14,
        fontWeight: '900',
        color: colors.textPrimary,
        letterSpacing: 1,
    },
});

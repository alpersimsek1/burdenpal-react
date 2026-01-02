import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Bell, CalendarX, Handshake, Layers, MessageCircle, Sparkles, User, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
        name: 'SARAH CHEN',
        age: 24,
        avatar: require('../../assets/avatars/female1.png'),
        image: require('../../assets/feelings/lost.png'),
        isAvailable: true,
        rating: 4.8,
        feelings: [
            { keyword: 'Lost.', description: "Don't know which way to go" },
            { keyword: 'Stuck.', description: "I feel stuck" }
        ],
        bio: "I feel like I'm standing at a crossroads in the fog.",
        color: '#2F5266', // Deep Teal
        accent: '#5C8D9E',
        hobbies: 'Hiking • Photography',
        ideals: 'Growth • Authenticity',
        mutualConnections: [
            require('../../assets/avatars/male1.png'),
            require('../../assets/avatars/male2.png'),
        ]
    },
    {
        id: '2',
        name: 'MARCUS JOHNSON',
        age: 29,
        avatar: require('../../assets/avatars/male1.png'),
        image: require('../../assets/feelings/overwhelmed.png'),
        isAvailable: true,
        rating: 4.9,
        feelings: [
            { keyword: 'Heavy.', description: "Everything feels a bit too much" }
        ],
        bio: "The weight of expectations is crushing me lately. I'm carrying everyone else's problems and forgetting how to handle my own.",
        color: '#9E5A5A', // Muted Red
        accent: '#D18C8C',
        hobbies: 'Music • Yoga',
        ideals: 'Balance • Compassion',
        mutualConnections: [
            require('../../assets/avatars/female1.png'),
        ]
    },
    {
        id: '3',
        name: 'EMMA WILLIAMS',
        age: 26,
        avatar: require('../../assets/avatars/female2.png'),
        image: require('../../assets/feelings/hollow.png'),
        isAvailable: false,
        rating: 4.7,
        feelings: [
            { keyword: 'Hollow.', description: "I feel lonely" }
        ],
        bio: "Waking up feels like climbing a mountain every single day. I just want to find a reason to smile again genuinely.",
        color: '#5D5C8D', // Muted Purple
        accent: '#8E8DB6',
        hobbies: 'Painting • Reading',
        ideals: 'Connection • Peace',
        mutualConnections: []
    },
    {
        id: '4',
        name: 'DAVID KIM',
        age: 31,
        avatar: require('../../assets/avatars/male2.png'),
        image: require('../../assets/feelings/calm.png'),
        isAvailable: true,
        rating: 5.0,
        feelings: [
            { keyword: 'Stable.', description: "I'm okay but want to talk" }
        ],
        bio: "I've found some ground recently, but I want to ensure I don't lose it. Looking for meaningful conversations to keep grounded.",
        color: '#3EC5A7', // Palette Green
        accent: '#84DCC8',
        hobbies: 'Meditation • Chess',
        ideals: 'Wisdom • Patience',
        mutualConnections: []
    },
    {
        id: '5',
        name: 'OLIVIA BROWN',
        age: 27,
        avatar: require('../../assets/avatars/female1.png'),
        image: require('../../assets/feelings/lonely.png'),
        isAvailable: true,
        rating: 4.9,
        feelings: [
            { keyword: 'Lonely.', description: "I feel lonely" }
        ],
        bio: "Surrounded by people but feeling completely disconnected. I miss having a real, raw connection with someone.",
        color: '#2F3A56', // Deep Navy
        accent: '#5F6C80',
        hobbies: 'Gardening • Baking',
        ideals: 'Hope • Patience',
        mutualConnections: []
    },
    {
        id: '6',
        name: 'JAMES WILSON',
        age: 22,
        avatar: require('../../assets/avatars/male1.png'),
        image: require('../../assets/feelings/stuck.png'),
        isAvailable: true,
        rating: 4.6,
        feelings: [
            { keyword: 'Stuck.', description: "I feel stuck" },
            { keyword: 'Tired.', description: "Mentally tired" }
        ],
        bio: "I'm spinning my wheels and going nowhere.",
        color: '#D6B07C', // Warm Gold
        accent: '#EED9B8',
        hobbies: 'Gaming • Movies',
        ideals: 'Focus • Balance',
        mutualConnections: []
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
type TabType = 'pal' | 'circles';

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

    const likeOverlayStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            translateX.value,
            [0, SCREEN_WIDTH / 4],
            [0, 1],
            Extrapolation.CLAMP
        );
        return { opacity };
    });

    const nopeOverlayStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            translateX.value,
            [-SCREEN_WIDTH / 4, 0],
            [1, 0],
            Extrapolation.CLAMP
        );
        return { opacity };
    });

    const handleButtonSwipeLeft = () => {
        translateX.value = withTiming(-SCREEN_WIDTH * 1.5, { duration: 250 }, () => {
            runOnJS(onSwipeLeft)();
        });
    };

    // Use solid color
    const cardColor = (pal as any).color || '#2F5266';
    const cardAccent = (pal as any).accent || 'rgba(255,255,255,0.2)';

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View style={[styles.palCardContainer, animatedCardStyle]}>
                <View style={[styles.palCardBackground, { backgroundColor: cardColor }]}>

                    {/* Top Image Placeholder Area (45%) */}
                    <View style={styles.cardImagePlaceholder}>
                        <Image
                            source={(pal as any).image}
                            style={styles.cardImage}
                            resizeMode="cover"
                        />
                        <LinearGradient
                            colors={['transparent', cardColor]}
                            style={styles.imageGradientOverlay}
                            start={{ x: 0, y: 0.3 }}
                            end={{ x: 0, y: 1 }}
                        />
                    </View>

                    {/* Like overlay */}
                    <Animated.View style={[styles.swipeOverlay, styles.likeOverlay, likeOverlayStyle]}>
                        <Text style={styles.swipeStampTextLike}>SAME HERE</Text>
                    </Animated.View>

                    {/* Nope overlay */}
                    <Animated.View style={[styles.swipeOverlay, styles.nopeOverlay, nopeOverlayStyle]}>
                        <Text style={styles.swipeStampTextNope}>NOT TODAY</Text>
                    </Animated.View>

                    {/* Bottom Metadata Content (55%) */}
                    <View style={styles.cardContentNew}>
                        {/* Header Row: Name & Age */}
                        <View style={styles.cardHeaderRow}>
                            <Text style={styles.cardNameSmall}>{pal.name}</Text>
                            <Text style={styles.cardAge}>{(pal as any).age}</Text>
                        </View>


                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            {(pal as any).feelings.length > 1 ? (
                                <>
                                    <View style={styles.feelingsRow}>
                                        {(pal as any).feelings.map((f: any, i: number) => (
                                            <Text key={i} style={styles.hugeFeelingTitleSmall}>{f.keyword}</Text>
                                        ))}
                                    </View>
                                    <View style={styles.thinDivider} />
                                    <View style={{ gap: 12 }}>
                                        {(pal as any).feelings.map((f: any, i: number) => (
                                            <Text key={i} style={styles.bioText}>{f.description}</Text>
                                        ))}
                                    </View>
                                </>
                            ) : (
                                <>
                                    <Text style={styles.hugeFeelingTitle}>{(pal as any).feelings[0].keyword}</Text>
                                    <View style={styles.thinDivider} />
                                    <Text style={styles.bioText}>{(pal as any).feelings[0].description}</Text>
                                </>
                            )}
                        </View>

                        {/* Bottom Tags */}
                        <View style={styles.bottomTagsRow}>
                            {pal.hobbies.split('•').map((tag, i) => (
                                <View key={i} style={[styles.pillTag, { borderColor: cardAccent }]}>
                                    <Text style={styles.pillTagText}>{tag.trim().toUpperCase()}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Action Buttons Row */}
                        <View style={styles.actionButtonsRow}>
                            <TouchableOpacity style={[styles.actionButton, styles.nopeButton]} onPress={() => handleButtonSwipeLeft()}>
                                <CalendarX size={32} color="#FFF" />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.actionButton, styles.likeButton]} onPress={() => {
                                translateX.value = withTiming(SCREEN_WIDTH * 1.5, { duration: 250 }, () => {
                                    runOnJS(onSwipeRight)();
                                });
                            }}>
                                <Handshake size={32} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
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
            <Image
                source={require('../../assets/backgrounds/bg_pal.png')}
                style={StyleSheet.absoluteFillObject}
                resizeMode="cover"
                blurRadius={20}
            />
            <View style={styles.noMoreCardsContent}>
                <View style={styles.emptyStateIconContainer}>
                    <Users size={64} color={colors.textSecondary} />
                </View>
                <Text style={styles.noMoreCardsTitle}>That's everyone for now</Text>
                <Text style={styles.noMoreCardsSubtitle}>
                    You've seen all the suggested pals for today. Come back tomorrow for more meaningful connections.
                </Text>

                <View style={styles.divider} />

                <TouchableOpacity style={styles.premiumButton} activeOpacity={0.9}>
                    <LinearGradient
                        colors={['#D4AF37', '#FFD700', '#D4AF37']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.premiumGradient}
                    >
                        <Sparkles size={20} color="#FFF" style={{ marginRight: 8 }} />
                        <Text style={styles.premiumButtonText}>UNLOCK UNLIMITED SWIPES</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.resetButton}
                    onPress={() => {
                        setLikedPals([]);
                        setRejectedPals([]);
                    }}
                >
                    <Text style={styles.resetButtonText}>Review skipped profiles</Text>
                </TouchableOpacity>
            </View>
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

                    // Background cards are hidden
                    return null;
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
                {/* Header with higher zIndex to sit on top of cards */}
                <View style={[styles.header, { zIndex: 20 }]}>
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

                        {/* Right side - Profile button removed */}
                        <View style={{ width: 44 }} />
                    </View>
                </View>

                {/* Content - Cards stay behind */}
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
    // Cards Container
    cardsContainer: {
        ...StyleSheet.absoluteFillObject, // Full screen behind header
        zIndex: 0,
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
        left: 0, // No margin for full width
        right: 0, // No margin for full width
        bottom: 0, // No margin for full height
        borderRadius: 0, // No rounded corners
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
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 0, // No rounded corners
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
        gap: 40,
        marginTop: layout.spacing.md,
    },
    rejectButton: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    acceptButton: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
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

    // Enhanced Swipe Card Styles
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
    moodPreTitle: {
        fontSize: typography.size.xs,
        color: 'rgba(255,255,255,0.7)',
        letterSpacing: 2,
        marginBottom: layout.spacing.xs,
        fontWeight: '700',
    },
    moodTitle: {
        fontSize: 32, // Smaller for side-by-side
        fontWeight: '300',
        color: '#fff',
        letterSpacing: 1,
        textAlign: 'center',
        fontStyle: 'italic',
        lineHeight: 40,
    },
    spacer: {
        width: 40,
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.4)',
        borderRadius: 2,
        alignSelf: 'center',
    },
    miniSpacer: {
        height: 20,
    },
    profileSection: {
        alignItems: 'center',
        gap: 8,
    },
    cardProfileName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    cardTagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
    },
    cardTag: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    cardTagText: {
        fontSize: typography.size.sm,
        color: '#fff',
        fontWeight: '600',
    },
    actionButtonLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: colors.textSecondary,
        marginTop: 4,
        textTransform: 'uppercase',
    },
    actionButtonLabelBig: {
        fontSize: 16,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    moodSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        fontWeight: '500',
        textAlign: 'center',
        maxWidth: 120,
    },
    // Action Buttons
    actionButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'center', // Center items
        gap: 24, // Closer together
        marginTop: 20,
    },
    actionButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    nopeButton: {
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    likeButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
    },

    // --- NEW CARD DESIGN STYLES ---
    cardImagePlaceholder: {
        height: '45%',
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholderText: {
        display: 'none', // Hide placeholder text
    },
    imageGradientOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 120, // Tall fade for seamless blend
    },
    cardContentNew: {
        flex: 1,
        paddingHorizontal: layout.spacing.xl,
        paddingTop: 40, // Reduced from 120 to move content closer to image
        paddingBottom: 100, // Keep bottom padding for safety
        justifyContent: 'flex-start', // Change to flex-start to control spacing
        gap: 20, // Add gap between elements
    },
    cardHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardNameSmall: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'rgba(255,255,255,0.7)',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
    cardAge: {
        fontSize: 14,
        fontWeight: '400',
        color: 'rgba(255,255,255,0.7)',
    },
    hugeFeelingTitle: {
        fontSize: 48,
        fontWeight: '400',
        color: '#FFF',
        marginBottom: 16,
    },
    hugeFeelingTitleSmall: {
        fontSize: 36,
        fontWeight: '400',
        color: '#FFF',
    },
    feelingsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        alignItems: 'baseline',
        marginBottom: 16,
    },
    thinDivider: {
        width: 40,
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.3)',
        marginBottom: 24,
    },
    thinDividerSmall: {
        width: 40,
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.3)',
        marginBottom: 8,
    },
    bioText: {
        fontSize: 18,
        lineHeight: 28,
        color: 'rgba(255,255,255,0.9)',
        fontWeight: '400',
    },
    bottomTagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    pillTag: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    pillTagText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#FFF',
        letterSpacing: 1,
    },
    noMoreCardsContent: {
        width: '100%',
        alignItems: 'center',
        padding: 32,
    },
    emptyStateIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: colors.border,
        marginBottom: 32,
    },
    premiumButton: {
        width: '100%',
        height: 56,
        borderRadius: 28,
        overflow: 'hidden',
        marginBottom: 16,
        shadowColor: '#D4AF37',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    premiumGradient: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    premiumButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFF',
        letterSpacing: 1,
    },
});

import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Heart, MessageCircle, Sparkles, X } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { ProfileButton } from '../components/ProfileButton';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { typography } from '../theme/typography';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const TAB_BAR_HEIGHT = 100;

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

// Mood options with colors and emojis
const MOODS = [
    { id: 'great', emoji: '😊', label: 'Great', color: colors.moodGreat },
    { id: 'good', emoji: '🙂', label: 'Good', color: colors.moodGood },
    { id: 'okay', emoji: '😐', label: 'Okay', color: colors.moodOkay },
    { id: 'low', emoji: '😔', label: 'Low', color: colors.moodLow },
    { id: 'struggling', emoji: '😢', label: 'Struggling', color: colors.moodStruggling },
];

// Generate dummy message history for past days
const generateMessageHistory = () => {
    const history: { [key: string]: { messages: any[], summary: string, mood?: string } } = {};
    const today = new Date();

    const pastDays = [1, 3, 5, 7, 10, 12, 15, 18, 20, 22];
    pastDays.forEach(daysAgo => {
        const date = new Date(today);
        date.setDate(date.getDate() - daysAgo);
        const dateKey = date.toISOString().split('T')[0];
        const moodIndex = daysAgo % 5;

        history[dateKey] = {
            mood: MOODS[moodIndex].id,
            summary: `You discussed feelings of ${daysAgo % 2 === 0 ? 'anxiety about work' : 'progress on personal goals'}.`,
            messages: [
                { id: `${dateKey}-1`, sender: 'ai', text: 'Hi there! How are you feeling today?' },
                { id: `${dateKey}-2`, sender: 'user', text: daysAgo % 2 === 0 ? 'A bit stressed about work.' : 'Pretty good today!' },
                { id: `${dateKey}-3`, sender: 'ai', text: daysAgo % 2 === 0 ? 'I understand. Let\'s talk through it.' : 'That\'s wonderful to hear!' },
            ]
        };
    });

    return history;
};

const MESSAGE_HISTORY = generateMessageHistory();

// Get days in current month for dot calendar
const getDaysInMonth = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
        days.push({ day: null, dateKey: null });
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i);
        const dateKey = date.toISOString().split('T')[0];
        const historyEntry = MESSAGE_HISTORY[dateKey];
        days.push({
            day: i,
            dateKey,
            hasMessages: !!historyEntry,
            mood: historyEntry?.mood
        });
    }

    return days;
};

export function PalScreen() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { id: 'welcome', sender: 'ai', text: 'Hi there! I\'m here to listen. How can I support you today?' }
    ]);
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [todayMood, setTodayMood] = useState<string | null>(null);
    const [showMoodSelector, setShowMoodSelector] = useState(true);
    const [viewMode, setViewMode] = useState<'cards' | 'messages'>('cards');
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [likedPals, setLikedPals] = useState<string[]>([]);
    const [rejectedPals, setRejectedPals] = useState<string[]>([]);
    const scrollViewRef = useRef<ScrollView>(null);
    const cardSwipeAnim = useRef(new Animated.Value(0)).current;

    const today = new Date().toISOString().split('T')[0];
    const calendarDays = getDaysInMonth();

    // Filter out liked and rejected pals
    const availablePals = MOCK_PALS.filter(
        pal => !likedPals.includes(pal.id) && !rejectedPals.includes(pal.id)
    );

    const handleMoodSelect = (moodId: string) => {
        setTodayMood(moodId);
        setShowMoodSelector(false);

        const selectedMood = MOODS.find(m => m.id === moodId);
        const aiMessage = {
            id: Date.now().toString(),
            sender: 'ai',
            text: moodId === 'great' || moodId === 'good'
                ? `That's wonderful! ${selectedMood?.emoji} I'd love to hear more about what's going well.`
                : moodId === 'okay'
                    ? `Thanks for sharing. Sometimes 'okay' is just fine. Want to talk about anything?`
                    : `I'm here for you. ${selectedMood?.emoji} Take your time, and share what's on your mind when you're ready.`
        };
        setMessages(prev => [...prev, aiMessage]);
    };

    const handleSendMessage = () => {
        if (!message.trim()) return;

        const userMessage = {
            id: Date.now().toString(),
            sender: 'user',
            text: message.trim()
        };

        setMessages(prev => [...prev, userMessage]);
        setMessage('');

        setTimeout(() => {
            const aiResponse = {
                id: (Date.now() + 1).toString(),
                sender: 'ai',
                text: 'Thank you for sharing that with me. I\'m here to support you. Would you like to tell me more?'
            };
            setMessages(prev => [...prev, aiResponse]);
        }, 1000);
    };

    const handleDotPress = (dateKey: string) => {
        if (dateKey === today) {
            setSelectedDate(null);
            setShowCalendar(false);
        } else if (MESSAGE_HISTORY[dateKey]) {
            setSelectedDate(dateKey);
            setShowCalendar(false);
        }
    };

    const handleCalendarToggle = () => {
        setShowCalendar(!showCalendar);
        setSelectedDate(null);
    };

    const handleAcceptPal = (palId: string) => {
        Animated.timing(cardSwipeAnim, {
            toValue: SCREEN_WIDTH,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setLikedPals(prev => [...prev, palId]);
            cardSwipeAnim.setValue(0);
            if (currentCardIndex < availablePals.length - 1) {
                setCurrentCardIndex(prev => prev + 1);
            }
        });
    };

    const handleRejectPal = (palId: string) => {
        Animated.timing(cardSwipeAnim, {
            toValue: -SCREEN_WIDTH,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setRejectedPals(prev => [...prev, palId]);
            cardSwipeAnim.setValue(0);
            if (currentCardIndex < availablePals.length - 1) {
                setCurrentCardIndex(prev => prev + 1);
            }
        });
    };

    const toggleViewMode = () => {
        setViewMode(prev => prev === 'cards' ? 'messages' : 'cards');
    };

    const isViewingPastDate = selectedDate && selectedDate !== today;
    const displayMessages = isViewingPastDate
        ? MESSAGE_HISTORY[selectedDate]?.messages || []
        : messages;
    const summary = isViewingPastDate ? MESSAGE_HISTORY[selectedDate]?.summary : null;

    const getMoodColor = (moodId: string | undefined) => {
        const mood = MOODS.find(m => m.id === moodId);
        return mood?.color || colors.primaryLight;
    };

    const renderDot = ({ item }: { item: any }) => {
        if (item.day === null) {
            return <View style={styles.dotSpacer} />;
        }

        const isToday = item.dateKey === today;
        const hasMsgs = item.hasMessages || isToday;
        const dotColor = item.mood ? getMoodColor(item.mood) : (isToday ? colors.accent : colors.borderDark);

        return (
            <TouchableOpacity
                style={[
                    styles.dot,
                    { backgroundColor: hasMsgs ? dotColor : colors.borderDark },
                    isToday && styles.dotToday
                ]}
                onPress={() => hasMsgs && handleDotPress(item.dateKey)}
                disabled={!hasMsgs}
            >
                {isToday && <View style={styles.todayIndicator} />}
            </TouchableOpacity>
        );
    };

    const renderPalCard = (pal: typeof MOCK_PALS[0]) => {
        return (
            <Animated.View
                style={[
                    styles.palCardContainer,
                    {
                        transform: [{ translateX: cardSwipeAnim }]
                    }
                ]}
            >
                <ImageBackground
                    source={pal.avatar}
                    style={styles.palCardBackground}
                    resizeMode="cover"
                >
                    {/* Top bar with back and availability */}
                    <View style={styles.palCardTopBar}>
                        <TouchableOpacity style={styles.backArrowButton}>
                            <Text style={styles.backArrowText}>‹</Text>
                        </TouchableOpacity>

                        <BlurView intensity={40} tint="light" style={styles.availabilityBadge}>
                            <View style={[
                                styles.availabilityDot,
                                { backgroundColor: pal.isAvailable ? colors.success : colors.textLight }
                            ]} />
                            <Text style={styles.availabilityText}>
                                {pal.isAvailable ? 'Available' : 'Busy'}
                            </Text>
                        </BlurView>
                    </View>

                    {/* Right side mutual connections */}
                    <View style={styles.mutualConnectionsContainer}>
                        {pal.mutualConnections.map((avatar, index) => (
                            <Image
                                key={index}
                                source={avatar}
                                style={[
                                    styles.mutualAvatar,
                                    { marginTop: index > 0 ? -10 : 0 }
                                ]}
                            />
                        ))}
                    </View>

                    {/* Bottom gradient overlay */}
                    <LinearGradient
                        colors={['transparent', 'rgba(255,255,255,0.85)', 'rgba(255,255,255,0.98)']}
                        style={styles.palCardBottomGradient}
                    >
                        {/* Rating */}
                        <View style={styles.ratingContainer}>
                            <Text style={styles.ratingLeaf}>🌿</Text>
                            <Text style={styles.ratingValue}>{pal.rating}</Text>
                            <Text style={styles.ratingLabel}>Rating</Text>
                            <Text style={styles.ratingLeaf}>🌿</Text>
                        </View>

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
                                onPress={() => handleRejectPal(pal.id)}
                                activeOpacity={0.8}
                            >
                                <X size={28} color={colors.textSecondary} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.acceptButton}
                                onPress={() => handleAcceptPal(pal.id)}
                                activeOpacity={0.8}
                            >
                                <Heart size={28} color="#FFF" fill="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                </ImageBackground>
            </Animated.View>
        );
    };

    const renderRecentChats = () => {
        return (
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
                        <TouchableOpacity key={chat.id} style={styles.chatItem}>
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
    };

    // Mood Selector Screen
    if (showMoodSelector && !todayMood) {
        return (
            <View style={styles.gradientContainer}>
                <LinearGradient
                    colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
                    style={styles.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.moodHeader}>
                        <View style={{ width: 40 }} />
                        <View style={styles.sparkleContainer}>
                            <Sparkles size={24} color={colors.accent} />
                        </View>
                        <ProfileButton />
                    </View>

                    <View style={styles.moodContent}>
                        <Text style={styles.greetingText}>Hey there,</Text>
                        <Text style={styles.questionText}>How are you{'\n'}feeling today?</Text>

                        <View style={styles.moodGrid}>
                            {MOODS.map((mood) => (
                                <TouchableOpacity
                                    key={mood.id}
                                    style={styles.moodButton}
                                    onPress={() => handleMoodSelect(mood.id)}
                                    activeOpacity={0.7}
                                >
                                    <BlurView
                                        intensity={40}
                                        tint="light"
                                        style={[styles.moodButtonInner, { borderColor: mood.color }]}
                                    >
                                        <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                                        <Text style={styles.moodLabel}>{mood.label}</Text>
                                    </BlurView>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.skipButton}
                        onPress={() => setShowMoodSelector(false)}
                    >
                        <Text style={styles.skipText}>Skip for now</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        );
    }

    // Calendar View
    if (showCalendar) {
        return (
            <View style={styles.gradientContainer}>
                <LinearGradient
                    colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
                    style={styles.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.header}>
                        <View style={styles.headerContent}>
                            <View>
                                <Text style={styles.title}>Your Journey</Text>
                                <Text style={styles.subtitle}>Tap a day to revisit</Text>
                            </View>
                            <View style={styles.headerIcons}>
                                <TouchableOpacity
                                    style={[styles.calendarButton, styles.calendarButtonActive]}
                                    onPress={handleCalendarToggle}
                                >
                                    <Calendar size={22} color={colors.accent} />
                                </TouchableOpacity>
                                <ProfileButton />
                            </View>
                        </View>
                    </View>

                    <View style={styles.calendarContainer}>
                        <BlurView intensity={30} tint="light" style={styles.calendarCard}>
                            <Text style={styles.monthLabel}>
                                {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </Text>
                            <FlatList
                                data={calendarDays}
                                renderItem={renderDot}
                                keyExtractor={(item, index) => index.toString()}
                                numColumns={7}
                                contentContainerStyle={styles.dotsContainer}
                                scrollEnabled={false}
                            />
                        </BlurView>

                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => { setShowCalendar(false); setSelectedDate(null); }}
                        >
                            <Text style={styles.backButtonText}>Back to Today</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </View>
        );
    }

    // Cards or Messages View
    return (
        <View style={styles.gradientContainer}>
            <LinearGradient
                colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                {/* Header with view toggle */}
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        {/* Left side - View toggle button */}
                        <TouchableOpacity
                            style={[
                                styles.viewToggleButton,
                                viewMode === 'messages' && styles.viewToggleButtonActive
                            ]}
                            onPress={toggleViewMode}
                        >
                            <MessageCircle
                                size={20}
                                color={viewMode === 'messages' ? colors.accent : colors.textPrimary}
                            />
                            <Text style={[
                                styles.viewToggleText,
                                viewMode === 'messages' && styles.viewToggleTextActive
                            ]}>
                                {viewMode === 'cards' ? 'Chats' : 'Cards'}
                            </Text>
                        </TouchableOpacity>

                        {/* Center title */}
                        <View style={styles.headerCenter}>
                            <Text style={styles.titleCenter}>
                                {viewMode === 'cards' ? 'Find Your Pal' : 'Messages'}
                            </Text>
                        </View>

                        {/* Right side - Profile and Calendar */}
                        <View style={styles.headerIcons}>
                            <TouchableOpacity
                                style={styles.calendarButton}
                                onPress={handleCalendarToggle}
                            >
                                <Calendar size={22} color={colors.textPrimary} />
                            </TouchableOpacity>
                            <ProfileButton />
                        </View>
                    </View>
                </View>

                {viewMode === 'cards' ? (
                    // Pal Cards View
                    <View style={styles.cardsContainer}>
                        {availablePals.length > 0 ? (
                            renderPalCard(availablePals[0])
                        ) : (
                            <View style={styles.noMoreCardsContainer}>
                                <Text style={styles.noMoreCardsEmoji}>🎉</Text>
                                <Text style={styles.noMoreCardsTitle}>You've seen everyone!</Text>
                                <Text style={styles.noMoreCardsSubtitle}>
                                    Check back later for new pals
                                </Text>
                            </View>
                        )}
                    </View>
                ) : (
                    // Messages View
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.flex}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
                    >
                        {summary && (
                            <BlurView intensity={40} tint="light" style={styles.summaryCard}>
                                <Text style={styles.summaryLabel}>AI Summary</Text>
                                <Text style={styles.summaryText}>{summary}</Text>
                            </BlurView>
                        )}

                        {renderRecentChats()}
                    </KeyboardAvoidingView>
                )}
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    gradientContainer: {
        flex: 1,
    },
    gradient: {
        flex: 1,
    },
    flex: {
        flex: 1,
    },
    // Mood Selector Styles
    moodHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: layout.spacing.lg,
        paddingTop: 60,
    },
    sparkleContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.glass,
        justifyContent: 'center',
        alignItems: 'center',
    },
    moodContent: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: layout.spacing.xl,
        paddingBottom: 60,
    },
    greetingText: {
        fontSize: 28,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    questionText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: colors.textPrimary,
        lineHeight: 44,
        marginBottom: 40,
    },
    moodGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
    },
    moodButton: {
        width: (SCREEN_WIDTH - 80) / 3,
    },
    moodButtonInner: {
        alignItems: 'center',
        paddingVertical: 20,
        borderRadius: layout.borderRadius.lg,
        borderWidth: 2,
        overflow: 'hidden',
    },
    moodEmoji: {
        fontSize: 32,
        marginBottom: 8,
    },
    moodLabel: {
        fontSize: typography.size.sm,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    skipButton: {
        alignItems: 'center',
        paddingBottom: TAB_BAR_HEIGHT + 20,
    },
    skipText: {
        fontSize: typography.size.md,
        color: colors.textSecondary,
    },
    // Header Styles
    header: {
        paddingHorizontal: layout.spacing.lg,
        paddingTop: 60,
        paddingBottom: layout.spacing.sm,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
    },
    titleCenter: {
        fontSize: typography.size.lg,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    viewToggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: colors.glass,
        borderWidth: 1,
        borderColor: colors.glassBorder,
    },
    viewToggleButtonActive: {
        backgroundColor: colors.glassOverlay,
        borderColor: colors.accent,
    },
    viewToggleText: {
        fontSize: typography.size.sm,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    viewToggleTextActive: {
        color: colors.accent,
    },
    calendarButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.glass,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.glassBorder,
    },
    calendarButtonActive: {
        backgroundColor: colors.glassOverlay,
        borderColor: colors.accent,
    },
    title: {
        fontSize: typography.size.xxl,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    subtitle: {
        fontSize: typography.size.md,
        color: colors.textSecondary,
        marginTop: 2,
    },
    // Calendar Styles
    calendarContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: layout.spacing.lg,
        paddingBottom: TAB_BAR_HEIGHT,
    },
    calendarCard: {
        borderRadius: layout.borderRadius.lg,
        padding: layout.spacing.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.glassBorder,
        width: '100%',
    },
    monthLabel: {
        fontSize: typography.size.lg,
        fontWeight: '600',
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: layout.spacing.md,
    },
    dotsContainer: {
        alignItems: 'center',
        gap: 6,
    },
    dot: {
        width: 36,
        height: 36,
        borderRadius: 18,
        margin: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dotSpacer: {
        width: 36,
        height: 36,
        margin: 4,
    },
    dotToday: {
        borderWidth: 3,
        borderColor: colors.accent,
    },
    todayIndicator: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FFF',
    },
    backButton: {
        marginTop: layout.spacing.xl,
        backgroundColor: colors.textPrimary,
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: layout.borderRadius.xl,
    },
    backButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: typography.size.md,
    },
    // Summary Card
    summaryCard: {
        marginHorizontal: layout.spacing.lg,
        marginBottom: layout.spacing.md,
        padding: layout.spacing.md,
        borderRadius: layout.borderRadius.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.glassBorder,
    },
    summaryLabel: {
        fontSize: typography.size.xs,
        fontWeight: 'bold',
        color: colors.accent,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 6,
    },
    summaryText: {
        fontSize: typography.size.sm,
        color: colors.textPrimary,
        lineHeight: 20,
    },
    // Cards Container
    cardsContainer: {
        flex: 1,
        paddingBottom: TAB_BAR_HEIGHT,
    },
    // Pal Card Styles
    palCardContainer: {
        flex: 1,
        marginHorizontal: layout.spacing.md,
        marginBottom: layout.spacing.md,
        borderRadius: layout.borderRadius.xl,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    palCardBackground: {
        flex: 1,
        justifyContent: 'space-between',
    },
    palCardTopBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: layout.spacing.md,
        paddingTop: layout.spacing.md,
    },
    backArrowButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.glass,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backArrowText: {
        fontSize: 28,
        color: colors.textPrimary,
        fontWeight: '300',
        marginTop: -2,
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
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: layout.spacing.md,
        backgroundColor: colors.glass,
        borderRadius: layout.borderRadius.lg,
        marginBottom: layout.spacing.sm,
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
    // Legacy Chat Styles (keeping for calendar past view)
    chatContainer: {
        padding: layout.spacing.md,
        paddingBottom: layout.spacing.md,
    },
    messageBubble: {
        maxWidth: '80%',
        marginBottom: layout.spacing.sm,
        borderRadius: 20,
        padding: layout.spacing.md,
    },
    aiBubble: {
        backgroundColor: colors.glass,
        borderBottomLeftRadius: 6,
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: colors.glassBorder,
    },
    userBubble: {
        backgroundColor: colors.textPrimary,
        borderBottomRightRadius: 6,
        alignSelf: 'flex-end',
    },
    messageText: {
        fontSize: typography.size.md,
        color: colors.textPrimary,
        lineHeight: 22,
    },
    userMessageText: {
        color: '#FFF',
    },
    inputArea: {
        padding: layout.spacing.md,
        paddingBottom: TAB_BAR_HEIGHT + layout.spacing.md,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: layout.borderRadius.xl,
        paddingHorizontal: layout.spacing.md,
        paddingVertical: layout.spacing.xs,
        borderWidth: 1,
        borderColor: colors.glassBorder,
        overflow: 'hidden',
    },
    input: {
        flex: 1,
        fontSize: typography.size.md,
        color: colors.textPrimary,
        maxHeight: 100,
        paddingTop: 12,
        paddingBottom: 12,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.textPrimary,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: layout.spacing.sm,
    },
    // Read-only Banner
    readOnlyBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: layout.spacing.md,
        paddingBottom: TAB_BAR_HEIGHT + layout.spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.glassBorder,
        overflow: 'hidden',
    },
    readOnlyText: {
        fontSize: typography.size.sm,
        color: colors.textSecondary,
    },
    backToTodayLink: {
        fontSize: typography.size.sm,
        fontWeight: 'bold',
        color: colors.accent,
    },
});

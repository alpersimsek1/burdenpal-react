import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Send, X } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { ProfileButton } from '../components/ProfileButton';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';

const MOODS = [
    { id: 'great', color: colors.moodCelebration, label: 'Great' },
    { id: 'good', color: colors.moodProgress, label: 'Good' },
    { id: 'okay', color: colors.moodCalm, label: 'Okay' },
    { id: 'low', color: colors.moodReflection, label: 'Low' },
    { id: 'struggling', color: colors.moodSupport, label: 'Struggling' },
];

const getDaysInMonth = () => {
    const today = new Date();
    const days = [];
    for (let i = 1; i <= 30; i++) {
        const hasData = Math.random() > 0.3;
        days.push({
            day: i,
            hasData,
            mood: hasData ? MOODS[Math.floor(Math.random() * MOODS.length)] : null,
            isToday: i === today.getDate()
        });
    }
    return days;
};

const INITIAL_CHAT = [
    {
        id: '1',
        sender: 'ai',
        text: 'Hello! I\'m your Pal AI. How are you feeling today?',
        time: '9:00 AM',
        type: 'text'
    }
];

export function PalScreen() {
    const [messages, setMessages] = useState(INITIAL_CHAT);
    const [inputText, setInputText] = useState('');
    const [showCalendar, setShowCalendar] = useState(false);
    const flatListRef = useRef<FlatList>(null);
    const calendarDays = useRef(getDaysInMonth()).current;

    const handleSendMessage = () => {
        if (!inputText.trim()) return;

        const newMsg = {
            id: Date.now().toString(),
            sender: 'user',
            text: inputText.trim(),
            time: 'Now',
            type: 'text'
        };

        setMessages(prev => [...prev, newMsg]);
        setInputText('');

        setTimeout(() => {
            const aiMsg = {
                id: (Date.now() + 1).toString(),
                sender: 'ai',
                text: 'I hear you. Tell me more about that.',
                time: 'Now',
                type: 'text'
            };
            setMessages(prev => [...prev, aiMsg]);
        }, 1500);
    };

    const renderMessage = ({ item }: { item: any }) => {
        const isUser = item.sender === 'user';
        const isAi = item.sender === 'ai';

        return (
            <View style={[
                styles.messageRow,
                isUser ? styles.userRow : styles.aiRow
            ]}>
                <View style={[
                    styles.messageContent,
                    isUser ? styles.userContent : styles.aiContent
                ]}>
                    <Text style={[
                        styles.messageText,
                        isUser ? styles.userText : styles.aiText
                    ]}>
                        {item.text}
                    </Text>

                    <Text style={[
                        styles.timeText,
                        isUser ? styles.userTime : styles.aiTime
                    ]}>
                        {item.time}
                    </Text>
                </View>
            </View>
        );
    };

    const renderDot = ({ item }: { item: any }) => (
        <View style={styles.dotWrapper}>
            <View style={[
                styles.dot,
                { backgroundColor: item.hasData ? item.mood.color : 'rgba(0,0,0,0.05)' },
                item.isToday && styles.dotToday
            ]} />
        </View>
    );

    return (
        <LinearGradient
            colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            {/* Header */}
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={() => setShowCalendar(!showCalendar)}
                    >
                        <Calendar size={24} color={colors.textPrimary} />
                    </TouchableOpacity>

                    <View style={{ flex: 1 }} />

                    <ProfileButton />
                </View>
            </SafeAreaView>

            {/* Calendar / Dot Matrix Overlay (Blended) */}
            {showCalendar && (
                <View style={styles.calendarOverlay}>
                    {/* Minimal header for close button if needed, or keeping it subtle */}
                    <View style={styles.calendarHeader}>
                        <Text style={styles.calendarTitle}>Your Mood History</Text>
                        <TouchableOpacity onPress={() => setShowCalendar(false)}>
                            {/* Close icon somewhat blended or dark */}
                            <X size={24} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    {/* The grid itself */}
                    <FlatList
                        data={calendarDays}
                        renderItem={renderDot}
                        keyExtractor={(_, i) => i.toString()}
                        numColumns={7}
                        contentContainerStyle={styles.dotsGrid}
                        scrollEnabled={false}
                    />

                    <View style={styles.calendarStats}>
                        <Text style={styles.statsText}>You've been tracking for 12 days straight!</Text>
                    </View>
                </View>
            )}

            {/* Chat Area */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.chatList}
                showsVerticalScrollIndicator={false}
            />

            {/* Float Input Area */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <View style={styles.inputContainer}>
                    {/* Input Wrapper */}
                    <View style={styles.inputWrapper}>
                        {/* Removed Plus Button */}
                        <TouchableOpacity style={styles.plusButtonPlaceholder}>
                            <Text style={{ fontSize: 24, color: colors.textSecondary }}>+</Text>
                        </TouchableOpacity>

                        <TextInput
                            style={styles.input}
                            placeholder="Type a message..."
                            placeholderTextColor={colors.textLight}
                            value={inputText}
                            onChangeText={setInputText}
                            multiline
                        />

                        <TouchableOpacity
                            style={styles.sendButtonInternal}
                            onPress={handleSendMessage}
                        >
                            <Send size={18} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        zIndex: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: layout.spacing.lg,
        paddingVertical: layout.spacing.md,
    },
    headerButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 22,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    chatList: {
        paddingHorizontal: layout.spacing.lg,
        paddingTop: layout.spacing.md,
        paddingBottom: 140,
    },
    messageRow: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    userRow: {
        justifyContent: 'flex-end',
    },
    aiRow: {
        justifyContent: 'flex-start',
    },
    messageContent: {
        maxWidth: '80%',
        borderRadius: 20,
        padding: 16,
    },
    userContent: {
        backgroundColor: colors.primary,
        borderTopRightRadius: 4,
    },
    aiContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 24,
    },
    userText: {
        color: '#FFFFFF',
    },
    aiText: {
        color: colors.textPrimary,
    },
    timeText: {
        fontSize: 11,
        marginTop: 6,
        alignSelf: 'flex-end',
    },
    userTime: {
        color: 'rgba(255,255,255,0.7)',
    },
    aiTime: {
        color: colors.textLight,
    },
    // Input Styles
    inputContainer: {
        paddingHorizontal: layout.spacing.lg,
        paddingTop: 10,
        backgroundColor: 'transparent',
        paddingBottom: 110,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        paddingHorizontal: 8,
        paddingVertical: 8,
        minHeight: 50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    plusButtonPlaceholder: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        // Keeping the placeholder space/icon but user asked to remove "the plus button"
        // I'll adhere to "remove the plus button" from the text but keep the visual balance or just remove it fully?
        // "remove the plus button from the input" -> I should remove it DOM-wise.
        display: 'none',
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: colors.textPrimary,
        height: '100%',
        marginLeft: 16, // Added margin since plus button is gone
        paddingTop: 0,
        paddingBottom: 0,
    },
    sendButtonInternal: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    // Calendar Styles
    calendarOverlay: {
        marginTop: 20,
        marginHorizontal: layout.spacing.lg,
        // No background color = blended
        paddingBottom: 20,
    },
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    calendarTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    dotsGrid: {
        alignItems: 'center',
    },
    dotWrapper: {
        width: 40, // Wider spacing
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    dotToday: {
        borderWidth: 2,
        borderColor: colors.textPrimary,
        width: 16,
        height: 16,
        borderRadius: 8,
    },
    calendarStats: {
        marginTop: 10,
        alignItems: 'center',
    },
    statsText: {
        color: colors.textSecondary,
        fontWeight: '600',
        fontSize: 14,
    },
});

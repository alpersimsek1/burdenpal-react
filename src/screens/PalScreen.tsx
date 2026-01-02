// Pal Screen - Industrial Minimalist AI Chat
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowUpRight } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
    Dimensions,
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
        text: 'Hello. I am Pal. How can I assist you today?',
        time: '09:00',
        type: 'text'
    }
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function PalScreen() {
    const [messages, setMessages] = useState(INITIAL_CHAT);
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef<FlatList>(null);

    const handleSendMessage = () => {
        if (!inputText.trim()) return;

        const newMsg = {
            id: Date.now().toString(),
            sender: 'user',
            text: inputText.trim(),
            time: 'NOW',
            type: 'text'
        };

        setMessages(prev => [...prev, newMsg]);
        setInputText('');

        setTimeout(() => {
            const aiMsg = {
                id: (Date.now() + 1).toString(),
                sender: 'ai',
                text: 'Processed. I understand you feel that way. Tell me more.',
                time: 'NOW',
                type: 'text'
            };
            setMessages(prev => [...prev, aiMsg]);
        }, 1500);
    };

    const renderMessage = ({ item }: { item: any }) => {
        const isUser = item.sender === 'user';

        return (
            <View style={[styles.messageRow, isUser ? styles.userRow : styles.aiRow]}>
                <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}>
                    <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.aiMessageText]}>
                        {item.text}
                    </Text>
                    <Text style={[styles.timeText, isUser ? styles.userTime : styles.aiTime]}>
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
                {
                    backgroundColor: item.hasData ? item.mood.color : 'transparent',
                    borderColor: item.hasData ? 'transparent' : colors.borderDark
                }
            ]} />
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Abstract Gradient Blob */}
            <LinearGradient
                colors={[colors.moodSupport, 'transparent']}
                style={styles.abstractBlob}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                locations={[0, 0.4]}
            />

            <SafeAreaView style={styles.safeArea}>
                {/* Chat Area */}

                {/* Chat Area */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
                >
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        renderItem={renderMessage}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.chatContent}
                        showsVerticalScrollIndicator={false}
                        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    />

                    {/* Input Area */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="MESSAGE PAL..."
                            placeholderTextColor={colors.textSecondary}
                            value={inputText}
                            onChangeText={setInputText}
                            multiline
                        />
                        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                            <ArrowUpRight size={24} color={colors.textPrimary} />
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    safeArea: {
        flex: 1,
    },
    abstractBlob: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 300,
        height: 300,
        opacity: 0.1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: layout.spacing.xl,
        paddingTop: layout.spacing.lg,
        paddingBottom: layout.spacing.lg,
    },
    headerTitleContainer: {
        alignItems: 'center',
        gap: 2,
    },
    headerSubtitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.textSecondary,
        letterSpacing: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: colors.textPrimary,
        letterSpacing: -0.5,
    },
    calendarButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.borderDark,
    },
    divider: {
        height: 1,
        backgroundColor: colors.textPrimary,
        marginHorizontal: layout.spacing.lg,
    },

    // Calendar
    calendarContainer: {
        padding: layout.spacing.xl,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderDark,
        backgroundColor: 'rgba(255,255,255,0.5)',
    },
    calendarTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.textSecondary,
        marginBottom: 16,
        letterSpacing: 1,
    },
    calendarGrid: {
        alignItems: 'center',
    },
    dotWrapper: {
        width: (SCREEN_WIDTH - 60) / 7,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 1,
    },

    // Chat
    chatContent: {
        padding: layout.spacing.xl,
        paddingBottom: 20,
        gap: 24,
    },
    messageRow: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'flex-end',
    },
    userRow: {
        justifyContent: 'flex-end',
    },
    aiRow: {
        justifyContent: 'flex-start',
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 16,
        borderRadius: 24, // Rounded
    },
    userBubble: {
        backgroundColor: colors.primary,
        borderBottomRightRadius: 4, // Subtle tail effect or keep rounded? User said "make cards rounded". I'll keep a small tell.
    },
    aiBubble: {
        backgroundColor: colors.surface, // Solid white background
    },
    messageText: {
        fontSize: 16,
        lineHeight: 24,
    },
    userMessageText: {
        color: '#FFF',
    },
    aiMessageText: {
        color: colors.textPrimary,
    },
    timeText: {
        fontSize: 10,
        fontFamily: 'Courier',
        marginTop: 8,
        alignSelf: 'flex-end',
        opacity: 0.7,
    },
    userTime: {
        color: '#FFF',
    },
    aiTime: {
        color: colors.textPrimary,
    },

    // Input
    inputContainer: {
        flexDirection: 'row',
        padding: layout.spacing.lg,
        borderTopWidth: 2,
        borderTopColor: colors.textPrimary,
        backgroundColor: colors.background,
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Courier',
        color: colors.textPrimary,
        maxHeight: 100,
        paddingTop: 14,
    },
    sendButton: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.surfaceWarm,
        borderWidth: 1,
        borderColor: colors.textPrimary,
        marginLeft: 12,
    }
});

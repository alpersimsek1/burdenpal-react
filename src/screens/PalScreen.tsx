import React, { useState, useRef } from 'react';
import {
    Text,
    StyleSheet,
    View,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    ScrollView,
    FlatList
} from 'react-native';
import { Send, Calendar } from 'lucide-react-native';
import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { layout } from '../theme/layout';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';
import { ProfileButton } from '../components/ProfileButton';

// Generate dummy message history for past days
const generateMessageHistory = () => {
    const history: { [key: string]: { messages: any[], summary: string } } = {};
    const today = new Date();

    // Generate some past days with messages
    const pastDays = [3, 5, 7, 10, 12, 15, 18, 20, 22];
    pastDays.forEach(daysAgo => {
        const date = new Date(today);
        date.setDate(date.getDate() - daysAgo);
        const dateKey = date.toISOString().split('T')[0];

        history[dateKey] = {
            summary: `You discussed feelings of ${daysAgo % 2 === 0 ? 'anxiety about work' : 'progress on personal goals'}. Overall mood was ${daysAgo % 3 === 0 ? 'reflective' : 'hopeful'}.`,
            messages: [
                { id: `${dateKey}-1`, sender: 'ai', text: 'Hi there! How are you feeling today?' },
                { id: `${dateKey}-2`, sender: 'user', text: daysAgo % 2 === 0 ? 'A bit stressed about work deadlines.' : 'Pretty good! Made some progress today.' },
                { id: `${dateKey}-3`, sender: 'ai', text: daysAgo % 2 === 0 ? 'I understand. Let\'s talk through what\'s on your mind.' : 'That\'s wonderful to hear! Tell me more about it.' },
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
    // Add empty slots for days before the 1st
    for (let i = 0; i < firstDayOfWeek; i++) {
        days.push({ day: null, dateKey: null });
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i);
        const dateKey = date.toISOString().split('T')[0];
        days.push({ day: i, dateKey, hasMessages: !!MESSAGE_HISTORY[dateKey] });
    }

    return days;
};

export function PalScreen() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { id: 'welcome', sender: 'ai', text: 'Hi there. I\'m here to listen without judgment. How are you feeling today?' }
    ]);
    const [showCalendar, setShowCalendar] = useState(true);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [hasStartedConversation, setHasStartedConversation] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);

    const today = new Date().toISOString().split('T')[0];
    const calendarDays = getDaysInMonth();

    const handleSendMessage = () => {
        if (!message.trim()) return;

        const userMessage = {
            id: Date.now().toString(),
            sender: 'user',
            text: message.trim()
        };

        setMessages(prev => [...prev, userMessage]);
        setMessage('');
        setShowCalendar(false);
        setHasStartedConversation(true);
        setSelectedDate(null);

        // Simulate AI response
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
        if (showCalendar) {
            setShowCalendar(false);
            setSelectedDate(null);
        } else {
            setShowCalendar(true);
            setSelectedDate(null);
        }
    };

    const isViewingPastDate = selectedDate && selectedDate !== today;
    const displayMessages = isViewingPastDate
        ? MESSAGE_HISTORY[selectedDate]?.messages || []
        : messages;
    const summary = isViewingPastDate ? MESSAGE_HISTORY[selectedDate]?.summary : null;

    const renderDot = ({ item }: { item: any }) => {
        if (item.day === null) {
            return <View style={styles.dotSpacer} />;
        }

        const isToday = item.dateKey === today;
        const hasMsgs = item.hasMessages || isToday;

        return (
            <TouchableOpacity
                style={[
                    styles.dot,
                    hasMsgs && styles.dotActive,
                    isToday && styles.dotToday
                ]}
                onPress={() => hasMsgs && handleDotPress(item.dateKey)}
                disabled={!hasMsgs}
            />
        );
    };

    return (
        <Screen>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.flex}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <View>
                            <Text style={styles.title}>Your AI Pal</Text>
                            <Text style={styles.subtitle}>
                                {isViewingPastDate
                                    ? `Viewing ${new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                                    : 'Always here to listen.'
                                }
                            </Text>
                        </View>
                        <View style={styles.headerIcons}>
                            {hasStartedConversation && (
                                <TouchableOpacity
                                    style={styles.calendarButton}
                                    onPress={handleCalendarToggle}
                                >
                                    <Calendar size={24} color={showCalendar ? colors.primary : colors.textPrimary} />
                                </TouchableOpacity>
                            )}
                            <ProfileButton />
                        </View>
                    </View>
                </View>

                {showCalendar && !hasStartedConversation ? (
                    <View style={styles.calendarContainer}>
                        <Text style={styles.calendarTitle}>Your Journey This Month</Text>
                        <Text style={styles.calendarSubtitle}>Tap a day to revisit your conversation</Text>
                        <FlatList
                            data={calendarDays}
                            renderItem={renderDot}
                            keyExtractor={(item, index) => index.toString()}
                            numColumns={7}
                            contentContainerStyle={styles.dotsContainer}
                            scrollEnabled={false}
                        />
                        <TouchableOpacity
                            style={styles.startButton}
                            onPress={() => setShowCalendar(false)}
                        >
                            <Text style={styles.startButtonText}>Start Today's Conversation</Text>
                        </TouchableOpacity>
                    </View>
                ) : showCalendar && hasStartedConversation ? (
                    <View style={styles.calendarContainer}>
                        <Text style={styles.calendarTitle}>Your Journey</Text>
                        <FlatList
                            data={calendarDays}
                            renderItem={renderDot}
                            keyExtractor={(item, index) => index.toString()}
                            numColumns={7}
                            contentContainerStyle={styles.dotsContainer}
                            scrollEnabled={false}
                        />
                        <TouchableOpacity
                            style={styles.startButton}
                            onPress={() => { setShowCalendar(false); setSelectedDate(null); }}
                        >
                            <Text style={styles.startButtonText}>Back to Today</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        {summary && (
                            <Card style={styles.summaryCard}>
                                <Text style={styles.summaryLabel}>AI Summary</Text>
                                <Text style={styles.summaryText}>{summary}</Text>
                            </Card>
                        )}

                        <ScrollView
                            ref={scrollViewRef}
                            contentContainerStyle={styles.chatContainer}
                            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                        >
                            {displayMessages.map((msg: any) => (
                                <View
                                    key={msg.id}
                                    style={[
                                        styles.messageBubble,
                                        msg.sender === 'user' ? styles.userBubble : styles.aiBubble
                                    ]}
                                >
                                    <Text style={[
                                        styles.messageText,
                                        msg.sender === 'user' && styles.userMessageText
                                    ]}>{msg.text}</Text>
                                </View>
                            ))}
                        </ScrollView>

                        {!isViewingPastDate ? (
                            <View style={styles.inputArea}>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Message your Pal..."
                                        placeholderTextColor={colors.textSecondary}
                                        value={message}
                                        onChangeText={setMessage}
                                        multiline
                                    />
                                    <TouchableOpacity
                                        style={[
                                            styles.sendButton,
                                            { opacity: message.trim().length > 0 ? 1 : 0.5 }
                                        ]}
                                        disabled={message.trim().length === 0}
                                        onPress={handleSendMessage}
                                    >
                                        <Send color={colors.surface} size={20} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <View style={styles.readOnlyBanner}>
                                <Text style={styles.readOnlyText}>Viewing past conversation • Read only</Text>
                                <TouchableOpacity onPress={() => { setSelectedDate(null); }}>
                                    <Text style={styles.backToTodayLink}>Back to Today</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </>
                )}
            </KeyboardAvoidingView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    header: {
        padding: layout.spacing.lg,
        paddingBottom: layout.spacing.sm,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    calendarButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.borderDark,
    },
    title: {
        fontSize: typography.size.xxl,
        fontWeight: typography.weight.bold as any,
        color: colors.textPrimary,
    },
    subtitle: {
        fontSize: typography.size.md,
        color: colors.textSecondary,
    },
    // Calendar styles
    calendarContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: layout.spacing.xl,
    },
    calendarTitle: {
        fontSize: typography.size.xl,
        fontWeight: typography.weight.bold as any,
        color: colors.textPrimary,
        marginBottom: 8,
    },
    calendarSubtitle: {
        fontSize: typography.size.sm,
        color: colors.textSecondary,
        marginBottom: layout.spacing.xl,
    },
    dotsContainer: {
        alignItems: 'center',
        gap: 8,
    },
    dot: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.border,
        margin: 4,
    },
    dotSpacer: {
        width: 28,
        height: 28,
        margin: 4,
    },
    dotActive: {
        backgroundColor: colors.primary + '40',
    },
    dotToday: {
        backgroundColor: colors.primary,
        borderWidth: 3,
        borderColor: colors.primary + '50',
    },
    startButton: {
        marginTop: layout.spacing.xl,
        backgroundColor: colors.primary,
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: layout.borderRadius.xl,
    },
    startButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: typography.size.md,
    },
    // Summary card
    summaryCard: {
        marginHorizontal: layout.spacing.md,
        marginBottom: layout.spacing.md,
        padding: layout.spacing.md,
        backgroundColor: colors.primary + '10',
        borderColor: colors.primary + '30',
    },
    summaryLabel: {
        fontSize: typography.size.xs,
        fontWeight: 'bold',
        color: colors.primary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 6,
    },
    summaryText: {
        fontSize: typography.size.sm,
        color: colors.textPrimary,
        lineHeight: 20,
    },
    // Chat styles
    chatContainer: {
        padding: layout.spacing.md,
        paddingBottom: layout.spacing.md,
    },
    messageBubble: {
        maxWidth: '80%',
        marginBottom: layout.spacing.sm,
        borderRadius: 16,
        padding: layout.spacing.md,
    },
    aiBubble: {
        backgroundColor: colors.surface,
        borderBottomLeftRadius: 4,
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: colors.border,
    },
    userBubble: {
        backgroundColor: colors.primary,
        borderBottomRightRadius: 4,
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
        paddingBottom: layout.spacing.sm,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: layout.borderRadius.xl,
        paddingHorizontal: layout.spacing.md,
        paddingVertical: layout.spacing.xs,
        borderWidth: 1,
        borderColor: colors.borderDark,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
    },
    input: {
        flex: 1,
        fontSize: typography.size.md,
        color: colors.textPrimary,
        maxHeight: 100,
        paddingTop: 10,
        paddingBottom: 10,
    },
    sendButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: layout.spacing.sm,
    },
    // Read-only banner
    readOnlyBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: layout.spacing.md,
        paddingBottom: layout.spacing.sm,
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.borderDark,
    },
    readOnlyText: {
        fontSize: typography.size.sm,
        color: colors.textSecondary,
    },
    backToTodayLink: {
        fontSize: typography.size.sm,
        fontWeight: 'bold',
        color: colors.primary,
    },
});

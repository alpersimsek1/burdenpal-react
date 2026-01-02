// Chat Detail Screen for expo-router
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Send } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { colors } from '../src/theme/colors';
import { layout } from '../src/theme/layout';
import { typography } from '../src/theme/typography';

const BG_PAL = require('../assets/backgrounds/bg_pal.png');

// Avatar mapping
const AVATARS: { [key: string]: any } = {
    '1': require('../assets/avatars/female1.png'),
    '2': require('../assets/avatars/male1.png'),
    '3': require('../assets/avatars/female2.png'),
    '4': require('../assets/avatars/male2.png'),
};

// Mock messages for different users
const CHAT_HISTORY: { [key: string]: any[] } = {
    '1': [ // Sarah Chen
        { id: 'm1', sender: 'them', text: 'Hey! How are you feeling today? 😊', time: '10:30 AM' },
        { id: 'm2', sender: 'me', text: 'I\'m doing much better! Thanks for checking in.', time: '10:32 AM' },
        { id: 'm3', sender: 'them', text: 'That\'s great to hear! Remember, I\'m always here if you need to talk.', time: '10:33 AM' },
        { id: 'm4', sender: 'me', text: 'I really appreciate that. It means a lot to have someone who listens.', time: '10:35 AM' },
        { id: 'm5', sender: 'them', text: 'Of course! That sounds like a great idea! Let me know how it goes. 💪', time: '10:36 AM' },
    ],
    '2': [ // Marcus Johnson
        { id: 'm1', sender: 'me', text: 'Thanks for the advice yesterday!', time: 'Yesterday' },
        { id: 'm2', sender: 'them', text: 'No problem at all! Happy to help. How did it go?', time: 'Yesterday' },
        { id: 'm3', sender: 'me', text: 'It went really well. I feel more confident now.', time: 'Yesterday' },
        { id: 'm4', sender: 'them', text: 'Thanks for sharing that with me. I really appreciate it. 🙏', time: '1h ago' },
    ],
    '3': [ // Emma Williams
        { id: 'm1', sender: 'them', text: 'How are you feeling today? ☀️', time: '3h ago' },
    ]
};

export default function ChatDetailScreen() {
    const router = useRouter();
    const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
    const flatListRef = useRef<FlatList>(null);

    const [messages, setMessages] = useState(CHAT_HISTORY[id || '1'] || []);
    const [inputText, setInputText] = useState('');

    const avatar = AVATARS[id || '1'] || AVATARS['1'];

    const sendMessage = () => {
        if (!inputText.trim()) return;

        const newMessage = {
            id: Date.now().toString(),
            sender: 'me',
            text: inputText.trim(),
            time: 'Now'
        };

        setMessages([...messages, newMessage]);
        setInputText('');

        // Scroll to bottom after sending
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const renderMessage = ({ item, index }: { item: any; index: number }) => {
        const isMe = item.sender === 'me';
        const showAvatar = !isMe && (index === 0 || messages[index - 1]?.sender === 'me');

        return (
            <View style={[
                styles.messageRow,
                isMe ? styles.myMessageRow : styles.theirMessageRow
            ]}>
                {!isMe && (
                    <View style={styles.avatarSpace}>
                        {showAvatar && (
                            <Image source={avatar} style={styles.messageAvatar} />
                        )}
                    </View>
                )}
                <BlurView
                    intensity={isMe ? 0 : 50}
                    tint="light"
                    style={[
                        styles.messageBubble,
                        isMe ? styles.myBubble : styles.theirBubble
                    ]}
                >
                    <Text style={[
                        styles.messageText,
                        isMe ? styles.myMessageText : styles.theirMessageText
                    ]}>{item.text}</Text>
                    <Text style={[
                        styles.timeText,
                        isMe ? styles.myTimeText : styles.theirTimeText
                    ]}>{item.time}</Text>
                </BlurView>
            </View>
        );
    };

    return (
        <LinearGradient
            colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            {/* Header */}
            <BlurView intensity={60} tint="light" style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>

                <View style={styles.headerCenter}>
                    <Image source={avatar} style={styles.headerAvatar} />
                    <Text style={styles.headerTitle}>{name}</Text>
                </View>

                {/* Spacer to balance the header */}
                <View style={{ width: 40 }} />
            </BlurView>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.chatList}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                />

                <BlurView intensity={80} tint="light" style={styles.inputArea}>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Type a message..."
                            placeholderTextColor={colors.textSecondary}
                            value={inputText}
                            onChangeText={setInputText}
                            multiline
                        />
                        <TouchableOpacity
                            style={[styles.sendButton, { opacity: inputText.trim().length > 0 ? 1 : 0.5 }]}
                            disabled={inputText.trim().length === 0}
                            onPress={sendMessage}
                        >
                            <LinearGradient
                                colors={[colors.accent, colors.moodProgress]}
                                style={styles.sendButtonGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Send size={20} color="#FFF" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </BlurView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: layout.spacing.lg,
        paddingTop: 60,
        paddingBottom: layout.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.glassBorder,
        overflow: 'hidden',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.glass,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: colors.glassBorder,
    },
    headerTitle: {
        fontSize: typography.size.lg,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    chatList: {
        paddingHorizontal: layout.spacing.lg,
        paddingTop: layout.spacing.md,
        paddingBottom: layout.spacing.xl,
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 8,
    },
    myMessageRow: {
        justifyContent: 'flex-end',
    },
    theirMessageRow: {
        justifyContent: 'flex-start',
    },
    avatarSpace: {
        width: 36,
        marginRight: 8,
    },
    messageAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    messageBubble: {
        maxWidth: '75%',
        padding: 14,
        borderRadius: 20,
        overflow: 'hidden',
    },
    myBubble: {
        backgroundColor: colors.textPrimary,
        borderBottomRightRadius: 6,
    },
    theirBubble: {
        backgroundColor: colors.glass,
        borderBottomLeftRadius: 6,
        borderWidth: 1,
        borderColor: colors.glassBorder,
    },
    messageText: {
        fontSize: typography.size.md,
        lineHeight: 22,
    },
    myMessageText: {
        color: '#FFFFFF',
    },
    theirMessageText: {
        color: colors.textPrimary,
    },
    timeText: {
        fontSize: 10,
        marginTop: 6,
        alignSelf: 'flex-end',
    },
    myTimeText: {
        color: 'rgba(255,255,255,0.7)',
    },
    theirTimeText: {
        color: colors.textSecondary,
    },
    inputArea: {
        padding: layout.spacing.md,
        paddingBottom: layout.spacing.xl,
        borderTopWidth: 1,
        borderTopColor: colors.glassBorder,
        overflow: 'hidden',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.glass,
        borderRadius: layout.borderRadius.xl,
        paddingLeft: layout.spacing.md,
        paddingRight: 6,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: colors.glassBorder,
    },
    input: {
        flex: 1,
        fontSize: typography.size.md,
        color: colors.textPrimary,
        maxHeight: 100,
        paddingTop: 8,
        paddingBottom: 8,
    },
    sendButton: {
        marginLeft: layout.spacing.sm,
    },
    sendButtonGradient: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

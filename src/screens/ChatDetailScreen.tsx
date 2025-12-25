import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Send } from 'lucide-react-native';
import { Screen } from '../components/Screen';
import { layout } from '../theme/layout';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';

// Mock messages for different users
const CHAT_HISTORY = {
    '1': [ // James
        { id: 'm1', sender: 'them', text: 'Hey! Did you finish the task?', time: '10:30 AM' },
        { id: 'm2', sender: 'me', text: 'Almost! Just wrapping up the documentation.', time: '10:32 AM' },
        { id: 'm3', sender: 'them', text: 'Awesome, let me know when it’s done.', time: '10:33 AM' },
    ],
    '2': [ // Mia
        { id: 'm1', sender: 'me', text: 'Thanks for the advice yesterday!', time: 'Yesterday' },
        { id: 'm2', sender: 'them', text: 'No problem at all! Happy to help.', time: 'Yesterday' },
    ],
    '3': [ // Lucas
        { id: 'm1', sender: 'them', text: 'Let’s sync tomorrow.', time: '3h ago' },
    ]
};

export function ChatDetailScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { id, name } = route.params as any;

    const [messages, setMessages] = useState(CHAT_HISTORY[id as keyof typeof CHAT_HISTORY] || []);
    const [inputText, setInputText] = useState('');

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
    };

    const renderMessage = ({ item }: { item: any }) => {
        const isMe = item.sender === 'me';
        return (
            <View style={[
                styles.messageRow,
                isMe ? styles.myMessageRow : styles.theirMessageRow
            ]}>
                {!isMe && (
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{name[0]}</Text>
                    </View>
                )}
                <View style={[
                    styles.messageBubble,
                    isMe ? styles.myBubble : styles.theirBubble
                ]}>
                    <Text style={[
                        styles.messageText,
                        isMe ? styles.myMessageText : styles.theirMessageText
                    ]}>{item.text}</Text>
                    <Text style={[
                        styles.timeText,
                        isMe ? styles.myTimeText : styles.theirTimeText
                    ]}>{item.time}</Text>
                </View>
            </View>
        );
    };

    return (
        <Screen>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <View style={styles.headerAvatar}>
                        <Text style={styles.headerAvatarText}>{name[0]}</Text>
                    </View>
                    <Text style={styles.headerTitle}>{name}</Text>
                </View>
                <View style={{ width: 24 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <FlatList
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.chatList}
                    showsVerticalScrollIndicator={false}
                />

                <View style={styles.inputArea}>
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
                            <Send color={colors.surface} size={18} />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: layout.spacing.lg,
        paddingTop: layout.spacing.sm,
        paddingBottom: layout.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderDark,
        backgroundColor: colors.background + '90', // slightly transparent
    },
    backButton: {
        padding: 4,
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerAvatarText: {
        fontSize: typography.size.sm,
        fontWeight: 'bold',
        color: colors.primary,
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
        gap: layout.spacing.sm,
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 8,
        gap: 8,
    },
    myMessageRow: {
        justifyContent: 'flex-end',
    },
    theirMessageRow: {
        justifyContent: 'flex-start',
    },
    avatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    avatarText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: colors.primary,
    },
    messageBubble: {
        maxWidth: '75%',
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    myBubble: {
        backgroundColor: colors.primary,
        borderBottomRightRadius: 4,
    },
    theirBubble: {
        backgroundColor: colors.surface,
        borderColor: colors.borderDark,
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: typography.size.md,
        lineHeight: 20,
    },
    myMessageText: {
        color: colors.surface,
    },
    theirMessageText: {
        color: colors.textPrimary,
    },
    timeText: {
        fontSize: 10,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    myTimeText: {
        color: colors.surface + '90',
    },
    theirTimeText: {
        color: colors.textSecondary,
    },
    inputArea: {
        padding: layout.spacing.md,
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.borderDark,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: layout.borderRadius.xl,
        paddingHorizontal: layout.spacing.md,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: colors.borderDark,
    },
    input: {
        flex: 1,
        fontSize: typography.size.md,
        color: colors.textPrimary,
        maxHeight: 100,
        paddingTop: 4, // Align text with button
        paddingBottom: 4,
    },
    sendButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: layout.spacing.sm,
    },
});

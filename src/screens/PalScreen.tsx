import React, { useState } from 'react';
import {
    Text,
    StyleSheet,
    View,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import { Send } from 'lucide-react-native';
import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { layout } from '../theme/layout';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';

export function PalScreen() {
    const [message, setMessage] = useState('');

    return (
        <Screen>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.flex}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Your AI Pal</Text>
                    <Text style={styles.subtitle}>Always here to listen.</Text>
                </View>

                <ScrollView contentContainerStyle={styles.chatContainer}>
                    <Card style={styles.aiMessage}>
                        <View style={styles.messageInner}>
                            <Text style={styles.messageText}>
                                Hi there. I'm here to listen without judgment. How are you feeling today?
                            </Text>
                        </View>
                    </Card>
                </ScrollView>

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
                        >
                            <Send color={colors.surface} size={20} />
                        </TouchableOpacity>
                    </View>
                </View>
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
    title: {
        fontSize: typography.size.xxl,
        fontWeight: typography.weight.bold as any,
        color: colors.textPrimary,
    },
    subtitle: {
        fontSize: typography.size.md,
        color: colors.textSecondary,
    },
    chatContainer: {
        padding: layout.spacing.md,
    },
    aiMessage: {
        backgroundColor: colors.surface,
        padding: 0, // Reset default card padding for custom control
        borderBottomLeftRadius: 4,
        maxWidth: '85%',
        alignSelf: 'flex-start',
    },
    messageInner: {
        padding: layout.spacing.md,
    },
    messageText: {
        fontSize: typography.size.md,
        color: colors.textPrimary,
        lineHeight: 22,
    },
    inputArea: {
        padding: layout.spacing.md,
        paddingBottom: Platform.OS === 'ios' ? 100 : layout.spacing.md, // Account for bottom tab height
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
});

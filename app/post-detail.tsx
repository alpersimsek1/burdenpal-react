// Post Detail Screen for expo-router
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowBigUp, ArrowLeft, MessageSquare, MoreHorizontal, Send } from 'lucide-react-native';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Card } from '../src/components/Card';
import { Screen } from '../src/components/Screen';
import { colors } from '../src/theme/colors';
import { layout } from '../src/theme/layout';
import { typography } from '../src/theme/typography';

const COMMENTS = [
    { id: 'c1', author: 'helpful_user', time: '1h', body: 'This is great advice! Thanks for sharing.', upvotes: 12 },
    { id: 'c2', author: 'lurker_01', time: '30m', body: 'I totally agree with this.', upvotes: 5 },
    { id: 'c3', author: 'random_person', time: '10m', body: 'Can you elaborate on the second point?', upvotes: 2 },
    { id: 'c4', author: 'expert_dev', time: '5m', body: 'Also consider trying out different approaches to this problem.', upvotes: 8 },
];

export default function PostDetailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    // Parse post data from params (serialized as JSON string or individual params)
    const post = {
        community: params.community as string,
        author: params.author as string,
        time: params.time as string,
        title: params.title as string,
        body: params.body as string,
        upvotes: Number(params.upvotes) || 0,
        comments: Number(params.comments) || 0,
    };
    const communityColor = params.communityColor as string;

    const [comment, setComment] = useState('');

    return (
        <Screen>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Post Details</Text>
                <View style={{ width: 24 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView contentContainerStyle={styles.content}>
                    <Card style={styles.postCard}>
                        <View style={styles.postHeader}>
                            <View style={styles.metaLeft}>
                                <View style={[styles.communityDot, { backgroundColor: communityColor || colors.primary }]} />
                                <Text style={styles.communityName}>{post.community}</Text>
                                <Text style={styles.metaText}>• Posted by {post.author} • {post.time}</Text>
                            </View>
                            <MoreHorizontal size={16} color={colors.textSecondary} />
                        </View>

                        <Text style={styles.postTitle}>{post.title}</Text>
                        <Text style={styles.postBody}>{post.body}</Text>

                        <View style={styles.postFooter}>
                            <View style={styles.actionButton}>
                                <ArrowBigUp size={20} color={colors.textSecondary} />
                                <Text style={styles.actionText}>{post.upvotes}</Text>
                            </View>
                            <View style={styles.actionButton}>
                                <MessageSquare size={18} color={colors.textSecondary} />
                                <Text style={styles.actionText}>{post.comments} Comments</Text>
                            </View>
                        </View>
                    </Card>

                    <Text style={styles.commentsHeader}>Comments</Text>

                    <View style={styles.commentsList}>
                        {COMMENTS.map((c) => (
                            <View key={c.id} style={styles.commentItem}>
                                <View style={styles.commentHeader}>
                                    <Text style={styles.commentAuthor}>{c.author}</Text>
                                    <Text style={styles.commentTime}>• {c.time}</Text>
                                </View>
                                <Text style={styles.commentBody}>{c.body}</Text>
                                <View style={styles.commentFooter}>
                                    <ArrowBigUp size={16} color={colors.textSecondary} />
                                    <Text style={styles.commentUpvotes}>{c.upvotes}</Text>
                                    <Text style={styles.replyText}>Reply</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>

                <View style={styles.inputArea}>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Add a comment..."
                            placeholderTextColor={colors.textSecondary}
                            value={comment}
                            onChangeText={setComment}
                            multiline
                        />
                        <TouchableOpacity
                            style={[styles.sendButton, { opacity: comment.trim().length > 0 ? 1 : 0.5 }]}
                            disabled={comment.trim().length === 0}
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
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: typography.size.lg,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    content: {
        paddingBottom: layout.spacing.xl,
    },
    postCard: {
        marginHorizontal: layout.spacing.lg,
        marginBottom: layout.spacing.lg,
        borderRadius: layout.borderRadius.md,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.borderDark,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    postHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: layout.spacing.sm,
    },
    metaLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        flexWrap: 'wrap',
    },
    communityDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },
    communityName: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginRight: 6,
    },
    metaText: {
        fontSize: 11,
        color: colors.textSecondary,
    },
    postTitle: {
        fontSize: typography.size.xl,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: layout.spacing.xs,
        lineHeight: 28,
    },
    postBody: {
        fontSize: typography.size.md,
        color: colors.textSecondary,
        lineHeight: 24,
        marginBottom: layout.spacing.md,
    },
    postFooter: {
        flexDirection: 'row',
        gap: 20,
        borderTopWidth: 1,
        borderTopColor: colors.borderDark + '40',
        paddingTop: layout.spacing.sm,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: colors.background,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
    },
    actionText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    commentsHeader: {
        paddingHorizontal: layout.spacing.lg,
        fontSize: typography.size.md,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: layout.spacing.md,
    },
    commentsList: {
        paddingHorizontal: layout.spacing.lg,
        gap: layout.spacing.md,
    },
    commentItem: {
        backgroundColor: colors.surface,
        padding: layout.spacing.md,
        borderRadius: layout.borderRadius.md,
        borderWidth: 1,
        borderColor: colors.borderDark,
    },
    commentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    commentAuthor: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    commentTime: {
        fontSize: 11,
        color: colors.textSecondary,
        marginLeft: 6,
    },
    commentBody: {
        fontSize: typography.size.sm,
        color: colors.textPrimary,
        lineHeight: 20,
        marginBottom: 8,
    },
    commentFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    commentUpvotes: {
        fontSize: 11,
        color: colors.textSecondary,
    },
    replyText: {
        fontSize: 11,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    inputArea: {
        padding: layout.spacing.md,
        paddingBottom: Platform.OS === 'ios' ? 40 : layout.spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.borderDark,
        backgroundColor: colors.background,
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
        maxHeight: 80,
        paddingTop: 4,
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

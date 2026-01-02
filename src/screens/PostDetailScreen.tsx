import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowBigUp, MessageSquare, Send } from 'lucide-react-native';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { typography } from '../theme/typography';

const COMMENTS = [
    { id: 'c1', author: 'helpful_user', time: '1h', body: 'This is great advice! Thanks for sharing.', likes: 12 },
    { id: 'c2', author: 'lurker_01', time: '30m', body: 'I totally agree with this.', likes: 5 },
    { id: 'c3', author: 'random_person', time: '10m', body: 'Can you elaborate on the second point?', likes: 2 },
    { id: 'c4', author: 'expert_dev', time: '5m', body: 'Also consider trying out different approaches to this problem.', likes: 8 },
];

export function PostDetailScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { post, communityColor } = route.params as any;
    const [reply, setReply] = useState('');

    // Set navigation title
    React.useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Post',
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 20}
            >
                <ScrollView contentContainerStyle={styles.content}>
                    {/* Main Post */}
                    <View style={styles.postContainer}>
                        <View style={styles.postMeta}>
                            <View style={[styles.communityDot, { backgroundColor: communityColor || colors.accent }]} />
                            <Text style={styles.communityName}>{post.community}</Text>
                            <Text style={styles.metaText}>• Posted by {post.author} • {post.time}</Text>
                        </View>

                        <Text style={styles.postTitle}>{post.title}</Text>
                        <Text style={styles.postBody}>{post.body}</Text>

                        <View style={styles.actionsRow}>
                            <View style={styles.actionItem}>
                                <ArrowBigUp size={20} color={colors.textSecondary} />
                                <Text style={styles.actionCount}>{post.upvotes}</Text>
                            </View>
                            <View style={styles.actionItem}>
                                <MessageSquare size={18} color={colors.textSecondary} />
                                <Text style={styles.actionCount}>{post.comments} Comments</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.separator} />

                    {/* Comments Section */}
                    <Text style={styles.commentsHeader}>Comments</Text>

                    {COMMENTS.map((comment) => (
                        <View key={comment.id} style={styles.commentContainer}>
                            <View style={styles.commentHeader}>
                                <Text style={styles.commentAuthor}>{comment.author}</Text>
                                <Text style={styles.commentTime}>• {comment.time}</Text>
                            </View>
                            <Text style={styles.commentBody}>{comment.body}</Text>
                            <View style={styles.commentActions}>
                                <ArrowBigUp size={16} color={colors.textSecondary} />
                                <Text style={styles.commentLikes}>{comment.likes}</Text>
                                <Text style={styles.replyLink}>Reply</Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>

                {/* Reply Input */}
                <View style={styles.inputBar}>
                    <TextInput
                        style={styles.input}
                        placeholder="Add a comment..."
                        placeholderTextColor={colors.textLight}
                        value={reply}
                        onChangeText={setReply}
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, { opacity: reply.trim().length > 0 ? 1 : 0.5 }]}
                        disabled={reply.trim().length === 0}
                    >
                        <Send size={18} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        paddingBottom: layout.spacing.xl,
    },
    postContainer: {
        paddingHorizontal: layout.spacing.lg,
        paddingVertical: layout.spacing.lg,
    },
    postMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: layout.spacing.sm,
        flexWrap: 'wrap',
    },
    communityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    communityName: {
        fontSize: 13,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    metaText: {
        fontSize: 13,
        color: colors.textSecondary,
        marginLeft: 4,
    },
    postTitle: {
        fontSize: typography.size.xl,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: layout.spacing.sm,
        lineHeight: 28,
    },
    postBody: {
        fontSize: typography.size.md,
        color: colors.textSecondary,
        lineHeight: 24,
        marginBottom: layout.spacing.lg,
    },
    actionsRow: {
        flexDirection: 'row',
        gap: 20,
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    actionCount: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    separator: {
        height: 1,
        backgroundColor: colors.borderDark,
    },
    commentsHeader: {
        fontSize: typography.size.md,
        fontWeight: 'bold',
        color: colors.textPrimary,
        paddingHorizontal: layout.spacing.lg,
        paddingVertical: layout.spacing.md,
    },
    commentContainer: {
        paddingHorizontal: layout.spacing.lg,
        paddingVertical: layout.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderDark,
    },
    commentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    commentAuthor: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    commentTime: {
        fontSize: 13,
        color: colors.textSecondary,
        marginLeft: 6,
    },
    commentBody: {
        fontSize: typography.size.md,
        color: colors.textPrimary,
        lineHeight: 22,
        marginBottom: layout.spacing.sm,
    },
    commentActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    commentLikes: {
        fontSize: 13,
        color: colors.textSecondary,
    },
    replyLink: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.textSecondary,
        marginLeft: 8,
    },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: layout.spacing.lg,
        paddingVertical: layout.spacing.md,
        paddingBottom: Platform.OS === 'ios' ? 40 : layout.spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.borderDark,
        backgroundColor: colors.background,
        gap: 12,
    },
    input: {
        flex: 1,
        fontSize: typography.size.md,
        color: colors.textPrimary,
        paddingVertical: 8,
    },
    sendButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

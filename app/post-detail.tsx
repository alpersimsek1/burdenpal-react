// Post Detail Screen for expo-router
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowBigUp, ArrowLeft, MessageSquare, MoreHorizontal, Send } from 'lucide-react-native';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors } from '../src/theme/colors';
import { layout } from '../src/theme/layout';
import { typography } from '../src/theme/typography';

const COMMENTS = [
    { id: 'c1', author: 'helpful_user', time: '1h', body: 'This is great advice! Thanks for sharing.', likes: 12 },
    { id: 'c2', author: 'lurker_01', time: '30m', body: 'I totally agree with this.', likes: 5 },
    { id: 'c3', author: 'random_person', time: '10m', body: 'Can you elaborate on the second point?', likes: 2 },
    { id: 'c4', author: 'expert_dev', time: '5m', body: 'Also consider trying out different approaches to this problem.', likes: 8 },
];

export default function PostDetailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    // Parse post data from params
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

    const [reply, setReply] = useState('');

    return (
        <LinearGradient
            colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <SafeAreaView style={styles.safeArea}>
                {/* Custom Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ArrowLeft size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Post</Text>
                    <TouchableOpacity style={styles.menuButton}>
                        <MoreHorizontal size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
                >
                    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                        {/* Main Post Card */}
                        <BlurView intensity={40} tint="light" style={styles.postCard}>
                            <View style={styles.postMeta}>
                                <View style={[styles.communityDot, { backgroundColor: communityColor || colors.accent }]} />
                                <Text style={styles.communityName}>{post.community}</Text>
                                <Text style={styles.metaText}>• {post.time}</Text>
                            </View>

                            <View style={styles.authorInfo}>
                                <View style={[styles.avatarPlaceholder, { backgroundColor: communityColor || colors.accent }]}>
                                    <Text style={styles.avatarInitial}>{post.author?.charAt(0).toUpperCase()}</Text>
                                </View>
                                <Text style={styles.authorName}>{post.author}</Text>
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
                        </BlurView>

                        {/* Comments Label */}
                        <Text style={styles.sectionLabel}>Discussion</Text>

                        {/* Comments List */}
                        {COMMENTS.map((comment) => (
                            <View key={comment.id} style={styles.commentCard}>
                                <View style={styles.commentHeader}>
                                    <Text style={styles.commentAuthor}>{comment.author}</Text>
                                    <Text style={styles.commentTime}>• {comment.time}</Text>
                                </View>
                                <Text style={styles.commentBody}>{comment.body}</Text>
                                <View style={styles.commentActions}>
                                    <TouchableOpacity style={styles.actionItem}>
                                        <ArrowBigUp size={16} color={colors.textSecondary} />
                                        <Text style={styles.commentLikes}>{comment.likes}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <Text style={styles.replyLink}>Reply</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </ScrollView>

                    {/* Input Bar */}
                    <BlurView intensity={80} tint="light" style={styles.inputContainer}>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder="Add to the discussion..."
                                placeholderTextColor={colors.textSecondary}
                                value={reply}
                                onChangeText={setReply}
                                multiline
                            />
                            <TouchableOpacity
                                style={[styles.sendButton, { opacity: reply.trim().length > 0 ? 1 : 0.5 }]}
                                disabled={reply.trim().length === 0}
                            >
                                <LinearGradient
                                    colors={[colors.accent, colors.moodProgress]}
                                    style={styles.sendButtonGradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    <Send size={18} color="#FFF" />
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </BlurView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: layout.spacing.lg,
        paddingVertical: layout.spacing.md,
    },
    headerTitle: {
        fontSize: typography.size.lg,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    menuButton: {
        width: 40,
        height: 40,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    content: {
        paddingHorizontal: 0, // Full width
        paddingBottom: 100, // Space for input
        paddingTop: 10,
    },
    // Main Post
    // Main Post
    postCard: {
        padding: layout.spacing.lg,
        width: '100%',
        backgroundColor: 'transparent',
    },
    // ... (rest of styles)
    postMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    communityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    communityName: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    metaText: {
        fontSize: 12,
        color: colors.textSecondary,
        marginLeft: 4,
    },
    authorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: layout.spacing.md,
        gap: 8,
    },
    avatarPlaceholder: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInitial: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    authorName: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    postTitle: {
        fontSize: typography.size.xl,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 8,
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
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingBottom: 12,
        borderBottomWidth: 1, // Separator
        borderBottomColor: colors.border,
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
    sectionLabel: {
        fontSize: typography.size.md,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: layout.spacing.md,
        marginLeft: layout.spacing.lg,
        marginTop: layout.spacing.md,
    },
    // Comments
    commentCard: {
        paddingHorizontal: layout.spacing.lg,
        paddingVertical: layout.spacing.md,
        backgroundColor: 'transparent',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    commentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    commentAuthor: {
        fontSize: 13,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    commentTime: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    commentBody: {
        fontSize: 14,
        color: colors.textPrimary,
        lineHeight: 20,
        marginBottom: 8,
    },
    commentActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    commentLikes: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    replyLink: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    // Input
    inputContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: layout.spacing.lg,
        paddingTop: 12,
        paddingBottom: Platform.OS === 'ios' ? 40 : 12,
        borderTopWidth: 1,
        borderTopColor: colors.glassBorder,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        paddingHorizontal: 8,
        paddingVertical: 8,
        minHeight: 48,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: colors.textPrimary,
        paddingHorizontal: 10,
        paddingTop: 0,
        paddingBottom: 0,
        maxHeight: 100,
    },
    sendButton: {
        marginLeft: 8,
    },
    sendButtonGradient: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

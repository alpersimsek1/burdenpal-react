// Post Detail Screen - Industrial Minimalist
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, ArrowUpRight } from 'lucide-react-native';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors } from '../src/theme/colors';
import { layout } from '../src/theme/layout';

const COMMENTS = [
    { id: 'c1', author: 'helpful_user', time: '1H AGO', body: 'This is great advice! Thanks for sharing.', likes: 12 },
    { id: 'c2', author: 'lurker_01', time: '30M AGO', body: 'I totally agree with this.', likes: 5 },
    { id: 'c3', author: 'random_user', time: '10M AGO', body: 'Can you elaborate on the second point?', likes: 2 },
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
        <View style={styles.container}>
            <LinearGradient
                colors={[communityColor || colors.primary, 'transparent']}
                style={styles.abstractBlob}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
                locations={[0, 0.4]}
            />

            <SafeAreaView style={styles.safeArea}>
                {/* Industrial Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ArrowLeft size={28} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerSubtitle}>THREAD /</Text>
                        <Text style={styles.headerTitle}>{post.community?.toUpperCase()}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
                >
                    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                        {/* Main Post */}
                        <View style={styles.mainPostContainer}>
                            <View style={styles.metaRow}>
                                <View style={[styles.avatarBox, { backgroundColor: communityColor || colors.accent }]}>
                                    <Text style={styles.avatarText}>{post.author?.charAt(0).toUpperCase()}</Text>
                                </View>
                                <View>
                                    <Text style={styles.authorText}>@{post.author?.toUpperCase()}</Text>
                                    <Text style={styles.timeText}>{post.time?.toUpperCase()}</Text>
                                </View>
                            </View>

                            <Text style={styles.postTitle}>{post.title}</Text>
                            <Text style={styles.postBody}>{post.body}</Text>

                            <View style={styles.statsRow}>
                                <View style={styles.statTag}>
                                    <Text style={styles.statLabel}>{post.upvotes} UPVOTES</Text>
                                </View>
                                <View style={styles.statTag}>
                                    <Text style={styles.statLabel}>{post.comments} COMMENTS</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.sectionDivider}>
                            <Text style={styles.sectionTitle}>DISCUSSION ({COMMENTS.length})</Text>
                        </View>

                        {/* Comments List */}
                        {COMMENTS.map((comment) => (
                            <View key={comment.id} style={styles.commentItem}>
                                <View style={styles.commentHeader}>
                                    <Text style={styles.commentAuthor}>@{comment.author.toUpperCase()}</Text>
                                    <Text style={styles.commentTime}>{comment.time}</Text>
                                </View>
                                <Text style={styles.commentBody}>{comment.body}</Text>
                                <TouchableOpacity style={styles.replyButton}>
                                    <Text style={styles.replyText}>REPLY</Text>
                                    <ArrowUpRight size={12} color={colors.textSecondary} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>

                    {/* Input Area - Industrial Box */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="TYPE YOUR REPLY..."
                            placeholderTextColor={colors.textSecondary}
                            value={reply}
                            onChangeText={setReply}
                        />
                        <TouchableOpacity style={styles.sendButton}>
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
        right: 0,
        width: 400,
        height: 400,
        opacity: 0.1,
    },
    header: {
        paddingHorizontal: layout.spacing.xl,
        paddingTop: layout.spacing.lg,
        paddingBottom: layout.spacing.md,
    },
    backButton: {
        marginBottom: layout.spacing.md,
        alignSelf: 'flex-start',
    },
    headerTitleContainer: {
        gap: 2,
    },
    headerSubtitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.textSecondary,
        letterSpacing: 1,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: colors.textPrimary,
        letterSpacing: -0.5,
    },
    divider: {
        height: 1,
        backgroundColor: colors.textPrimary,
        marginHorizontal: layout.spacing.lg,
    },
    content: {
        paddingBottom: 100,
    },
    // Main Post
    mainPostContainer: {
        padding: layout.spacing.xl,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    avatarBox: {
        width: 40,
        height: 40,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.textPrimary,
    },
    avatarText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 18,
    },
    authorText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.textPrimary,
        letterSpacing: 0.5,
    },
    timeText: {
        fontSize: 12,
        fontFamily: 'Courier',
        color: colors.textSecondary,
    },
    postTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: colors.textPrimary,
        marginBottom: 12,
        lineHeight: 34,
    },
    postBody: {
        fontSize: 18,
        color: colors.textPrimary, // Darker text for readability in detail
        lineHeight: 28,
        marginBottom: 24,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    statTag: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: colors.borderDark,
        backgroundColor: 'transparent',
    },
    statLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    // Comments Section
    sectionDivider: {
        borderTopWidth: 1,
        borderTopColor: colors.borderDark,
        paddingHorizontal: layout.spacing.xl,
        paddingVertical: 16,
        backgroundColor: 'rgba(0,0,0,0.02)',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 1,
        color: colors.textSecondary,
    },
    commentItem: {
        paddingHorizontal: layout.spacing.xl,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderDark,
    },
    commentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    commentAuthor: {
        fontSize: 13,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    commentTime: {
        fontSize: 12,
        fontFamily: 'Courier',
        color: colors.textSecondary,
    },
    commentBody: {
        fontSize: 15,
        color: colors.textPrimary,
        lineHeight: 22,
        marginBottom: 12,
    },
    replyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        alignSelf: 'flex-start',
    },
    replyText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.textSecondary,
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
        height: 50,
    },
    sendButton: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.surfaceWarm,
        borderWidth: 1,
        borderColor: colors.textPrimary,
    }
});

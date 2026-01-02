// Topic Feed Screen for expo-router
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowBigUp, ArrowLeft, MessageSquare, MoreHorizontal } from 'lucide-react-native';
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { POSTS } from '../src/data/communityData';
import { colors } from '../src/theme/colors';
import { layout } from '../src/theme/layout';
import { typography } from '../src/theme/typography';

const TAB_BAR_HEIGHT = 100;

export default function TopicFeedScreen() {
    const router = useRouter();
    const { communityId, communityName, communityColor } = useLocalSearchParams<{
        communityId: string;
        communityName: string;
        communityColor: string;
    }>();

    const filteredPosts = POSTS.filter(p => p.community === communityName);

    const renderPost = ({ item }: { item: typeof POSTS[0] }) => (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push({
                pathname: '/post-detail',
                params: {
                    community: item.community,
                    author: item.author,
                    time: item.time,
                    title: item.title,
                    body: item.body,
                    upvotes: item.upvotes.toString(),
                    comments: item.comments.toString(),
                    communityColor: communityColor || colors.accent,
                }
            })}
            style={styles.postWrapper}
        >
            <BlurView intensity={40} tint="light" style={styles.postCard}>
                {/* Header */}
                <View style={styles.postHeader}>
                    <View style={styles.authorRow}>
                        <View style={[styles.avatarPlaceholder, { backgroundColor: communityColor || colors.accent }]}>
                            <Text style={styles.avatarInitial}>{item.author.charAt(0).toUpperCase()}</Text>
                        </View>
                        <View>
                            <Text style={styles.authorText}>{item.author}</Text>
                            <Text style={styles.timeText}>{item.time}</Text>
                        </View>
                    </View>
                    <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <MoreHorizontal size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <Text style={styles.postTitle}>{item.title}</Text>
                <Text style={styles.postBody} numberOfLines={3}>{item.body}</Text>

                {/* Actions */}
                <View style={styles.actionsRow}>
                    <View style={styles.actionItem}>
                        <ArrowBigUp size={20} color={colors.textSecondary} />
                        <Text style={styles.actionCount}>{item.upvotes}</Text>
                    </View>
                    <View style={styles.actionItem}>
                        <MessageSquare size={18} color={colors.textSecondary} />
                        <Text style={styles.actionCount}>{item.comments}</Text>
                    </View>
                </View>
            </BlurView>
        </TouchableOpacity>
    );

    return (
        <LinearGradient
            colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <SafeAreaView style={styles.safeArea}>
                {/* Custom Blended Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButton}
                    >
                        <ArrowLeft size={24} color={colors.textPrimary} />
                    </TouchableOpacity>

                    <View style={styles.headerTitleContainer}>
                        <View style={[styles.communityDot, { backgroundColor: communityColor || colors.accent }]} />
                        <Text style={styles.headerTitle}>{communityName}</Text>
                    </View>

                    <View style={{ width: 40 }} />
                </View>

                <FlatList
                    data={filteredPosts}
                    renderItem={renderPost}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.feed}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No posts yet in {communityName}.</Text>
                            <Text style={styles.emptySubtext}>Be the first to start a conversation!</Text>
                        </View>
                    }
                />
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
        marginBottom: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    communityDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    headerTitle: {
        fontSize: typography.size.lg,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    feed: {
        paddingBottom: TAB_BAR_HEIGHT,
        // Removed paddingHorizontal to stretch to sides
    },
    separator: {
        height: 1,
        backgroundColor: colors.border,
        marginLeft: layout.spacing.lg, // Inset
    },
    postWrapper: {
        // Removed margins
    },
    postCard: {
        padding: layout.spacing.lg,
        backgroundColor: 'transparent', // No white box
        // Removed shadows/radius
    },
    postHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: layout.spacing.md,
    },
    authorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    avatarPlaceholder: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInitial: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    authorText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    timeText: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    postTitle: {
        fontSize: typography.size.lg,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 6,
        lineHeight: 24,
    },
    postBody: {
        fontSize: typography.size.md,
        color: colors.textSecondary,
        lineHeight: 20,
        marginBottom: layout.spacing.md,
    },
    actionsRow: {
        flexDirection: 'row',
        gap: 20,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: colors.border, // Explicit separator line
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    actionCount: {
        fontSize: 13,
        fontWeight: '500',
        color: colors.textSecondary,
    },
    emptyContainer: {
        padding: layout.spacing.xl,
        alignItems: 'center',
        marginTop: 40,
    },
    emptyText: {
        color: colors.textPrimary,
        fontSize: typography.size.lg,
        fontWeight: '600',
    },
    emptySubtext: {
        color: colors.textSecondary,
        fontSize: typography.size.md,
        marginTop: 4,
    },
});

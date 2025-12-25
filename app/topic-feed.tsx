// Topic Feed Screen for expo-router
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowBigUp, ArrowLeft, MessageSquare, MoreHorizontal } from 'lucide-react-native';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '../src/components/Card';
import { Screen } from '../src/components/Screen';
import { POSTS } from '../src/data/communityData';
import { colors } from '../src/theme/colors';
import { layout } from '../src/theme/layout';
import { typography } from '../src/theme/typography';

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
                    communityColor: communityColor || colors.primary,
                }
            })}
        >
            <Card style={styles.postCard}>
                <View style={styles.postHeader}>
                    <View style={styles.metaLeft}>
                        <Text style={styles.metaText}>Posted by {item.author} • {item.time}</Text>
                    </View>
                    <MoreHorizontal size={16} color={colors.textSecondary} />
                </View>

                <Text style={styles.postTitle}>{item.title}</Text>
                <Text style={styles.postBody}>{item.body}</Text>

                <View style={styles.postFooter}>
                    <View style={styles.actionButton}>
                        <ArrowBigUp size={20} color={colors.textSecondary} />
                        <Text style={styles.actionText}>{item.upvotes}</Text>
                    </View>

                    <View style={styles.actionButton}>
                        <MessageSquare size={18} color={colors.textSecondary} />
                        <Text style={styles.actionText}>{item.comments}</Text>
                    </View>
                </View>
            </Card>
        </TouchableOpacity>
    );

    return (
        <Screen>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <View style={[styles.dot, { backgroundColor: communityColor || colors.primary }]} />
                    <Text style={styles.headerTitle}>{communityName}</Text>
                </View>
                <View style={{ width: 24 }} />
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
                    </View>
                }
            />
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
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    dot: {
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
        paddingBottom: layout.spacing.xl,
    },
    postCard: {
        marginHorizontal: layout.spacing.lg,
        marginBottom: layout.spacing.md,
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
    },
    metaText: {
        fontSize: 11,
        color: colors.textSecondary,
    },
    postTitle: {
        fontSize: typography.size.lg,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: layout.spacing.xs,
        lineHeight: 24,
    },
    postBody: {
        fontSize: typography.size.md,
        color: colors.textSecondary,
        lineHeight: 22,
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
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    actionText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    emptyContainer: {
        padding: layout.spacing.xl,
        alignItems: 'center',
    },
    emptyText: {
        color: colors.textSecondary,
        fontSize: typography.size.md,
    },
});

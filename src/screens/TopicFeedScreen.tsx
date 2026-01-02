import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowBigUp, MessageSquare, MoreHorizontal } from 'lucide-react-native';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { POSTS } from '../data/communityData';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { typography } from '../theme/typography';

const TAB_BAR_HEIGHT = 100;

export function TopicFeedScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute();
    const { communityId, communityName, communityColor } = route.params as any;

    // Set the navigation title to the topic name
    React.useLayoutEffect(() => {
        navigation.setOptions({
            title: communityName,
            headerTitle: () => (
                <View style={styles.headerTitleContainer}>
                    <View style={[styles.communityDot, { backgroundColor: communityColor }]} />
                    <Text style={styles.navTitle}>{communityName}</Text>
                </View>
            ),
        });
    }, [navigation, communityName, communityColor]);

    const filteredPosts = POSTS.filter(p => p.community === communityName);

    const renderPost = ({ item }: { item: typeof POSTS[0] }) => (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('PostDetail', {
                post: item,
                communityColor: communityColor
            })}
            style={styles.postContainer}
        >
            {/* Header */}
            <View style={styles.postHeader}>
                <Text style={styles.authorText}>Posted by {item.author} • {item.time}</Text>
                <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <MoreHorizontal size={18} color={colors.textSecondary} />
                </TouchableOpacity>
            </View>

            {/* Title */}
            <Text style={styles.postTitle}>{item.title}</Text>

            {/* Body */}
            <Text style={styles.postBody}>{item.body}</Text>

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
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={filteredPosts}
                renderItem={renderPost}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.feed}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No posts yet in {communityName}.</Text>
                        <Text style={styles.emptySubtext}>Be the first to start a conversation!</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
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
    navTitle: {
        fontSize: typography.size.lg,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    feed: {
        paddingBottom: TAB_BAR_HEIGHT,
    },
    separator: {
        height: 1,
        backgroundColor: colors.borderDark,
    },
    postContainer: {
        paddingHorizontal: layout.spacing.lg,
        paddingVertical: layout.spacing.lg,
        backgroundColor: colors.background,
    },
    postHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: layout.spacing.sm,
    },
    authorText: {
        fontSize: 13,
        color: colors.textSecondary,
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
        lineHeight: 22,
        marginBottom: layout.spacing.md,
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
    emptyContainer: {
        padding: layout.spacing.xl,
        alignItems: 'center',
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

// Topic Feed Screen - Industrial Minimalist
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, ArrowUpRight, MessageSquare } from 'lucide-react-native';
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { POSTS } from '../src/data/communityData';
import { colors } from '../src/theme/colors';
import { layout } from '../src/theme/layout';

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
            activeOpacity={0.7}
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
            style={styles.postItem}
        >
            <View style={styles.postContent}>
                <View style={styles.postMetaRow}>
                    <Text style={styles.metaText}>@{item.author.toUpperCase()}</Text>
                    <Text style={styles.metaDot}>•</Text>
                    <Text style={styles.metaText}>{item.time}</Text>
                </View>

                <Text style={styles.postTitle}>{item.title}</Text>
                <Text style={styles.postBody} numberOfLines={3}>{item.body}</Text>

                <View style={styles.postStats}>
                    <View style={styles.statItem}>
                        <ArrowUpRight size={16} color={colors.textSecondary} />
                        <Text style={styles.statText}>{item.upvotes} UPVOTES</Text>
                    </View>
                    <View style={styles.statItem}>
                        <MessageSquare size={16} color={colors.textSecondary} />
                        <Text style={styles.statText}>{item.comments} REPLIES</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Abstract Gradient Background Accent */}
            <LinearGradient
                colors={[communityColor || colors.primary, 'transparent']}
                style={styles.abstractBlob}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
                locations={[0, 0.7]}
            />

            <SafeAreaView style={styles.safeArea}>
                {/* Industrial Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButton}
                    >
                        <ArrowLeft size={28} color={colors.textPrimary} />
                    </TouchableOpacity>

                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerSubtitle}>TOPIC /</Text>
                        <Text style={styles.headerTitle}>{communityName?.toUpperCase()}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <FlatList
                    data={filteredPosts}
                    renderItem={renderPost}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.feed}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>NO POSTS YET</Text>
                            <Text style={styles.emptySubtext}>BE THE FIRST TO START.</Text>
                        </View>
                    }
                />
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
        width: 300,
        height: 300,
        opacity: 0.15,
    },
    header: {
        paddingHorizontal: layout.spacing.xl,
        paddingTop: layout.spacing.lg,
        paddingBottom: layout.spacing.lg,
    },
    backButton: {
        marginBottom: layout.spacing.md,
        alignSelf: 'flex-start',
    },
    headerTitleContainer: {
        gap: 4,
    },
    headerSubtitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.textSecondary,
        letterSpacing: 1,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: colors.textPrimary,
        letterSpacing: -1,
    },
    divider: {
        height: 1,
        backgroundColor: colors.textPrimary, // Strong divider
        marginHorizontal: layout.spacing.lg,
    },
    feed: {
        paddingBottom: TAB_BAR_HEIGHT,
    },
    separator: {
        height: 1,
        backgroundColor: colors.borderDark,
        marginHorizontal: layout.spacing.lg,
    },
    // Post Item
    postItem: {
        paddingHorizontal: layout.spacing.xl,
        paddingVertical: 24,
    },
    postContent: {
        gap: 8,
    },
    postMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    metaText: {
        fontSize: 12,
        fontFamily: 'Courier', // Mono if available
        color: colors.textSecondary,
        letterSpacing: 0.5,
        fontWeight: '600',
    },
    metaDot: {
        fontSize: 10,
        color: colors.borderDark,
    },
    postTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.textPrimary,
        letterSpacing: -0.5,
        lineHeight: 28,
    },
    postBody: {
        fontSize: 16,
        color: colors.textSecondary,
        lineHeight: 24,
        marginTop: 4,
        marginBottom: 12,
    },
    postStats: {
        flexDirection: 'row',
        gap: 16,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: colors.borderDark,
        borderRadius: 0, // Sharp corners
    },
    statText: {
        fontSize: 11,
        fontWeight: '700',
        color: colors.textPrimary,
        letterSpacing: 0.5,
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
        gap: 8,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textPrimary,
        letterSpacing: 1,
    },
    emptySubtext: {
        fontSize: 14,
        color: colors.textSecondary,
        fontStyle: 'italic',
    },
});

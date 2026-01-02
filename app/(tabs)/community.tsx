// Spaces Screen - Glassmorphism Topic Cards
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ChevronRight, MessageSquare, Sparkles, Users } from 'lucide-react-native';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ProfileButton } from '../../src/components/ProfileButton';
import { COMMUNITIES, POSTS } from '../../src/data/communityData';
import { colors } from '../../src/theme/colors';
import { layout } from '../../src/theme/layout';
import { typography } from '../../src/theme/typography';

const BG_SPACES = require('../../assets/backgrounds/bg_spaces.png');

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TAB_BAR_HEIGHT = 100;

// Get post count for a community
const getPostCount = (communityName: string) => {
    return POSTS.filter(p => p.community === communityName).length;
};

// Get member count (simulated)
const getMemberCount = (index: number) => {
    const counts = [128, 89, 156, 67, 102];
    return counts[index % counts.length];
};

export default function SpacesTab() {
    const router = useRouter();

    const handleTopicPress = (community: typeof COMMUNITIES[0]) => {
        router.push({
            pathname: '/topic-feed',
            params: {
                communityId: community.id,
                communityName: community.name,
                communityColor: community.color
            }
        });
    };

    return (
        <LinearGradient
            colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View>
                        <Text style={styles.title}>Spaces</Text>
                        <Text style={styles.subtitle}>Find your community</Text>
                    </View>
                    <ProfileButton />
                </View>
            </View>

            {/* Topics Grid */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Featured Topic - Large Card */}
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => handleTopicPress(COMMUNITIES[0])}
                >
                    <BlurView intensity={40} tint="light" style={styles.featuredCard}>
                        <LinearGradient
                            colors={[`${COMMUNITIES[0].color}30`, `${COMMUNITIES[0].color}10`]}
                            style={styles.featuredGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <View style={styles.featuredHeader}>
                                <View style={[styles.iconContainer, { backgroundColor: COMMUNITIES[0].color }]}>
                                    <MessageSquare size={24} color="#FFF" />
                                </View>
                                <View style={styles.featuredBadge}>
                                    <Sparkles size={12} color={colors.accent} />
                                    <Text style={styles.featuredBadgeText}>Popular</Text>
                                </View>
                            </View>
                            <Text style={styles.featuredTitle}>{COMMUNITIES[0].name}</Text>
                            <Text style={styles.featuredDescription}>{COMMUNITIES[0].description}</Text>
                            <View style={styles.featuredStats}>
                                <View style={styles.statItem}>
                                    <Users size={14} color={colors.textSecondary} />
                                    <Text style={styles.statText}>{getMemberCount(0)} members</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <MessageSquare size={14} color={colors.textSecondary} />
                                    <Text style={styles.statText}>{getPostCount(COMMUNITIES[0].name)} posts</Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </BlurView>
                </TouchableOpacity>

                {/* Other Topics - Grid */}
                <View style={styles.gridContainer}>
                    {COMMUNITIES.slice(1).map((community, index) => (
                        <TouchableOpacity
                            key={community.id}
                            activeOpacity={0.9}
                            onPress={() => handleTopicPress(community)}
                            style={styles.gridItem}
                        >
                            <BlurView intensity={35} tint="light" style={styles.topicCard}>
                                <View style={[styles.topicColorBar, { backgroundColor: community.color }]} />
                                <View style={styles.topicContent}>
                                    <Text style={styles.topicTitle}>{community.name}</Text>
                                    <Text style={styles.topicDescription} numberOfLines={2}>
                                        {community.description}
                                    </Text>
                                    <View style={styles.topicFooter}>
                                        <Text style={styles.topicPostCount}>
                                            {getPostCount(community.name)} posts
                                        </Text>
                                        <ChevronRight size={16} color={colors.textSecondary} />
                                    </View>
                                </View>
                            </BlurView>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Join More Section */}
                <BlurView intensity={30} tint="light" style={styles.joinSection}>
                    <Text style={styles.joinTitle}>Looking for something else?</Text>
                    <Text style={styles.joinSubtitle}>Suggest a new Space for the community</Text>
                    <TouchableOpacity style={styles.suggestButton}>
                        <Text style={styles.suggestButtonText}>Suggest a Space</Text>
                    </TouchableOpacity>
                </BlurView>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: layout.spacing.lg,
        paddingTop: 60,
        paddingBottom: layout.spacing.md,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: typography.size.xxl,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    subtitle: {
        fontSize: typography.size.md,
        color: colors.textSecondary,
        marginTop: 4,
    },
    scrollContent: {
        paddingHorizontal: layout.spacing.lg,
        paddingBottom: TAB_BAR_HEIGHT + 20,
    },
    // Featured Card
    featuredCard: {
        borderRadius: layout.borderRadius.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.glassBorder,
        marginBottom: layout.spacing.lg,
    },
    featuredGradient: {
        padding: layout.spacing.lg,
    },
    featuredHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: layout.spacing.md,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    featuredBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: colors.glass,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
    },
    featuredBadgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: colors.accent,
    },
    featuredTitle: {
        fontSize: typography.size.xl,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 8,
    },
    featuredDescription: {
        fontSize: typography.size.md,
        color: colors.textSecondary,
        lineHeight: 22,
        marginBottom: layout.spacing.md,
    },
    featuredStats: {
        flexDirection: 'row',
        gap: 20,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statText: {
        fontSize: 13,
        color: colors.textSecondary,
    },
    // Grid Cards
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: layout.spacing.lg,
    },
    gridItem: {
        width: (SCREEN_WIDTH - 60) / 2,
    },
    topicCard: {
        borderRadius: layout.borderRadius.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.glassBorder,
    },
    topicColorBar: {
        height: 6,
    },
    topicContent: {
        padding: layout.spacing.md,
    },
    topicTitle: {
        fontSize: typography.size.md,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 6,
    },
    topicDescription: {
        fontSize: 13,
        color: colors.textSecondary,
        lineHeight: 18,
        marginBottom: layout.spacing.sm,
    },
    topicFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    topicPostCount: {
        fontSize: 12,
        color: colors.textLight,
    },
    // Join Section
    joinSection: {
        borderRadius: layout.borderRadius.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.glassBorder,
        padding: layout.spacing.lg,
        alignItems: 'center',
    },
    joinTitle: {
        fontSize: typography.size.md,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    joinSubtitle: {
        fontSize: typography.size.sm,
        color: colors.textSecondary,
        marginBottom: layout.spacing.md,
    },
    suggestButton: {
        backgroundColor: colors.textPrimary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: layout.borderRadius.xl,
    },
    suggestButtonText: {
        fontSize: typography.size.sm,
        fontWeight: '600',
        color: '#FFF',
    },
});

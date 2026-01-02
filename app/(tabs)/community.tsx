// Spaces Screen - Industrial Minimalist Design
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowUpRight, Plus, Users } from 'lucide-react-native';
import React from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ProfileButton } from '../../src/components/ProfileButton';
import { COMMUNITIES, POSTS } from '../../src/data/communityData';
import { colors } from '../../src/theme/colors';
import { layout } from '../../src/theme/layout';

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

    const FeaturedSpace = COMMUNITIES[0];
    const OtherSpaces = COMMUNITIES.slice(1);

    return (
        <View style={styles.container}>
            {/* Background */}
            <LinearGradient
                colors={[colors.background, colors.backgroundSecondary]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <Text style={styles.pageTitle}>SPACES</Text>
                    <ProfileButton />
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Featured Section - Abstract / Industrial Hero */}
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => handleTopicPress(FeaturedSpace)}
                        style={styles.featuredContainer}
                    >
                        <View style={styles.featuredContent}>
                            <View style={styles.featuredLabelRow}>
                                <Text style={styles.featuredLabel}>FEATURED</Text>
                                <ArrowUpRight size={20} color={colors.textPrimary} />
                            </View>
                            <Text style={styles.featuredTitle}>{FeaturedSpace.name}</Text>
                            <Text style={styles.featuredDescription}>{FeaturedSpace.description}</Text>

                            <View style={styles.featuredStats}>
                                <View style={styles.statPill}>
                                    <Users size={14} color={colors.textPrimary} />
                                    <Text style={styles.statText}>{getMemberCount(0)} members</Text>
                                </View>
                            </View>
                        </View>
                        {/* Abstract Gradient Blob */}
                        <LinearGradient
                            colors={[FeaturedSpace.color, 'transparent']}
                            style={styles.abstractBlob}
                            start={{ x: 1, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            locations={[0, 0.8]}
                        />
                    </TouchableOpacity>

                    {/* Divider */}
                    <View style={styles.sectionDivider} />

                    {/* List Section */}
                    <View style={styles.listContainer}>
                        {OtherSpaces.map((community, index) => (
                            <TouchableOpacity
                                key={community.id}
                                activeOpacity={0.7}
                                onPress={() => handleTopicPress(community)}
                                style={styles.listItem}
                            >
                                <View style={styles.listItemContent}>
                                    <View style={styles.listItemHeader}>
                                        <Text style={styles.listTitle}>{community.name}</Text>
                                        <ArrowUpRight size={18} color={colors.textSecondary} style={{ opacity: 0.5 }} />
                                    </View>
                                    <Text style={styles.listDescription} numberOfLines={2}>
                                        {community.description}
                                    </Text>
                                    <View style={styles.listMeta}>
                                        <Text style={styles.metaText}>{getPostCount(community.name)} posts</Text>
                                        <Text style={styles.metaDot}>•</Text>
                                        <Text style={styles.metaText}>{getMemberCount(index + 1)} members</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Footer / Suggest */}
                    <View style={styles.footerSection}>
                        <Text style={styles.footerText}>Don't see what you're looking for?</Text>
                        <TouchableOpacity style={styles.suggestButton}>
                            <Text style={styles.suggestButtonText}>PROPOSE A SPACE</Text>
                            <Plus size={16} color={colors.textPrimary} />
                        </TouchableOpacity>
                    </View>

                </ScrollView>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: layout.spacing.xl,
        paddingTop: layout.spacing.lg,
        paddingBottom: layout.spacing.lg,
    },
    pageTitle: {
        fontSize: 32,
        fontWeight: '900', // Heavy industrial font
        color: colors.textPrimary,
        letterSpacing: -1,
        textTransform: 'uppercase',
    },
    scrollContent: {
        paddingBottom: TAB_BAR_HEIGHT,
    },
    // Featured
    featuredContainer: {
        marginHorizontal: layout.spacing.lg,
        marginBottom: layout.spacing.xl,
        height: 280,
        backgroundColor: colors.surface, // Or just transparent if we want purely abstract? Let's use surface for contrast against blue bg
        borderRadius: 0, // Industrial: sharp corners? Or Minimal: maybe minimal radius. Let's go 4px.
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.borderDark, // Visible border
        justifyContent: 'space-between',
    },
    featuredContent: {
        padding: layout.spacing.xl,
        zIndex: 2,
    },
    featuredLabelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: layout.spacing.xl,
    },
    featuredLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
        color: colors.textSecondary,
    },
    featuredTitle: {
        fontSize: 36,
        fontWeight: '800',
        color: colors.textPrimary,
        marginBottom: layout.spacing.sm,
        lineHeight: 40,
    },
    featuredDescription: {
        fontSize: 16,
        color: colors.textSecondary,
        maxWidth: '80%',
        marginBottom: layout.spacing.lg,
        lineHeight: 24,
    },
    featuredStats: {
        flexDirection: 'row',
    },
    statPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderWidth: 1,
        borderColor: colors.border,
    },
    statText: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    abstractBlob: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 200,
        height: 280,
        opacity: 0.2,
    },
    // Divider
    sectionDivider: {
        height: 1,
        backgroundColor: colors.textPrimary, // Strong divider
        marginHorizontal: layout.spacing.lg,
        marginBottom: 0,
    },
    // List
    listContainer: {

    },
    listItem: {
        paddingHorizontal: layout.spacing.xl,
        paddingVertical: 24,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderDark,
    },
    listItemContent: {
        gap: 8,
    },
    listItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    listTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: colors.textPrimary,
        letterSpacing: -0.5,
    },
    listDescription: {
        fontSize: 15,
        color: colors.textSecondary,
        lineHeight: 22,
        maxWidth: '90%',
    },
    listMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 8,
    },
    metaText: {
        fontSize: 13,
        fontFamily: 'Courier', // Industrial/Mono feel if available, otherwise fallback
        color: colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    metaDot: {
        color: colors.borderDark,
        fontSize: 12,
    },
    // Footer
    footerSection: {
        padding: layout.spacing.xl,
        alignItems: 'center',
        marginTop: layout.spacing.lg,
        gap: 16,
    },
    footerText: {
        fontSize: 16,
        color: colors.textSecondary,
        fontStyle: 'italic',
    },
    suggestButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: colors.textPrimary,
    },
    suggestButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.textPrimary,
        letterSpacing: 1,
    },
});

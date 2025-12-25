import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowRight } from 'lucide-react-native';
import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { layout } from '../theme/layout';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';
import { COMMUNITIES } from '../data/communityData';

export function CommunityScreen() {
    const navigation = useNavigation<any>();

    const renderCommunityCard = ({ item }: { item: typeof COMMUNITIES[0] }) => (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('TopicFeed', {
                communityId: item.id,
                communityName: item.name,
                communityColor: item.color
            })}
        >
            <Card style={styles.communityCard}>
                <View style={styles.cardHeader}>
                    <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
                    <Text style={styles.cardTitle}>{item.name}</Text>
                </View>
                <Text style={styles.cardDescription}>{item.description}</Text>
                <View style={styles.cardFooter}>
                    <Text style={styles.viewText}>View Posts</Text>
                    <ArrowRight size={16} color={colors.primary} />
                </View>
            </Card>
        </TouchableOpacity>
    );

    return (
        <Screen>
            <View style={styles.header}>
                <Text style={styles.title}>Communities</Text>
                <Text style={styles.subtitle}>Find your safe space.</Text>
            </View>

            <FlatList
                data={COMMUNITIES}
                renderItem={renderCommunityCard}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </Screen>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: layout.spacing.lg,
        paddingTop: layout.spacing.lg,
        paddingBottom: layout.spacing.md,
    },
    title: {
        fontSize: typography.size.xxl,
        fontWeight: typography.weight.bold as any,
        color: colors.textPrimary,
    },
    subtitle: {
        fontSize: typography.size.md,
        color: colors.textSecondary,
        marginTop: 4,
    },
    listContainer: {
        padding: layout.spacing.lg,
        paddingBottom: layout.spacing.xl, // Reduced from 100 to remove gap
        gap: layout.spacing.md,
    },
    communityCard: {
        padding: layout.spacing.lg,
        backgroundColor: colors.surface,
        borderRadius: layout.borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.borderDark,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: layout.spacing.sm,
        gap: 10,
    },
    colorIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    cardTitle: {
        fontSize: typography.size.lg,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    cardDescription: {
        fontSize: typography.size.md,
        color: colors.textSecondary,
        marginBottom: layout.spacing.lg,
        lineHeight: 20,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 4,
    },
    viewText: {
        fontSize: typography.size.sm,
        fontWeight: '600',
        color: colors.primary,
    },
});

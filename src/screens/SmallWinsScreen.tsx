import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Award, Star, Zap, TrendingUp, Medal, Plus, CheckCircle2, Trophy } from 'lucide-react-native';
import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { layout } from '../theme/layout';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';

const BADGES = [
    { id: '1', name: 'Early Bird', icon: Zap, color: '#F59E0B', description: 'Logged a win before 9AM' },
    { id: '2', name: 'Streak', icon: TrendingUp, color: '#10B981', description: '3 wins in a row' },
    { id: '3', name: 'Supporter', icon: Star, color: '#3B82F6', description: 'Cheered for 10 friends' },
    { id: '4', name: 'Resilient', icon: Medal, color: '#EF4444', description: 'Came back after a break' },
    { id: '5', name: 'Achiever', icon: Trophy, color: '#8B5CF6', description: '50 total wins' },
    { id: '6', name: 'Listener', icon: Award, color: '#EC4899', description: 'Active in community' },
];

const INITIAL_WINS = [
    { id: '1', title: 'Made my bed', date: 'Today, 8:00 AM' },
    { id: '2', title: 'Drank 2L of water', date: 'Today, 2:00 PM' },
    { id: '3', title: 'Sent that scary email', date: 'Yesterday' },
    { id: '4', title: 'Walked for 15 mins', date: 'Yesterday' },
    { id: '5', title: 'Cooked a real dinner', date: '2 days ago' },
];

export function SmallWinsScreen() {
    const [wins, setWins] = useState(INITIAL_WINS);
    const [newWin, setNewWin] = useState('');

    const handleAddWin = () => {
        if (!newWin.trim()) return;
        const win = {
            id: Date.now().toString(),
            title: newWin,
            date: 'Just now',
        };
        setWins([win, ...wins]);
        setNewWin('');
    };

    return (
        <Screen>
            <View style={styles.header}>
                <Text style={styles.title}>Small Wins</Text>
                <Text style={styles.subtitle}>Celebrate every milestone.</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Badges Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Your Badges</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgesScroll}>
                        {BADGES.map((badge) => (
                            <View key={badge.id} style={styles.badgeContainer}>
                                <View style={[styles.badgeCircle, { backgroundColor: badge.color + '20', borderColor: badge.color }]}>
                                    <badge.icon size={24} color={badge.color} />
                                </View>
                                <Text style={styles.badgeName}>{badge.name}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Add New Win */}
                <Card style={styles.addWinCard}>
                    <Text style={styles.cardLabel}>What did you achieve today?</Text>
                    <View style={styles.inputRow}>
                        <TextInput
                            style={styles.input}
                            placeholder="I watered my plants..."
                            placeholderTextColor={colors.textSecondary}
                            value={newWin}
                            onChangeText={setNewWin}
                        />
                        <TouchableOpacity style={styles.addButton} onPress={handleAddWin}>
                            <Plus size={24} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </Card>

                {/* Wins List */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recent Wins</Text>
                    <View style={styles.winsList}>
                        {wins.map((win) => (
                            <Card key={win.id} style={styles.winCard}>
                                <View style={styles.winIcon}>
                                    <CheckCircle2 size={20} color={colors.primary} />
                                </View>
                                <View style={styles.winContent}>
                                    <Text style={styles.winTitle}>{win.title}</Text>
                                    <Text style={styles.winDate}>{win.date}</Text>
                                </View>
                            </Card>
                        ))}
                    </View>
                </View>
            </ScrollView>
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
    scrollContent: {
        paddingBottom: 100, // Safe area for navigation
    },
    section: {
        marginTop: layout.spacing.lg,
    },
    sectionTitle: {
        fontSize: typography.size.lg,
        fontWeight: typography.weight.bold as any,
        color: colors.textPrimary,
        marginLeft: layout.spacing.lg,
        marginBottom: layout.spacing.md,
    },
    badgesScroll: {
        paddingHorizontal: layout.spacing.lg,
        gap: 20,
        paddingBottom: 10, // Shadow space
    },
    badgeContainer: {
        alignItems: 'center',
        gap: 8,
    },
    badgeCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
    },
    badgeName: {
        fontSize: typography.size.xs,
        fontWeight: typography.weight.medium as any,
        color: colors.textSecondary,
    },
    addWinCard: {
        marginHorizontal: layout.spacing.lg,
        marginTop: layout.spacing.lg,
        padding: layout.spacing.lg,
    },
    cardLabel: {
        fontSize: typography.size.md,
        fontWeight: typography.weight.medium as any,
        color: colors.textPrimary,
        marginBottom: layout.spacing.md,
    },
    inputRow: {
        flexDirection: 'row',
        gap: layout.spacing.md,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: colors.background,
        padding: layout.spacing.md,
        borderRadius: layout.borderRadius.md,
        fontSize: typography.size.md,
        color: colors.textPrimary,
        borderWidth: 1,
        borderColor: colors.borderDark,
    },
    addButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    winsList: {
        paddingHorizontal: layout.spacing.lg,
        gap: layout.spacing.sm,
    },
    winCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: layout.spacing.md,
        gap: layout.spacing.md,
    },
    winIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
    },
    winContent: {
        flex: 1,
    },
    winTitle: {
        fontSize: typography.size.md,
        fontWeight: typography.weight.medium as any,
        color: colors.textPrimary,
        marginBottom: 2,
    },
    winDate: {
        fontSize: typography.size.xs,
        color: colors.textSecondary,
    },
});

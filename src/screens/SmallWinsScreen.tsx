import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Award, CheckCircle2, Medal, Plus, Star, TrendingUp, Trophy, Zap } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ProfileButton } from '../components/ProfileButton';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { typography } from '../theme/typography';

const TAB_BAR_HEIGHT = 100;

const BADGES = [
    { id: '1', name: 'Early Bird', icon: Zap, color: colors.warning, description: 'Logged a win before 9AM' },
    { id: '2', name: 'Streak', icon: TrendingUp, color: colors.success, description: '3 wins in a row' },
    { id: '3', name: 'Supporter', icon: Star, color: colors.accent, description: 'Cheered for 10 friends' },
    { id: '4', name: 'Resilient', icon: Medal, color: colors.error, description: 'Came back after a break' },
    { id: '5', name: 'Achiever', icon: Trophy, color: colors.moodGreat, description: '50 total wins' },
    { id: '6', name: 'Listener', icon: Award, color: colors.moodStruggling, description: 'Active in community' },
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
        <View style={styles.container}>
            <LinearGradient
                colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <View>
                            <Text style={styles.title}>Small Wins</Text>
                            <Text style={styles.subtitle}>Celebrate every milestone.</Text>
                        </View>
                        <ProfileButton />
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Badges Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Your Badges</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgesScroll}>
                            {BADGES.map((badge) => (
                                <View key={badge.id} style={styles.badgeContainer}>
                                    <BlurView intensity={40} tint="light" style={[styles.badgeCircle, { borderColor: badge.color }]}>
                                        <badge.icon size={24} color={badge.color} />
                                    </BlurView>
                                    <Text style={styles.badgeName}>{badge.name}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Add New Win */}
                    <BlurView intensity={50} tint="light" style={styles.addWinCard}>
                        <Text style={styles.cardLabel}>What did you achieve today?</Text>
                        <View style={styles.inputRow}>
                            <TextInput
                                style={styles.input}
                                placeholder="I watered my plants..."
                                placeholderTextColor={colors.textLight}
                                value={newWin}
                                onChangeText={setNewWin}
                            />
                            <TouchableOpacity style={styles.addButton} onPress={handleAddWin}>
                                <Plus size={24} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </BlurView>

                    {/* Wins List */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Recent Wins</Text>
                        <View style={styles.winsList}>
                            {wins.map((win) => (
                                <BlurView key={win.id} intensity={40} tint="light" style={styles.winCard}>
                                    <View style={styles.winIcon}>
                                        <CheckCircle2 size={20} color={colors.success} />
                                    </View>
                                    <View style={styles.winContent}>
                                        <Text style={styles.winTitle}>{win.title}</Text>
                                        <Text style={styles.winDate}>{win.date}</Text>
                                    </View>
                                </BlurView>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
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
        paddingBottom: TAB_BAR_HEIGHT + 20,
    },
    section: {
        marginTop: layout.spacing.lg,
    },
    sectionTitle: {
        fontSize: typography.size.lg,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginLeft: layout.spacing.lg,
        marginBottom: layout.spacing.md,
    },
    badgesScroll: {
        paddingHorizontal: layout.spacing.lg,
        gap: 16,
        paddingBottom: 10,
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
        overflow: 'hidden',
    },
    badgeName: {
        fontSize: typography.size.xs,
        fontWeight: '500',
        color: colors.textSecondary,
    },
    addWinCard: {
        marginHorizontal: layout.spacing.lg,
        marginTop: layout.spacing.lg,
        padding: layout.spacing.lg,
        borderRadius: layout.borderRadius.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.glassBorder,
    },
    cardLabel: {
        fontSize: typography.size.md,
        fontWeight: '500',
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
        backgroundColor: colors.glass,
        padding: layout.spacing.md,
        borderRadius: layout.borderRadius.md,
        fontSize: typography.size.md,
        color: colors.textPrimary,
        borderWidth: 1,
        borderColor: colors.glassBorder,
    },
    addButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.textPrimary,
        justifyContent: 'center',
        alignItems: 'center',
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
        borderRadius: layout.borderRadius.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.glassBorder,
    },
    winIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.glassOverlay,
        justifyContent: 'center',
        alignItems: 'center',
    },
    winContent: {
        flex: 1,
    },
    winTitle: {
        fontSize: typography.size.md,
        fontWeight: '500',
        color: colors.textPrimary,
        marginBottom: 2,
    },
    winDate: {
        fontSize: typography.size.xs,
        color: colors.textSecondary,
    },
});

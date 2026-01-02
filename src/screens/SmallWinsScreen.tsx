// Small Wins Screen - Industrial Minimalist Design
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowUpRight, Award, CheckCircle2, Medal, Plus, Star, TrendingUp, Trophy, Zap } from 'lucide-react-native';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ProfileButton } from '../components/ProfileButton';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';

const TAB_BAR_HEIGHT = 100;

const BADGES = [
    { id: '1', name: 'Early Bird', icon: Zap, color: colors.warning, description: 'Logged a win before 9AM' },
    { id: '2', name: 'Streak 3', icon: TrendingUp, color: colors.success, description: '3 wins in a row' },
    { id: '3', name: 'Supporter', icon: Star, color: colors.accent, description: 'Cheered for 10 friends' },
    { id: '4', name: 'Resilient', icon: Medal, color: colors.error, description: 'Came back after a break' },
    { id: '5', name: 'Achiever', icon: Trophy, color: colors.moodGreat, description: '50 total wins' },
    { id: '6', name: 'Listener', icon: Award, color: colors.moodStruggling, description: 'Active in community' },
];

const INITIAL_WINS = [
    { id: '1', title: 'Made my bed', date: 'TODAY, 8:00 AM' },
    { id: '2', title: 'Drank 2L of water', date: 'TODAY, 2:00 PM' },
    { id: '3', title: 'Sent that scary email', date: 'YESTERDAY' },
    { id: '4', title: 'Walked for 15 mins', date: 'YESTERDAY' },
    { id: '5', title: 'Cooked a real dinner', date: '2 DAYS AGO' },
];

export function SmallWinsScreen() {
    const [wins, setWins] = useState(INITIAL_WINS);
    const [newWin, setNewWin] = useState('');

    const handleAddWin = () => {
        if (!newWin.trim()) return;
        const win = {
            id: Date.now().toString(),
            title: newWin,
            date: 'JUST NOW',
        };
        setWins([win, ...wins]);
        setNewWin('');
    };

    return (
        <View style={styles.container}>
            {/* Abstract Gradient Blob */}
            <LinearGradient
                colors={[colors.moodCelebration, 'transparent']}
                style={styles.abstractBlob}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
                locations={[0, 0.6]}
            />

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerSubtitle}>MILESTONES /</Text>
                        <Text style={styles.headerTitle}>SMALL WINS</Text>
                    </View>
                    <ProfileButton />
                </View>

                <View style={styles.divider} />

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Input Section - Industrial Box */}
                    <View style={styles.inputSection}>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder="WHAT DID YOU ACHIEVE?"
                                placeholderTextColor={colors.textSecondary}
                                value={newWin}
                                onChangeText={setNewWin}
                            />
                            <TouchableOpacity style={styles.addButton} onPress={handleAddWin}>
                                <Plus size={24} color={colors.textPrimary} />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.inputHint}>CELEBRATE EVERY STEP.</Text>
                    </View>

                    {/* Divider */}
                    <View style={styles.sectionDivider} />

                    {/* Badges Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeaderRow}>
                            <Text style={styles.sectionTitle}>BADGES</Text>
                            <ArrowUpRight size={16} color={colors.textSecondary} />
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgesScroll}>
                            {BADGES.map((badge) => (
                                <View key={badge.id} style={styles.badgeContainer}>
                                    <View style={[styles.badgeCircle, { borderColor: badge.color }]}>
                                        <View style={[styles.badgeFill, { backgroundColor: badge.color, opacity: 0.1 }]} />
                                        <badge.icon size={24} color={badge.color} />
                                    </View>
                                    <Text style={styles.badgeName}>{badge.name.toUpperCase()}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Divider */}
                    <View style={styles.sectionDivider} />

                    {/* Wins List */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeaderRow}>
                            <Text style={styles.sectionTitle}>RECENT LOGS</Text>
                        </View>
                        <View style={styles.winsList}>
                            {wins.map((win) => (
                                <View key={win.id} style={styles.winItem}>
                                    <View style={styles.winIconBox}>
                                        <CheckCircle2 size={18} color={colors.success} />
                                    </View>
                                    <View style={styles.winContent}>
                                        <Text style={styles.winTitle}>{win.title}</Text>
                                        <Text style={styles.winDate}>{win.date}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
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
    abstractBlob: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 300,
        height: 300,
        opacity: 0.15,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: layout.spacing.xl,
        paddingTop: layout.spacing.lg,
        paddingBottom: layout.spacing.lg,
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
        fontSize: 32,
        fontWeight: '900',
        color: colors.textPrimary,
        letterSpacing: -1,
    },
    divider: {
        height: 1,
        backgroundColor: colors.textPrimary,
        marginHorizontal: layout.spacing.lg,
    },
    scrollContent: {
        paddingBottom: TAB_BAR_HEIGHT + 20,
    },
    // Input
    inputSection: {
        padding: layout.spacing.xl,
    },
    inputWrapper: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: colors.textPrimary,
        height: 56,
        alignItems: 'center',
        backgroundColor: colors.surface,
    },
    input: {
        flex: 1,
        paddingHorizontal: 16,
        fontSize: 16,
        fontFamily: 'Courier',
        color: colors.textPrimary,
    },
    addButton: {
        width: 56,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        borderLeftWidth: 1,
        borderLeftColor: colors.textPrimary,
        backgroundColor: colors.surfaceWarm,
    },
    inputHint: {
        marginTop: 8,
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.textSecondary,
        letterSpacing: 0.5,
    },
    // Sections
    sectionDivider: {
        height: 1,
        backgroundColor: colors.borderDark,
        marginHorizontal: layout.spacing.lg,
    },
    section: {
        paddingVertical: layout.spacing.xl,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: layout.spacing.xl,
        marginBottom: layout.spacing.lg,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 1,
        color: colors.textSecondary,
    },
    // Badges
    badgesScroll: {
        paddingHorizontal: layout.spacing.xl,
        gap: 24,
    },
    badgeContainer: {
        alignItems: 'center',
        gap: 12,
        width: 80,
    },
    badgeCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        position: 'relative',
    },
    badgeFill: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 36,
    },
    badgeName: {
        fontSize: 10,
        fontWeight: '700',
        color: colors.textPrimary,
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    // Wins List
    winsList: {

    },
    winItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: layout.spacing.xl,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderDark,
    },
    winIconBox: {
        marginRight: 16,
    },
    winContent: {
        gap: 4,
    },
    winTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    winDate: {
        fontSize: 12,
        fontFamily: 'Courier',
        color: colors.textSecondary,
        letterSpacing: 0.5,
    },
});

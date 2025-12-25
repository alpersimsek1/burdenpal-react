import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Settings, LogOut, ChevronRight, User, Mail, Bell, Shield } from 'lucide-react-native';
import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { layout } from '../theme/layout';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';

export function UserProfileScreen() {
    const MENU_ITEMS = [
        { icon: User, label: 'Personal Information' },
        { icon: Bell, label: 'Notifications' },
        { icon: Shield, label: 'Privacy & Security' },
        { icon: Settings, label: 'App Settings' },
    ];

    return (
        <Screen>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Profile Header */}
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>ME</Text>
                    </View>
                    <Text style={styles.name}>Alex Johnson</Text>
                    <Text style={styles.email}>alex.johnson@example.com</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>Premium Member</Text>
                    </View>
                </View>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <Card style={styles.statCard}>
                        <Text style={styles.statNumber}>12</Text>
                        <Text style={styles.statLabel}>Wins</Text>
                    </Card>
                    <Card style={styles.statCard}>
                        <Text style={styles.statNumber}>5</Text>
                        <Text style={styles.statLabel}>Buddies</Text>
                    </Card>
                    <Card style={styles.statCard}>
                        <Text style={styles.statNumber}>8</Text>
                        <Text style={styles.statLabel}>Streak</Text>
                    </Card>
                </View>

                {/* Menu */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <Card style={styles.menuCard}>
                        {MENU_ITEMS.map((item, index) => (
                            <TouchableOpacity key={index} style={styles.menuItem}>
                                <View style={styles.menuItemLeft}>
                                    <View style={styles.iconContainer}>
                                        <item.icon size={20} color={colors.primary} />
                                    </View>
                                    <Text style={styles.menuLabel}>{item.label}</Text>
                                </View>
                                <ChevronRight size={20} color={colors.textSecondary} />
                            </TouchableOpacity>
                        ))}
                    </Card>
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton}>
                    <LogOut size={20} color="#EF4444" />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: layout.spacing.lg,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: layout.spacing.xl,
        marginTop: layout.spacing.lg,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: layout.spacing.md,
        borderWidth: 4,
        borderColor: colors.surface,
        elevation: 4,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
    },
    name: {
        fontSize: typography.size.xl,
        fontWeight: typography.weight.bold as any,
        color: colors.textPrimary,
        marginBottom: 4,
    },
    email: {
        fontSize: typography.size.sm,
        color: colors.textSecondary,
        marginBottom: layout.spacing.md,
    },
    badge: {
        backgroundColor: colors.primary + '15',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.primary + '30',
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: colors.primary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    statsRow: {
        flexDirection: 'row',
        gap: layout.spacing.md,
        marginBottom: layout.spacing.xl,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        padding: layout.spacing.md,
    },
    statNumber: {
        fontSize: typography.size.xl,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: typography.size.xs,
        color: colors.textSecondary,
        textTransform: 'uppercase',
    },
    section: {
        marginBottom: layout.spacing.xl,
    },
    sectionTitle: {
        fontSize: typography.size.lg,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: layout.spacing.md,
    },
    menuCard: {
        padding: 0,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: layout.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderDark,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: colors.primary + '10',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuLabel: {
        fontSize: typography.size.md,
        color: colors.textPrimary,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: layout.spacing.md,
        borderRadius: layout.borderRadius.lg,
        backgroundColor: '#EF4444' + '10',
        borderWidth: 1,
        borderColor: '#EF4444' + '30',
    },
    logoutText: {
        fontSize: typography.size.md,
        fontWeight: 'bold',
        color: '#EF4444',
    },
});

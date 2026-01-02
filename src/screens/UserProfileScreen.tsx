// User Profile Screen - Industrial Minimalist Design
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, ChevronRight, LogOut, Settings, Shield, User, Wallet } from 'lucide-react-native';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';

const TAB_BAR_HEIGHT = 100;

export function UserProfileScreen() {
    const MENU_ITEMS = [
        { icon: User, label: 'PERSONAL INFORMATION', value: '' },
        { icon: Bell, label: 'NOTIFICATIONS', value: 'ON' },
        { icon: Shield, label: 'PRIVACY & SECURITY', value: '' },
        { icon: Wallet, label: 'SUBSCRIPTION', value: 'PREMIUM' },
        { icon: Settings, label: 'APP SETTINGS', value: '' },
    ];

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                {/* Immersive Profile Hero Gradient */}
                <LinearGradient
                    colors={[colors.moodReflection, colors.background]}
                    style={styles.profileHero}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                >
                    <SafeAreaView>
                        <View style={styles.profileContent}>
                            <View style={styles.avatarBox}>
                                <Text style={styles.avatarText}>AJ</Text>
                            </View>
                            <View style={styles.profileInfo}>
                                <Text style={styles.name}>ALEX JOHNSON</Text>
                                <Text style={styles.email}>ALEX.JOHNSON@EXAMPLE.COM</Text>
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>PREMIUM MEMBER</Text>
                                </View>
                            </View>
                        </View>
                    </SafeAreaView>
                </LinearGradient>

                {/* Stats Row - Industrial Boxes */}
                <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>12</Text>
                        <Text style={styles.statLabel}>WINS</Text>
                    </View>
                    <View style={styles.statBoxMiddle}>
                        <Text style={styles.statNumber}>05</Text>
                        <Text style={styles.statLabel}>BUDDIES</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>08</Text>
                        <Text style={styles.statLabel}>STREAK</Text>
                    </View>
                </View>

                <View style={styles.sectionDivider} />

                {/* Menu List */}
                <View style={styles.menuList}>
                    <Text style={styles.menuHeader}>SETTINGS</Text>
                    {MENU_ITEMS.map((item, index) => (
                        <TouchableOpacity key={index} style={styles.menuItem} activeOpacity={0.7}>
                            <View style={styles.menuItemLeft}>
                                <item.icon size={20} color={colors.textPrimary} />
                                <Text style={styles.menuLabel}>{item.label}</Text>
                            </View>
                            <View style={styles.menuItemRight}>
                                {item.value ? <Text style={styles.menuValue}>{item.value}</Text> : null}
                                <ChevronRight size={16} color={colors.textSecondary} />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Logout */}
                <TouchableOpacity style={styles.logoutButton}>
                    <LogOut size={20} color={colors.error} />
                    <Text style={styles.logoutText}>LOG OUT</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        paddingBottom: TAB_BAR_HEIGHT + 20,
    },
    // Profile Hero
    profileHero: {
        paddingTop: 20,
        paddingBottom: 40,
        marginBottom: 20,
    },
    profileContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: layout.spacing.xl,
        paddingTop: 40, // Extra top space for status bar
        gap: 20,
    },
    avatarBox: {
        width: 80,
        height: 80,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.textPrimary,
    },
    avatarText: {
        fontSize: 24,
        fontWeight: '900',
        color: colors.textPrimary,
        letterSpacing: 1,
    },
    profileInfo: {
        flex: 1,
        gap: 4,
    },
    name: {
        fontSize: 20,
        fontWeight: '800',
        color: colors.textPrimary,
        letterSpacing: -0.5,
    },
    email: {
        fontSize: 12,
        fontFamily: 'Courier',
        color: colors.textSecondary,
        marginBottom: 8,
    },
    badge: {
        backgroundColor: colors.accent,
        paddingHorizontal: 10,
        paddingVertical: 4,
        alignSelf: 'flex-start',
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#FFF',
        letterSpacing: 0.5,
    },
    // Stats
    statsRow: {
        flexDirection: 'row',
        paddingHorizontal: layout.spacing.xl,
        marginBottom: layout.spacing.xl,
    },
    statBox: {
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: colors.borderDark,
        alignItems: 'center',
        gap: 4,
    },
    statBoxMiddle: {
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.borderDark,
        alignItems: 'center',
        gap: 4,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '900',
        color: colors.textPrimary,
    },
    statLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: colors.textSecondary,
        letterSpacing: 1,
    },
    sectionDivider: {
        height: 1,
        backgroundColor: colors.borderDark,
        marginHorizontal: layout.spacing.lg,
        marginBottom: layout.spacing.lg,
    },
    // Menu
    menuList: {
        paddingHorizontal: layout.spacing.xl,
        marginBottom: layout.spacing.xl,
    },
    menuHeader: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.textSecondary,
        letterSpacing: 1,
        marginBottom: 16,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderDark,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    menuLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.textPrimary,
        letterSpacing: 0.5,
    },
    menuItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    menuValue: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.accent,
        letterSpacing: 0.5,
    },
    // Logout
    logoutButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginHorizontal: layout.spacing.xl,
        paddingVertical: 18,
        borderWidth: 1,
        borderColor: colors.error,
        marginTop: 20,
    },
    logoutText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.error,
        letterSpacing: 1,
    },
});

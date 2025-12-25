import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { X, Check } from 'lucide-react-native';
import { Screen } from '../components/Screen';
import { SwipeCard, SwipeCardRef } from '../components/SwipeCard';
import { ProfileButton } from '../components/ProfileButton';
import { layout } from '../theme/layout';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';

const BUDDY_ROLES = [
    'Software Engineer', 'Product Designer', 'Marketing Specialist', 'Data Analyst',
    'Content Writer', 'Sales Associate', 'HR Assistant', 'Graphic Designer'
];

const MENTOR_ROLES = [
    'Senior Manager', 'Tech Lead', 'VP of Engineering', 'Creative Director',
    'Chief Marketing Officer', 'Product Lead', 'Startup Founder', 'Senior Consultant'
];

const BUDDY_NAMES = [
    'Sarah', 'Mike', 'Jessica', 'David', 'Emily', 'Chris', 'Amanda', 'Daniel',
    'Ashley', 'Brian', 'Megan', 'Joshua', 'Rachel', 'Andrew', 'Lauren', 'Kevin',
    'Olivia', 'Justin', 'Hannah', 'Matthew'
];

const MENTOR_NAMES = [
    'Robert', 'Jennifer', 'William', 'Elizabeth', 'James', 'Linda', 'John', 'Susan',
    'Michael', 'Karen', 'Thomas', 'Nancy', 'Richard', 'Lisa', 'Charles', 'Betty',
    'Joseph', 'Margaret', 'Christopher', 'Sandra'
];

const INITIAL_BUDDIES = Array.from({ length: 20 }).map((_, i) => ({
    id: `b${i + 1}`,
    name: BUDDY_NAMES[i % BUDDY_NAMES.length],
    age: 22 + (i % 8),
    role: BUDDY_ROLES[i % BUDDY_ROLES.length],
    location: i % 3 === 0 ? 'New York, USA' : i % 3 === 1 ? 'London, UK' : 'Remote',
    tags: ['Early Career', 'Tech', 'Growth'],
    bio: `Passionate ${BUDDY_ROLES[i % BUDDY_ROLES.length]} looking to connect and grow together.`
}));

const INITIAL_MENTORS = Array.from({ length: 20 }).map((_, i) => ({
    id: `m${i + 1}`,
    name: MENTOR_NAMES[i % MENTOR_NAMES.length],
    age: 35 + (i % 15),
    role: MENTOR_ROLES[i % MENTOR_ROLES.length],
    location: i % 3 === 0 ? 'San Francisco, CA' : i % 3 === 1 ? 'Berlin, DE' : 'Remote',
    tags: ['Leadership', 'Strategy', 'Career'],
    bio: `Experienced ${MENTOR_ROLES[i % MENTOR_ROLES.length]} ready to help you navigate your career path.`
}));

const MESSAGES = [
    { id: '1', name: 'James', message: 'Hey! Did you finish the task?', time: '2m' },
    { id: '2', name: 'Mia', message: 'Thanks for the advice!', time: '1h' },
    { id: '3', name: 'Lucas', message: 'Let’s sync tomorrow.', time: '3h' },
];

export function BuddyScreen() {
    const navigation = useNavigation<any>();
    const [activeTab, setActiveTab] = useState<'buddy' | 'mentor'>('buddy');
    const [buddies, setBuddies] = useState(INITIAL_BUDDIES);
    const [mentors, setMentors] = useState(INITIAL_MENTORS);

    const currentStack = activeTab === 'buddy' ? buddies : mentors;
    const setStack = activeTab === 'buddy' ? setBuddies : setMentors;
    const topCardRef = useRef<SwipeCardRef>(null);

    const handleSwipe = () => {
        setStack((prev) => prev.slice(1));
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Screen>
                {/* Top Toggle Bar */}
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <View style={{ width: 40 }} />
                        <View style={styles.toggleContainer}>
                            <TouchableOpacity
                                style={[styles.toggleBtn, activeTab === 'buddy' && styles.activeToggle]}
                                onPress={() => setActiveTab('buddy')}
                            >
                                <Text style={[styles.toggleText, activeTab === 'buddy' && styles.activeToggleText]}>Buddy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.toggleBtn, activeTab === 'mentor' && styles.activeToggle]}
                                onPress={() => setActiveTab('mentor')}
                            >
                                <Text style={[styles.toggleText, activeTab === 'mentor' && styles.activeToggleText]}>Mentoring</Text>
                            </TouchableOpacity>
                        </View>
                        <ProfileButton />
                    </View>
                </View>

                {/* Swipe Stack */}
                <View style={styles.stackContainer}>
                    {currentStack.length > 0 ? (
                        currentStack
                            .map((item, index) => {
                                if (index > 2) return null;
                                return (
                                    <SwipeCard
                                        key={item.id}
                                        ref={index === 0 ? topCardRef : null}
                                        item={item}
                                        onSwipeLeft={handleSwipe}
                                        onSwipeRight={handleSwipe}
                                    />
                                );
                            })
                            .reverse()
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No more {activeTab === 'buddy' ? 'buddies' : 'mentors'} for today.</Text>
                        </View>
                    )}
                </View>

                {currentStack.length > 0 && (
                    <View style={styles.actionButtonsContainer}>
                        <TouchableOpacity style={[styles.actionButton, styles.nopeButton]} onPress={() => topCardRef.current?.swipeLeft()}>
                            <X size={32} color="#EF4444" />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionButton, styles.likeButton]} onPress={() => topCardRef.current?.swipeRight()}>
                            <Check size={32} color="#4ADE80" />
                        </TouchableOpacity>
                    </View>
                )}

                {/* Messages Section */}
                <View style={styles.messagesSection}>
                    <Text style={styles.sectionTitle}>Recent Chats</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.messagesList}>
                        {MESSAGES.map((msg) => (
                            <TouchableOpacity
                                key={msg.id}
                                style={styles.messageItem}
                                onPress={() => navigation.navigate('ChatDetail', { id: msg.id, name: msg.name })}
                            >
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>{msg.name[0]}</Text>
                                </View>
                                <View style={styles.messageContent}>
                                    <Text style={styles.messageName}>{msg.name}</Text>
                                    <Text style={styles.messagePreview} numberOfLines={1}>{msg.message}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </Screen>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: layout.spacing.lg,
        paddingTop: layout.spacing.sm,
        paddingBottom: layout.spacing.sm,
        zIndex: 10,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        padding: 4,
        borderRadius: layout.borderRadius.xl,
        borderWidth: 1,
        borderColor: colors.borderDark,
        width: 240, // Fixed width for toggle
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    toggleBtn: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: layout.borderRadius.md,
    },
    activeToggle: {
        backgroundColor: colors.primary,
    },
    toggleText: {
        fontWeight: typography.weight.medium as any,
        color: colors.textSecondary,
        fontSize: typography.size.sm,
    },
    activeToggleText: {
        color: colors.surface,
        fontWeight: typography.weight.bold as any,
    },
    messagesSection: {
        paddingHorizontal: layout.spacing.lg,
        paddingBottom: layout.spacing.xl, // Bottom padding for navbar clearance
        marginTop: 'auto', // Push to bottom
    },
    sectionTitle: {
        fontSize: typography.size.sm,
        fontWeight: typography.weight.bold as any,
        color: colors.textSecondary,
        marginBottom: layout.spacing.sm,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    messagesList: {
        gap: layout.spacing.md,
        paddingRight: layout.spacing.lg,
    },
    messageItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: 8,
        borderRadius: layout.borderRadius.lg,
        gap: 10,
        width: 200,
        borderWidth: 1,
        borderColor: colors.borderDark,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: typography.size.md,
        fontWeight: 'bold',
        color: colors.primary,
    },
    messageContent: {
        flex: 1,
    },
    messageName: {
        fontSize: typography.size.sm,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    messagePreview: {
        fontSize: 11,
        color: colors.textSecondary,
    },
    stackContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -20,
    },
    emptyState: {
        padding: layout.spacing.xl,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: typography.size.md,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 40,
        marginBottom: 20,
    },
    actionButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: colors.borderDark,
    },
    nopeButton: {
        borderColor: '#EF4444',
    },
    likeButton: {
        borderColor: '#4ADE80',
    },
});

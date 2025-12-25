import React from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { layout } from '../theme/layout';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';

export function MentoringScreen() {
    return (
        <Screen>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Mentoring</Text>
                <Text style={styles.subtitle}>Expert Guidance</Text>

                <Card style={styles.mentorCard}>
                    <Text style={styles.mentorName}>Sarah J.</Text>
                    <Text style={styles.mentorRole}>Career Coach</Text>
                    <Text style={styles.mentorBio}>
                        Helping people navigate career transitions for 10+ years.
                    </Text>
                </Card>
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: layout.spacing.lg,
        gap: layout.spacing.md,
    },
    title: {
        fontSize: typography.size.xxl,
        fontWeight: typography.weight.bold as any,
        color: colors.textPrimary,
    },
    subtitle: {
        fontSize: typography.size.md,
        color: colors.textSecondary,
        marginBottom: layout.spacing.md,
    },
    mentorCard: {
        gap: layout.spacing.xs,
    },
    mentorName: {
        fontSize: typography.size.lg,
        fontWeight: typography.weight.bold as any,
        color: colors.textPrimary,
    },
    mentorRole: {
        fontSize: typography.size.sm,
        color: colors.primary,
        fontWeight: typography.weight.medium as any,
    },
    mentorBio: {
        fontSize: typography.size.sm,
        color: colors.textSecondary,
        marginTop: layout.spacing.xs,
    },
});

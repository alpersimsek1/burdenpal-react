import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';

export function ProfileButton() {
    const navigation = useNavigation<any>();

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => navigation.navigate('UserProfile')}
            activeOpacity={0.8}
        >
            <View style={styles.avatar}>
                <Text style={styles.initials}>ME</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 4,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    initials: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FFF',
    },
});

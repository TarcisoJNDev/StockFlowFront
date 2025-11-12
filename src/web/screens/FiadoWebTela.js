// src/web/screens/FiadoWebTela.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const FiadosWebScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>📝 Fiados</Text>
                <Text style={styles.subtitle}>Controle de vendas a prazo</Text>
            </View>
            <ScrollView style={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Contas a Receber</Text>
                    <Text>Esta é a tela de Fiados - Em desenvolvimento</Text>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: { backgroundColor: '#fff', padding: 24, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 8 },
    subtitle: { fontSize: 16, color: '#666' },
    content: { flex: 1, padding: 16 },
    card: { backgroundColor: '#fff', padding: 20, borderRadius: 8, marginBottom: 16 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
});

export default FiadosWebScreen;
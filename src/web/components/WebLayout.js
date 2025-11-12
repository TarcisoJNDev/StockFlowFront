// src/web/components/WebLayout.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const WebLayout = ({ children, activeSection, onSectionChange }) => {
    const menuItems = [
        { key: 'produtos', label: 'Produtos', icon: '📦' },
        { key: 'estoque', label: 'Estoque', icon: '📊' },
        { key: 'clientes', label: 'Clientes', icon: '👥' },
        { key: 'fiados', label: 'Fiados', icon: '📝' },
        { key: 'categorias', label: 'Categorias', icon: '📁' },
        { key: 'fornecedor', label: 'Fornecedor', icon: '🏭' },
        { key: 'caixa', label: 'Caixa', icon: '💰' },
    ];

    return (
        <View style={styles.container}>
            {/* Sidebar */}
            <View style={styles.sidebar}>
                <View style={styles.sidebarHeader}>
                    <View style={styles.logoContainer}>
                        <Text style={styles.logoIcon}>📦</Text>
                        <View>
                            <Text style={styles.logo}>StockFlow Web</Text>
                            <Text style={styles.subtitle}>Sistema de Gestão de Estoque</Text>
                        </View>
                    </View>
                </View>

                <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
                    {menuItems.map((item) => (
                        <TouchableOpacity
                            key={item.key}
                            style={[
                                styles.menuItem,
                                activeSection === item.key && styles.menuItemActive
                            ]}
                            onPress={() => onSectionChange(item.key)}
                        >
                            <View style={[
                                styles.menuIconContainer,
                                activeSection === item.key && styles.menuIconActive
                            ]}>
                                <Text style={styles.menuIcon}>{item.icon}</Text>
                            </View>
                            <Text style={[
                                styles.menuText,
                                activeSection === item.key && styles.menuTextActive
                            ]}>
                                {item.label}
                            </Text>
                            {activeSection === item.key && (
                                <View style={styles.activeIndicator} />
                            )}
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Footer do Sidebar */}
                <View style={styles.sidebarFooter}>
                    <View style={styles.versionBadge}>
                        <Text style={styles.footerText}>Versão 1.0</Text>
                    </View>
                </View>
            </View>

            {/* Conteúdo Principal */}
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#f8fafc',
        height: '100vh',
    },
    sidebar: {
        width: 260,
        backgroundColor: '#28a745',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: {
            width: 2,
            height: 0,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    sidebarHeader: {
        padding: 16,
        paddingTop: 22,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    logoIcon: {
        fontSize: 28,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 8,
        borderRadius: 12,
        overflow: 'hidden',
    },
    logo: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 12,
        fontWeight: '500',
    },
    menuContainer: {
        flex: 1,
        padding: 16,
        paddingTop: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 6,
        backgroundColor: 'transparent',
        position: 'relative',
    },
    menuItemActive: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    menuIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    menuIconActive: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    menuIcon: {
        fontSize: 16,
    },
    menuText: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 15,
        fontWeight: '500',
        flex: 1,
    },
    menuTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
    activeIndicator: {
        position: 'absolute',
        right: 16,
        width: 4,
        height: 20,
        backgroundColor: '#fff',
        borderRadius: 2,
    },
    sidebarFooter: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    versionBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        alignSelf: 'center',
    },
    footerText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 11,
        fontWeight: '500',
        textAlign: 'center',
    },
    content: {
        flex: 1,
        backgroundColor: '#f8fafc',
        overflow: 'hidden',
    },
});

export default WebLayout;
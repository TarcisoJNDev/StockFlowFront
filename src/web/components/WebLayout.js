// src/web/components/WebLayout.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useAuth } from './AuthContext';

const WebLayout = ({ children, activeSection, onSectionChange }) => {
    const { user, isDemoMode, signOut } = useAuth();

    const menuItems = [
        { key: 'produtos', label: 'Produtos', icon: '📦', demo: true },
        { key: 'estoque', label: 'Estoque', icon: '📊', demo: false },
        { key: 'clientes', label: 'Clientes', icon: '👥', demo: false },
        { key: 'fiados', label: 'Vendas a Prazo', icon: '📝', demo: false },
        { key: 'categorias', label: 'Categorias', icon: '📁', demo: true },
        { key: 'fornecedor', label: 'Fornecedor', icon: '🏭', demo: true },
        { key: 'caixa', label: 'Caixa', icon: '💰', demo: false },
    ];

    const handleSectionChange = (sectionKey, isDemoAllowed) => {
        if (isDemoMode && !isDemoAllowed) {
            Alert.alert(
                'Funcionalidade Bloqueada',
                'Esta funcionalidade está disponível apenas para usuários cadastrados. Crie uma conta gratuita para acessar todas as funcionalidades do sistema!',
                [
                    { text: 'Entendi', style: 'cancel' },
                    {
                        text: 'Criar Conta',
                        onPress: () => {
                            signOut(); // Volta para a tela de login/cadastro
                        }
                    }
                ]
            );
            return;
        }
        onSectionChange(sectionKey);
    };

    const getAvailableSections = () => {
        if (!isDemoMode) return menuItems;

        return menuItems.map(item => ({
            ...item,
            label: item.demo ? item.label : `🔒 ${item.label}`,
        }));
    };

    const availableSections = getAvailableSections();

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
                            <Text style={styles.userInfo}>
                                {isDemoMode ? 'Modo Demonstração' : `Olá, ${user?.nome}`}
                            </Text>
                            {isDemoMode && (
                                <Text style={styles.demoWarning}>
                                    Funcionalidades limitadas
                                </Text>
                            )}
                        </View>
                    </View>
                    <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
                        <Text style={styles.logoutText}>
                            {isDemoMode ? 'Fazer Login' : 'Sair'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
                    {availableSections.map((item) => (
                        <TouchableOpacity
                            key={item.key}
                            style={[
                                styles.menuItem,
                                activeSection === item.key && styles.menuItemActive,
                                isDemoMode && !item.demo && styles.menuItemDisabled
                            ]}
                            onPress={() => handleSectionChange(item.key, item.demo)}
                            disabled={isDemoMode && !item.demo}
                        >
                            <View style={[
                                styles.menuIconContainer,
                                activeSection === item.key && styles.menuIconActive,
                                isDemoMode && !item.demo && styles.menuIconDisabled
                            ]}>
                                <Text style={styles.menuIcon}>{item.icon}</Text>
                            </View>
                            <Text style={[
                                styles.menuText,
                                activeSection === item.key && styles.menuTextActive,
                                isDemoMode && !item.demo && styles.menuTextDisabled
                            ]}>
                                {item.label}
                            </Text>
                            {activeSection === item.key && (
                                <View style={styles.activeIndicator} />
                            )}
                            {isDemoMode && !item.demo && (
                                <View style={styles.lockIcon}>
                                    <Text>🔒</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Banner de Upgrade no Modo Demo */}
                {isDemoMode && (
                    <View style={styles.upgradeBanner}>
                        <Text style={styles.upgradeTitle}>🚀 Desbloqueie tudo!</Text>
                        <Text style={styles.upgradeText}>
                            Crie uma conta gratuita para acessar todas as funcionalidades
                        </Text>
                        <TouchableOpacity
                            style={styles.upgradeButton}
                            onPress={signOut}
                        >
                            <Text style={styles.upgradeButtonText}>Criar Conta Gratuita</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.sidebarFooter}>
                    <View style={styles.versionBadge}>
                        <Text style={styles.footerText}>
                            {isDemoMode ? 'Modo Demo • ' : ''}Versão 1.0
                        </Text>
                    </View>
                </View>
            </View>

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
        width: 300,
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
        padding: 24,
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
    userInfo: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 12,
        marginTop: 4,
        fontWeight: '500',
    },
    demoWarning: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 10,
        fontStyle: 'italic',
    },
    logoutButton: {
        marginTop: 10,
        padding: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 6,
    },
    logoutText: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 12,
        textAlign: 'center',
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
    menuItemDisabled: {
        opacity: 0.5,
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
    menuIconDisabled: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
    menuTextDisabled: {
        color: 'rgba(255, 255, 255, 0.5)',
    },
    activeIndicator: {
        position: 'absolute',
        right: 16,
        width: 4,
        height: 20,
        backgroundColor: '#fff',
        borderRadius: 2,
    },
    lockIcon: {
        marginLeft: 8,
    },
    upgradeBanner: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        margin: 16,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    upgradeTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
        textAlign: 'center',
    },
    upgradeText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 12,
        lineHeight: 16,
    },
    upgradeButton: {
        backgroundColor: '#fff',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    upgradeButtonText: {
        color: '#28a745',
        fontSize: 12,
        fontWeight: 'bold',
    },
    sidebarFooter: {
        padding: 16,
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
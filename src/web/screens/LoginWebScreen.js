// src/web/screens/LoginWebScreen.js
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator
} from 'react-native';
import { useAuth } from '../components/AuthContext';

const LoginWebScreen = ({ onShowRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { signIn, enterDemoMode } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Por favor, preencha email e senha');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const result = await signIn(email, password);

            if (!result.success) {
                setError(result.error);
            }
        } catch (error) {
            setError('Ocorreu um erro inesperado');
        } finally {
            setLoading(false);
        }
    };

    const handleDemoMode = () => {
        enterDemoMode();
    };

    const handleCreateAccount = () => {
        if (onShowRegister) {
            onShowRegister();
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.logo}>📦 StockFlow</Text>
                    <Text style={styles.subtitle}>Sistema de Gestão de Estoque</Text>
                </View>

                {/* Mensagem de Boas-Vindas */}
                <View style={styles.welcomeContainer}>
                    <Text style={styles.welcomeText}>
                        Experimente nosso sistema! Crie uma conta ou explore as funcionalidades básicas.
                    </Text>
                </View>

                {/* Formulário */}
                <View style={styles.form}>
                    {error ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="seu@email.com"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                setError('');
                            }}
                            onKeyPress={handleKeyPress}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Senha</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Digite sua senha"
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                setError('');
                            }}
                            onKeyPress={handleKeyPress}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.loginButton, loading && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <Text style={styles.loginButtonText}>Entrar</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.createAccountButton}
                        onPress={handleCreateAccount}
                    >
                        <Text style={styles.createAccountText}>Criar Conta</Text>
                    </TouchableOpacity>

                    {/* Separador */}
                    <View style={styles.separator}>
                        <View style={styles.separatorLine} />
                        <Text style={styles.separatorText}>ou</Text>
                        <View style={styles.separatorLine} />
                    </View>

                    {/* Botão Continuar sem Conta */}
                    <TouchableOpacity
                        style={styles.demoButton}
                        onPress={handleDemoMode}
                    >
                        <Text style={styles.demoButtonText}>Continuar sem conta</Text>
                        <Text style={styles.demoButtonSubtext}>Experimente as funcionalidades básicas</Text>
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        No modo demonstração, algumas funcionalidades estarão limitadas.
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#28a745',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 32,
        width: '100%',
        maxWidth: 400,
        maxHeight: '90vh',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    header: {
        alignItems: 'center',
        marginBottom: 16,
    },
    logo: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#28a745',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
    },
    welcomeContainer: {
        backgroundColor: '#f0f9ff',
        borderColor: '#bae6fd',
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
        marginBottom: 16,
    },
    welcomeText: {
        color: '#0369a1',
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 18,
    },
    form: {
        marginBottom: 16,
        position: 'relative',
    },
    errorContainer: {
        backgroundColor: '#fee2e2',
        borderColor: '#fecaca',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
    },
    errorText: {
        color: '#dc2626',
        fontSize: 13,
        textAlign: 'center',
        fontWeight: '500',
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 6,
    },
    input: {
        borderWidth: 1.5,
        borderColor: '#0b8c29ff',
        borderRadius: 10,
        padding: 14,
        fontSize: 15,
        backgroundColor: '#f9fafb',
    },
    loginButton: {
        backgroundColor: '#28a745',
        borderRadius: 10,
        padding: 14,
        alignItems: 'center',
        marginBottom: 10,
        shadowColor: '#28a745',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    createAccountButton: {
        borderWidth: 1.5,
        borderColor: '#28a745',
        borderRadius: 10,
        padding: 14,
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: 'transparent',
    },
    createAccountText: {
        color: '#28a745',
        fontSize: 15,
        fontWeight: '600',
    },
    separator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e5e7eb',
    },
    separatorText: {
        color: '#6b7280',
        paddingHorizontal: 10,
        fontSize: 13,
    },
    demoButton: {
        backgroundColor: '#f8fafc',
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
        borderRadius: 10,
        padding: 16,
        alignItems: 'center',
        marginBottom: 8,
    },
    demoButtonText: {
        color: '#475569',
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 2,
    },
    demoButtonSubtext: {
        color: '#64748b',
        fontSize: 11,
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        paddingTop: 12,
        alignItems: 'center',
    },
    footerText: {
        color: '#6b7280',
        fontSize: 11,
        textAlign: 'center',
        fontStyle: 'italic',
    },
});

export default LoginWebScreen;
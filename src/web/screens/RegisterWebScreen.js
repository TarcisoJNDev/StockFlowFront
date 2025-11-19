// src/web/screens/RegisterWebScreen.js
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    ScrollView
} from 'react-native';
import { useAuth } from '../components/AuthContext';

const RegisterWebScreen = ({ onShowLogin }) => {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        confirmarSenha: '',
        telefone: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { signUp } = useAuth();

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        setError('');
    };

    const formatPhone = (text) => {
        const cleaned = text.replace(/\D/g, '');
        let formattedText = '';

        if (cleaned.length > 0) {
            formattedText = `(${cleaned.substring(0, 2)}`;
        }
        if (cleaned.length > 2) {
            formattedText = `${formattedText}) ${cleaned.substring(2, 7)}`;
        }
        if (cleaned.length > 7) {
            formattedText = `${formattedText}-${cleaned.substring(7, 11)}`;
        }

        return formattedText;
    };

    const handleRegister = async () => {
        // Validações
        if (!formData.nome || !formData.email || !formData.senha || !formData.confirmarSenha) {
            setError('Por favor, preencha todos os campos obrigatórios');
            return;
        }

        if (!formData.email.includes('@') || !formData.email.includes('.')) {
            setError('Por favor, insira um email válido');
            return;
        }

        if (formData.senha.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        if (formData.senha !== formData.confirmarSenha) {
            setError('As senhas não coincidem');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const userData = {
                nome: formData.nome,
                email: formData.email,
                senha: formData.senha,
                telefone: formData.telefone.replace(/\D/g, '')
            };

            const result = await signUp(userData);

            if (!result.success) {
                setError(result.error);
            }
        } catch (error) {
            setError('Erro ao criar conta. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onShowLogin} style={styles.backButton}>
                            <Text style={styles.backButtonText}>← Voltar</Text>
                        </TouchableOpacity>
                        <Text style={styles.logo}>📦 StockFlow</Text>
                        <Text style={styles.subtitle}>Criar Nova Conta</Text>
                    </View>

                    {/* Mensagem de Erro */}
                    {error ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    {/* Formulário */}
                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Nome Completo *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Seu nome completo"
                                value={formData.nome}
                                onChangeText={(value) => handleInputChange('nome', value)}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="seu@email.com"
                                value={formData.email}
                                onChangeText={(value) => handleInputChange('email', value)}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Telefone</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="(00) 00000-0000"
                                value={formData.telefone}
                                onChangeText={(value) => handleInputChange('telefone', formatPhone(value))}
                                keyboardType="phone-pad"
                                maxLength={15}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Senha *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Mínimo 6 caracteres"
                                value={formData.senha}
                                onChangeText={(value) => handleInputChange('senha', value)}
                                secureTextEntry
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Confirmar Senha *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Digite novamente sua senha"
                                value={formData.confirmarSenha}
                                onChangeText={(value) => handleInputChange('confirmarSenha', value)}
                                secureTextEntry
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.registerButton, loading && styles.buttonDisabled]}
                            onPress={handleRegister}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.registerButtonText}>Criar Conta</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
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
        borderRadius: 20,
        width: '100%',
        maxWidth: 500,
        maxHeight: '90vh',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    scrollContent: {
        padding: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    backButton: {
        alignSelf: 'flex-start',
        marginBottom: 15,
    },
    backButtonText: {
        color: '#28a745',
        fontSize: 14,
        fontWeight: '600',
    },
    logo: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#28a745',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6b7280',
        textAlign: 'center',
    },
    errorContainer: {
        backgroundColor: '#fee2e2',
        borderColor: '#fecaca',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
    },
    errorText: {
        color: '#dc2626',
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '500',
    },
    form: {
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        borderWidth: 2,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        backgroundColor: '#f9fafb',
    },
    registerButton: {
        backgroundColor: '#28a745',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#28a745',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default RegisterWebScreen;
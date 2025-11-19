// src/web/components/ModalCadastroFornecedor.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native';

const ModalCadastroFornecedor = ({ visible, onClose, onSalvar, fornecedor }) => {
    const [formData, setFormData] = useState({
        nome: '',
        cpfCnpj: '',
        telefone: '',
        email: '',
        observacao: ''
    });

    useEffect(() => {
        if (fornecedor) {
            // Preencher formulário para edição
            setFormData({
                nome: fornecedor.nome || '',
                cpfCnpj: fornecedor.cpf_cnpj || '',
                telefone: fornecedor.telefone || '',
                email: fornecedor.email || '',
                observacao: fornecedor.observacao || ''
            });
        } else {
            // Limpar formulário para novo cadastro
            setFormData({
                nome: '',
                cpfCnpj: '',
                telefone: '',
                email: '',
                observacao: ''
            });
        }
    }, [fornecedor]);

    const handleSalvar = () => {
        // Validações básicas
        if (!formData.nome.trim()) {
            Alert.alert('Erro', 'Por favor, informe o nome do fornecedor');
            return;
        }

        onSalvar(formData);
        setFormData({
            nome: '',
            cpfCnpj: '',
            telefone: '',
            email: '',
            observacao: ''
        });
        onClose();
    };

    const handleCancelar = () => {
        setFormData({
            nome: '',
            cpfCnpj: '',
            telefone: '',
            email: '',
            observacao: ''
        });
        onClose();
    };

    // Formatar CPF/CNPJ durante a digitação
    const formatarCpfCnpjInput = (text) => {
        const cleaned = text.replace(/\D/g, '');

        if (cleaned.length <= 11) {
            // CPF
            if (cleaned.length <= 3) {
                return cleaned;
            } else if (cleaned.length <= 6) {
                return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
            } else if (cleaned.length <= 9) {
                return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
            } else {
                return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`;
            }
        } else {
            // CNPJ
            if (cleaned.length <= 2) {
                return cleaned;
            } else if (cleaned.length <= 5) {
                return `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`;
            } else if (cleaned.length <= 8) {
                return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5)}`;
            } else if (cleaned.length <= 12) {
                return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8)}`;
            } else {
                return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12, 14)}`;
            }
        }
    };

    // Formatar telefone durante a digitação
    const formatarTelefoneInput = (text) => {
        const cleaned = text.replace(/\D/g, '');

        if (cleaned.length <= 2) {
            return `(${cleaned}`;
        } else if (cleaned.length <= 6) {
            return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
        } else if (cleaned.length <= 10) {
            return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
        } else {
            return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
        }
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={handleCancelar}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.modalOverlay}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {/* Header do Modal */}
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>🏭 Novo Fornecedor</Text>
                            <TouchableOpacity onPress={handleCancelar} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>×</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Formulário */}
                        <ScrollView style={styles.form}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Nome do Fornecedor *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ex: Nestlé, Coca-Cola, Sadia"
                                    value={formData.nome}
                                    onChangeText={(text) => setFormData({ ...formData, nome: text })}
                                />
                            </View>

                            <View style={styles.row}>
                                <View style={[styles.inputGroup, styles.halfInput]}>
                                    <Text style={styles.label}>CPF/CNPJ</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="000.000.000-00 ou 00.000.000/0000-00"
                                        value={formData.cpfCnpj}
                                        onChangeText={(text) => setFormData({ ...formData, cpfCnpj: formatarCpfCnpjInput(text) })}
                                        maxLength={18}
                                    />
                                </View>

                                <View style={[styles.inputGroup, styles.halfInput]}>
                                    <Text style={styles.label}>Telefone</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="(00) 00000-0000"
                                        value={formData.telefone}
                                        onChangeText={(text) => setFormData({ ...formData, telefone: formatarTelefoneInput(text) })}
                                        maxLength={15}
                                        keyboardType="phone-pad"
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>E-mail</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="exemplo@empresa.com"
                                    value={formData.email}
                                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Observações</Text>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    placeholder="Informações adicionais sobre o fornecedor..."
                                    value={formData.observacao}
                                    onChangeText={(text) => setFormData({ ...formData, observacao: text })}
                                    multiline={true}
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                />
                            </View>
                        </ScrollView>

                        {/* Footer do Modal */}
                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={[styles.botao, styles.botaoCancelar]}
                                onPress={handleCancelar}
                            >
                                <Text style={styles.textoBotaoCancelar}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.botao, styles.botaoSalvar]}
                                onPress={handleSalvar}
                            >
                                <Text style={styles.textoBotaoSalvar}>Salvar Fornecedor</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        maxWidth: 600,
        maxHeight: '90%',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 12,
        overflow: 'hidden',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: 5,
    },
    closeButtonText: {
        fontSize: 24,
        color: '#6c757d',
        fontWeight: 'bold',
    },
    form: {
        maxHeight: 500,
        padding: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    halfInput: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#f8f9fa',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
        gap: 12,
    },
    botao: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        minWidth: 120,
        alignItems: 'center',
    },
    botaoCancelar: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#6c757d',
    },
    botaoSalvar: {
        backgroundColor: '#28a745',
    },
    textoBotaoCancelar: {
        color: '#6c757d',
        fontSize: 16,
        fontWeight: '600',
    },
    textoBotaoSalvar: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ModalCadastroFornecedor;
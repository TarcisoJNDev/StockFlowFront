// src/web/components/ModalCadastroCliente.js
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
    Alert,
    ActivityIndicator
} from 'react-native';

const ModalCadastroCliente = ({ visible, onClose, onSalvar, cliente }) => {
    const [formData, setFormData] = useState({
        nome: '',
        cpfCnpj: '',
        telefone: '',
        email: '',
        dataNascimento: '',
        observacao: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (cliente) {
            // Preencher formulário para edição
            setFormData({
                nome: cliente.nome || '',
                cpfCnpj: cliente.cpfCnpj || '',
                telefone: cliente.telefone || '',
                email: cliente.email || '',
                dataNascimento: cliente.dataNascimento ? formatarDataParaExibicao(cliente.dataNascimento) : '',
                observacao: cliente.observacao || ''
            });
        } else {
            // Limpar formulário para novo cadastro
            setFormData({
                nome: '',
                cpfCnpj: '',
                telefone: '',
                email: '',
                dataNascimento: '',
                observacao: ''
            });
        }
    }, [cliente]);

    const formatarDataParaExibicao = (data) => {
        if (!data) return '';
        // Se a data estiver no formato ISO (YYYY-MM-DD)
        if (data.includes('-')) {
            const [ano, mes, dia] = data.split('-');
            return `${dia}/${mes}/${ano}`;
        }
        return data;
    };

    const formatarTelefone = (text) => {
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

    const formatarCPF = (text) => {
        const cleaned = text.replace(/\D/g, '');
        let formattedText = '';

        if (cleaned.length > 0) {
            formattedText = `${cleaned.substring(0, 3)}`;
        }
        if (cleaned.length > 3) {
            formattedText = `${formattedText}.${cleaned.substring(3, 6)}`;
        }
        if (cleaned.length > 6) {
            formattedText = `${formattedText}.${cleaned.substring(6, 9)}`;
        }
        if (cleaned.length > 9) {
            formattedText = `${formattedText}-${cleaned.substring(9, 11)}`;
        }
        return formattedText;
    };

    const formatarCNPJ = (text) => {
        const cleaned = text.replace(/\D/g, '');
        let formattedText = '';

        if (cleaned.length > 0) {
            formattedText = `${cleaned.substring(0, 2)}`;
        }
        if (cleaned.length > 2) {
            formattedText = `${formattedText}.${cleaned.substring(2, 5)}`;
        }
        if (cleaned.length > 5) {
            formattedText = `${formattedText}.${cleaned.substring(5, 8)}`;
        }
        if (cleaned.length > 8) {
            formattedText = `${formattedText}/${cleaned.substring(8, 12)}`;
        }
        if (cleaned.length > 12) {
            formattedText = `${formattedText}-${cleaned.substring(12, 14)}`;
        }
        return formattedText;
    };

    const handleCpfCnpjChange = (text) => {
        const cleaned = text.replace(/\D/g, '');
        if (cleaned.length <= 11) {
            setFormData({ ...formData, cpfCnpj: formatarCPF(text) });
        } else {
            setFormData({ ...formData, cpfCnpj: formatarCNPJ(text) });
        }
    };

    const formatarDataInput = (text) => {
        let cleaned = text.replace(/\D/g, '');
        let formatted = '';

        if (cleaned.length > 0) {
            formatted = cleaned.substring(0, 2);
        }
        if (cleaned.length > 2) {
            formatted += '/' + cleaned.substring(2, 4);
        }
        if (cleaned.length > 4) {
            formatted += '/' + cleaned.substring(4, 8);
        }

        return formatted;
    };

    const handleSalvar = async () => {
        // Validações básicas
        if (!formData.nome.trim()) {
            Alert.alert('Erro', 'Por favor, informe o nome do cliente');
            return;
        }

        if (!formData.cpfCnpj.trim()) {
            Alert.alert('Erro', 'Por favor, informe o CPF/CNPJ');
            return;
        }

        setLoading(true);
        try {
            await onSalvar(formData);
            setFormData({
                nome: '',
                cpfCnpj: '',
                telefone: '',
                email: '',
                dataNascimento: '',
                observacao: ''
            });
            onClose();
        } finally {
            setLoading(false);
        }
    };

    const handleCancelar = () => {
        setFormData({
            nome: '',
            cpfCnpj: '',
            telefone: '',
            email: '',
            dataNascimento: '',
            observacao: ''
        });
        onClose();
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
                            <Text style={styles.modalTitle}>
                                {cliente ? '✏️ Editar Cliente' : '👤 Novo Cliente'}
                            </Text>
                            <TouchableOpacity onPress={handleCancelar} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>×</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Formulário */}
                        <ScrollView style={styles.form}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Nome *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Nome completo ou razão social"
                                    value={formData.nome}
                                    onChangeText={(text) => setFormData({ ...formData, nome: text })}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>CPF/CNPJ *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="000.000.000-00 ou 00.000.000/0000-00"
                                    value={formData.cpfCnpj}
                                    onChangeText={handleCpfCnpjChange}
                                    keyboardType="numeric"
                                    maxLength={18}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Telefone</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="(00) 00000-0000"
                                    value={formData.telefone}
                                    onChangeText={(text) => setFormData({ ...formData, telefone: formatarTelefone(text) })}
                                    keyboardType="phone-pad"
                                    maxLength={15}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Email</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="email@exemplo.com"
                                    value={formData.email}
                                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Data de Nascimento</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="DD/MM/AAAA"
                                    value={formData.dataNascimento}
                                    onChangeText={(text) => setFormData({ ...formData, dataNascimento: formatarDataInput(text) })}
                                    keyboardType="numeric"
                                    maxLength={10}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Observações</Text>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    placeholder="Observações adicionais sobre o cliente..."
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
                                disabled={loading}
                            >
                                <Text style={styles.textoBotaoCancelar}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.botao, styles.botaoSalvar]}
                                onPress={handleSalvar}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" size="small" />
                                ) : (
                                    <Text style={styles.textoBotaoSalvar}>
                                        {cliente ? 'Atualizar' : 'Salvar'} Cliente
                                    </Text>
                                )}
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
        maxWidth: 500,
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
        maxHeight: 400,
        padding: 20,
    },
    inputGroup: {
        marginBottom: 20,
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
        backgroundColor: '#4CAF50',
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

export default ModalCadastroCliente;
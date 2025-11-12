// src/web/components/ModalEntradaEstoque.js
import React, { useState } from 'react';
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

const ModalEntradaEstoque = ({ visible, produto, onClose, onSalvar }) => {
    const [quantidade, setQuantidade] = useState('');
    const [observacao, setObservacao] = useState('');

    const handleSalvar = () => {
        if (!quantidade || parseInt(quantidade) <= 0) {
            Alert.alert('Erro', 'Informe uma quantidade válida');
            return;
        }

        if (!produto) {
            Alert.alert('Erro', 'Produto não selecionado');
            return;
        }

        onSalvar(quantidade, observacao);
        setQuantidade('');
        setObservacao('');
    };

    const handleCancelar = () => {
        setQuantidade('');
        setObservacao('');
        onClose();
    };

    if (!produto) return null;

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
                            <Text style={styles.modalTitle}>📥 Entrada no Estoque</Text>
                            <TouchableOpacity onPress={handleCancelar} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>×</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.form}>
                            {/* Informações do Produto */}
                            <View style={styles.infoProduto}>
                                <Text style={styles.infoLabel}>Produto:</Text>
                                <Text style={styles.infoValue}>{produto.nome}</Text>
                            </View>

                            <View style={styles.infoProduto}>
                                <Text style={styles.infoLabel}>Estoque Atual:</Text>
                                <Text style={styles.infoValue}>{produto.estoqueAtual || 0} unidades</Text>
                            </View>

                            {/* Quantidade */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Quantidade a Adicionar *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Digite a quantidade"
                                    value={quantidade}
                                    onChangeText={setQuantidade}
                                    keyboardType="numeric"
                                />
                            </View>

                            {/* Observação */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Observação (Opcional)</Text>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    placeholder="Motivo da entrada, lote, etc."
                                    value={observacao}
                                    onChangeText={setObservacao}
                                    multiline={true}
                                    numberOfLines={3}
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
                                <Text style={styles.textoBotaoSalvar}>Confirmar Entrada</Text>
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
        backgroundColor: '#d4edda',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#155724',
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
    infoProduto: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    infoLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    infoValue: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
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
        height: 80,
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

export default ModalEntradaEstoque;
// src/web/components/ModalDetalhesCliente.js
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView
} from 'react-native';

const ModalDetalhesCliente = ({ visible, cliente, onClose, onEditar, onExcluir }) => {

    if (!cliente) return null;

    // Formatar telefone para exibição
    const formatarTelefone = (telefone) => {
        if (!telefone) return 'Não informado';
        const cleaned = telefone.replace(/\D/g, '');

        if (cleaned.length === 11) {
            return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
        } else if (cleaned.length === 10) {
            return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
        }
        return telefone;
    };

    // Formatar CPF/CNPJ para exibição
    const formatarCpfCnpj = (cpfCnpj) => {
        if (!cpfCnpj) return 'Não informado';
        const cleaned = cpfCnpj.replace(/\D/g, '');

        if (cleaned.length === 11) {
            return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
        } else if (cleaned.length === 14) {
            return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12)}`;
        }
        return cpfCnpj;
    };

    // Formatar data de nascimento
    const formatarDataNascimento = (data) => {
        if (!data) return 'Não informada';

        // Se a data já estiver no formato ISO (YYYY-MM-DD)
        if (data.includes('-')) {
            const [ano, mes, dia] = data.split('-');
            return `${dia}/${mes}/${ano}`;
        }

        return data;
    };

    // Calcular idade
    const calcularIdade = (dataNascimento) => {
        if (!dataNascimento) return null;

        try {
            const nascimento = new Date(dataNascimento);
            const hoje = new Date();
            let idade = hoje.getFullYear() - nascimento.getFullYear();

            const mesAtual = hoje.getMonth();
            const mesNascimento = nascimento.getMonth();

            if (mesAtual < mesNascimento ||
                (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
                idade--;
            }

            return idade;
        } catch (error) {
            return null;
        }
    };

    // Determinar tipo de cliente
    const getTipoCliente = () => {
        const cpfCnpj = cliente.cpfCnpj || '';
        return cpfCnpj.replace(/\D/g, '').length <= 11 ? 'Pessoa Física' : 'Pessoa Jurídica';
    };

    const idade = calcularIdade(cliente.dataNascimento);
    const tipoCliente = getTipoCliente();

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {/* Header do Modal */}
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>👤 Detalhes do Cliente</Text>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>×</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.form}>
                            {/* Informações básicas */}
                            <View style={styles.secao}>
                                <View style={styles.clienteHeader}>
                                    <View style={styles.iconeGrande}>
                                        <Text style={styles.textoIconeGrande}>👤</Text>
                                    </View>
                                    <View style={styles.infoBasica}>
                                        <Text style={styles.nomeCliente}>{cliente.nome || 'Sem nome'}</Text>
                                        <Text style={styles.tipoCliente}>{tipoCliente}</Text>
                                        <Text style={styles.documentoCliente}>
                                            {formatarCpfCnpj(cliente.cpfCnpj)}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* Informações de contato */}
                            <View style={styles.secao}>
                                <Text style={styles.secaoTitulo}>Informações de Contato</Text>

                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Telefone:</Text>
                                    <Text style={styles.infoValue}>
                                        {formatarTelefone(cliente.telefone)}
                                    </Text>
                                </View>

                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Email:</Text>
                                    <Text style={styles.infoValue}>
                                        {cliente.email || 'Não informado'}
                                    </Text>
                                </View>
                            </View>

                            {/* Informações pessoais */}
                            <View style={styles.secao}>
                                <Text style={styles.secaoTitulo}>Informações Pessoais</Text>

                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Data de Nascimento:</Text>
                                    <Text style={styles.infoValue}>
                                        {cliente.dataNascimento ?
                                            `${formatarDataNascimento(cliente.dataNascimento)}${idade ? ` (${idade} anos)` : ''}`
                                            : 'Não informada'
                                        }
                                    </Text>
                                </View>

                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Tipo:</Text>
                                    <Text style={styles.infoValue}>{tipoCliente}</Text>
                                </View>
                            </View>

                            {/* Observações */}
                            {cliente.observacao && (
                                <View style={styles.secao}>
                                    <Text style={styles.secaoTitulo}>Observações</Text>
                                    <Text style={styles.observacaoTexto}>
                                        {cliente.observacao}
                                    </Text>
                                </View>
                            )}
                        </ScrollView>

                        {/* Footer do Modal */}
                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={[styles.botao, styles.botaoExcluir]}
                                onPress={() => onExcluir(cliente.id, cliente.nome)}
                            >
                                <Text style={styles.textoBotaoExcluir}>Excluir</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.botao, styles.botaoEditar]}
                                onPress={() => onEditar(cliente)}
                            >
                                <Text style={styles.textoBotaoEditar}>Editar Cliente</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
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
    secao: {
        marginBottom: 24,
    },
    clienteHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconeGrande: {
        width: 60,
        height: 60,
        borderRadius: 12,
        backgroundColor: '#e3f2fd',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    textoIconeGrande: {
        fontSize: 24,
    },
    infoBasica: {
        flex: 1,
    },
    nomeCliente: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    tipoCliente: {
        fontSize: 16,
        color: '#4CAF50',
        fontWeight: '600',
        marginBottom: 4,
    },
    documentoCliente: {
        fontSize: 14,
        color: '#666',
    },
    secaoTitulo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
        paddingBottom: 8,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
        paddingVertical: 8,
    },
    infoLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    infoValue: {
        fontSize: 14,
        color: '#666',
        flex: 2,
        textAlign: 'right',
    },
    observacaoTexto: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 8,
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
        gap: 12,
    },
    botao: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        flex: 1,
        alignItems: 'center',
    },
    botaoExcluir: {
        backgroundColor: '#dc3545',
    },
    botaoEditar: {
        backgroundColor: '#007AFF',
    },
    textoBotaoExcluir: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    textoBotaoEditar: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ModalDetalhesCliente;
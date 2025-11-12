// src/web/components/ModalDetalhesFornecedor.js
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
    FlatList
} from 'react-native';

const ModalDetalhesFornecedor = ({ visible, fornecedor, produtos, onClose, onEditar, onExcluir }) => {

    if (!fornecedor) return null;

    // Formatar telefone
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

    // Formatar CPF/CNPJ - CORRIGIDO para usar cpf_cnpj
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

    // Filtrar produtos do fornecedor
    const produtosDoFornecedor = produtos.filter(produto =>
        produto.fornecedor?.id === fornecedor.id
    );

    const renderProdutoItem = ({ item }) => (
        <View style={styles.produtoItem}>
            <Text style={styles.produtoNome}>{item.nome}</Text>
            <View style={styles.produtoInfo}>
                <Text style={styles.produtoEstoque}>Estoque: {item.estoqueAtual || 0}</Text>
                <Text style={styles.produtoPreco}>R$ {item.precoUnitarioVenda?.toFixed(2) || '0.00'}</Text>
            </View>
        </View>
    );

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
                            <Text style={styles.modalTitle}>🏭 Detalhes do Fornecedor</Text>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>×</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.form}>
                            {/* Informações do Fornecedor */}
                            <View style={styles.secao}>
                                <View style={styles.fornecedorHeader}>
                                    <View style={styles.iconeGrande}>
                                        <Text style={styles.textoIconeGrande}>🏭</Text>
                                    </View>
                                    <View style={styles.infoBasica}>
                                        <Text style={styles.nomeFornecedor}>{fornecedor.nome}</Text>
                                        <Text style={styles.documentoFornecedor}>
                                            {formatarCpfCnpj(fornecedor.cpf_cnpj)} {/* CORRIGIDO: cpf_cnpj */}
                                        </Text>
                                        <Text style={styles.totalProdutos}>
                                            {produtosDoFornecedor.length} produtos deste fornecedor
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* Contato */}
                            <View style={styles.secao}>
                                <Text style={styles.secaoTitulo}>Informações de Contato</Text>

                                <View style={styles.infoContainer}>
                                    <View style={styles.infoItem}>
                                        <Text style={styles.infoLabel}>Telefone:</Text>
                                        <Text style={styles.infoValue}>
                                            {formatarTelefone(fornecedor.telefone)}
                                        </Text>
                                    </View>

                                    <View style={styles.infoItem}>
                                        <Text style={styles.infoLabel}>E-mail:</Text>
                                        <Text style={styles.infoValue}>
                                            {fornecedor.email || 'Não informado'}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* Observações */}
                            {fornecedor.observacao && (
                                <View style={styles.secao}>
                                    <Text style={styles.secaoTitulo}>Observações</Text>
                                    <View style={styles.observacaoContainer}>
                                        <Text style={styles.observacaoTexto}>
                                            {fornecedor.observacao}
                                        </Text>
                                    </View>
                                </View>
                            )}

                            {/* Produtos do Fornecedor */}
                            <View style={styles.secao}>
                                <Text style={styles.secaoTitulo}>
                                    Produtos ({produtosDoFornecedor.length})
                                </Text>

                                {produtosDoFornecedor.length > 0 ? (
                                    <FlatList
                                        data={produtosDoFornecedor}
                                        keyExtractor={(item) => item.id?.toString()}
                                        renderItem={renderProdutoItem}
                                        scrollEnabled={false}
                                        style={styles.listaProdutos}
                                    />
                                ) : (
                                    <View style={styles.semProdutos}>
                                        <Text style={styles.semProdutosTexto}>
                                            📦 Nenhum produto deste fornecedor
                                        </Text>
                                        <Text style={styles.semProdutosSubtexto}>
                                            Os produtos aparecerão aqui quando forem associados a este fornecedor
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </ScrollView>

                        {/* Footer do Modal */}
                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={[styles.botao, styles.botaoExcluir]}
                                onPress={() => onExcluir(fornecedor.id, fornecedor.nome)}
                            >
                                <Text style={styles.textoBotaoExcluir}>Excluir</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.botao, styles.botaoEditar]}
                                onPress={() => onEditar(fornecedor)}
                            >
                                <Text style={styles.textoBotaoEditar}>Editar Fornecedor</Text>
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
    fornecedorHeader: {
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
    nomeFornecedor: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    documentoFornecedor: {
        fontSize: 16,
        color: '#666',
        marginBottom: 4,
    },
    totalProdutos: {
        fontSize: 14,
        color: '#28a745',
        fontWeight: '600',
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
    infoContainer: {
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 8,
    },
    infoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    infoLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    infoValue: {
        fontSize: 14,
        color: '#666',
    },
    observacaoContainer: {
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 8,
    },
    observacaoTexto: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
    },
    listaProdutos: {
        maxHeight: 300,
    },
    produtoItem: {
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 8,
        marginBottom: 8,
    },
    produtoNome: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    produtoInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    produtoEstoque: {
        fontSize: 14,
        color: '#666',
    },
    produtoPreco: {
        fontSize: 14,
        fontWeight: '600',
        color: '#28a745',
    },
    semProdutos: {
        padding: 40,
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
    },
    semProdutosTexto: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8,
    },
    semProdutosSubtexto: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
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

export default ModalDetalhesFornecedor;
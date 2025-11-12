// src/web/components/ModalDetalhesProduto.js (ATUALIZADO)
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
    Image,
    Alert
} from 'react-native';

const ModalDetalhesProduto = ({ visible, produto, onClose, onSalvar }) => {

    if (!produto) return null;

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
                            <Text style={styles.modalTitle}>📦 Detalhes do Produto</Text>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>×</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.form}>
                            {/* Foto e Informações Básicas */}
                            <View style={styles.secao}>
                                <View style={styles.fotoContainer}>
                                    {produto.foto ? (
                                        <Image
                                            source={{ uri: produto.foto }}
                                            style={styles.fotoProduto}
                                        />
                                    ) : (
                                        <View style={styles.fotoPlaceholder}>
                                            <Text style={styles.fotoPlaceholderText}>📦</Text>
                                        </View>
                                    )}
                                </View>

                                <View style={styles.infoBasica}>
                                    <Text style={styles.nomeProduto}>{produto.nome || 'Sem nome'}</Text>
                                    <Text style={styles.categoriaProduto}>
                                        {produto.categoria?.nome || 'Sem categoria'}
                                    </Text>
                                    <Text style={styles.codigoBarras}>
                                        Código: {produto.codigoDeBarras || 'N/A'}
                                    </Text>
                                </View>
                            </View>

                            {/* Descrição */}
                            <View style={styles.secao}>
                                <Text style={styles.secaoTitulo}>Descrição</Text>
                                <Text style={styles.descricao}>
                                    {produto.descricao || 'Nenhuma descrição fornecida.'}
                                </Text>
                            </View>

                            {/* Preços e Lucros */}
                            <View style={styles.secao}>
                                <Text style={styles.secaoTitulo}>Informações Financeiras</Text>
                                <View style={styles.gridInfo}>
                                    <View style={styles.infoItem}>
                                        <Text style={styles.infoLabel}>Custo de Compra</Text>
                                        <Text style={styles.infoValor}>
                                            R$ {produto.custoCompra?.toFixed(2) || '0.00'}
                                        </Text>
                                    </View>
                                    <View style={styles.infoItem}>
                                        <Text style={styles.infoLabel}>Preço de Venda</Text>
                                        <Text style={styles.infoValor}>
                                            R$ {produto.precoUnitarioVenda?.toFixed(2) || '0.00'}
                                        </Text>
                                    </View>
                                    <View style={styles.infoItem}>
                                        <Text style={styles.infoLabel}>Lucro (R$)</Text>
                                        <Text style={[styles.infoValor, styles.lucroPositivo]}>
                                            R$ {(
                                                (produto.precoUnitarioVenda || 0) -
                                                (produto.custoCompra || 0)
                                            ).toFixed(2)}
                                        </Text>
                                    </View>
                                    <View style={styles.infoItem}>
                                        <Text style={styles.infoLabel}>Lucro (%)</Text>
                                        <Text style={[styles.infoValor, styles.lucroPositivo]}>
                                            {(
                                                ((produto.precoUnitarioVenda || 0) - (produto.custoCompra || 0)) /
                                                (produto.custoCompra || 1) * 100
                                            ).toFixed(2)}%
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* Estoque */}
                            <View style={styles.secao}>
                                <Text style={styles.secaoTitulo}>Estoque</Text>
                                <View style={styles.gridInfo}>
                                    <View style={styles.infoItem}>
                                        <Text style={styles.infoLabel}>Quantidade Atual</Text>
                                        <Text style={[
                                            styles.infoValor,
                                            produto.estoqueAtual <= produto.estoqueMinimo && styles.estoqueBaixo
                                        ]}>
                                            {produto.estoqueAtual || 0}
                                        </Text>
                                    </View>
                                    <View style={styles.infoItem}>
                                        <Text style={styles.infoLabel}>Estoque Mínimo</Text>
                                        <Text style={styles.infoValor}>
                                            {produto.estoqueMinimo || 0}
                                        </Text>
                                    </View>
                                    <View style={styles.infoItem}>
                                        <Text style={styles.infoLabel}>Unidade</Text>
                                        <Text style={styles.infoValor}>
                                            {produto.unidadeMedida || 'UN'}
                                        </Text>
                                    </View>
                                    <View style={styles.infoItem}>
                                        <Text style={styles.infoLabel}>Fornecedor</Text>
                                        <Text style={styles.infoValor}>
                                            {produto.fornecedor?.nome || 'N/A'}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>

                        {/* Footer do Modal */}
                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={[styles.botao, styles.botaoSecundario]}
                                onPress={onClose}
                            >
                                <Text style={styles.textoBotaoSecundario}>Fechar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.botao, styles.botaoPrimario]}
                                onPress={() => {
                                    Alert.alert('Editar', 'Funcionalidade de edição em desenvolvimento');
                                }}
                            >
                                <Text style={styles.textoBotaoPrimario}>Editar Produto</Text>
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
    secaoTitulo: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
        paddingBottom: 8,
    },
    fotoContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    fotoProduto: {
        width: 120,
        height: 120,
        borderRadius: 12,
    },
    fotoPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 12,
        backgroundColor: '#e9ecef',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fotoPlaceholderText: {
        fontSize: 40,
    },
    infoBasica: {
        alignItems: 'center',
    },
    nomeProduto: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 8,
    },
    categoriaProduto: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8,
    },
    codigoBarras: {
        fontSize: 14,
        color: '#999',
    },
    descricao: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
    },
    gridInfo: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    infoItem: {
        flex: 1,
        minWidth: 120,
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        textAlign: 'center',
    },
    infoValor: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    lucroPositivo: {
        color: '#28a745',
    },
    estoqueBaixo: {
        color: '#dc3545',
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
    botaoSecundario: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#6c757d',
    },
    botaoPrimario: {
        backgroundColor: '#007AFF',
    },
    textoBotaoSecundario: {
        color: '#6c757d',
        fontSize: 16,
        fontWeight: '600',
    },
    textoBotaoPrimario: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ModalDetalhesProduto;
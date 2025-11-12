// src/web/components/ModalDetalhesCategoria.js
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

const ModalDetalhesCategoria = ({ visible, categoria, produtos, onClose, onSalvar }) => {

    if (!categoria) return null;

    // Filtrar produtos da categoria
    const produtosDaCategoria = produtos.filter(produto =>
        produto.categoria?.id === categoria.id
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
                            <Text style={styles.modalTitle}>📁 Detalhes da Categoria</Text>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>×</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.form}>
                            {/* Informações da Categoria */}
                            <View style={styles.secao}>
                                <View style={styles.categoriaHeader}>
                                    <View style={styles.iconeGrande}>
                                        <Text style={styles.textoIconeGrande}>📁</Text>
                                    </View>
                                    <View style={styles.infoBasica}>
                                        <Text style={styles.nomeCategoria}>{categoria.nome}</Text>
                                        <Text style={styles.totalProdutos}>
                                            {produtosDaCategoria.length} produtos nesta categoria
                                        </Text>
                                    </View>
                                </View>

                                {categoria.descricao && (
                                    <View style={styles.descricaoContainer}>
                                        <Text style={styles.descricaoLabel}>Descrição:</Text>
                                        <Text style={styles.descricaoTexto}>{categoria.descricao}</Text>
                                    </View>
                                )}
                            </View>

                            {/* Lista de Produtos */}
                            <View style={styles.secao}>
                                <Text style={styles.secaoTitulo}>
                                    Produtos ({produtosDaCategoria.length})
                                </Text>

                                {produtosDaCategoria.length > 0 ? (
                                    <FlatList
                                        data={produtosDaCategoria}
                                        keyExtractor={(item) => item.id?.toString()}
                                        renderItem={renderProdutoItem}
                                        scrollEnabled={false}
                                        style={styles.listaProdutos}
                                    />
                                ) : (
                                    <View style={styles.semProdutos}>
                                        <Text style={styles.semProdutosTexto}>
                                            📦 Nenhum produto nesta categoria
                                        </Text>
                                        <Text style={styles.semProdutosSubtexto}>
                                            Os produtos aparecerão aqui quando forem associados a esta categoria
                                        </Text>
                                    </View>
                                )}
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
                                    // Funcionalidade de edição pode ser adicionada aqui
                                    alert('Funcionalidade de edição em desenvolvimento');
                                }}
                            >
                                <Text style={styles.textoBotaoPrimario}>Editar Categoria</Text>
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
    categoriaHeader: {
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
    nomeCategoria: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    totalProdutos: {
        fontSize: 16,
        color: '#666',
    },
    descricaoContainer: {
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 8,
    },
    descricaoLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    descricaoTexto: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
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

export default ModalDetalhesCategoria;
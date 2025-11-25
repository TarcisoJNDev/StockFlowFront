import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Modal,
    FlatList,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function CaixaTela({ navigation }) {
    const [carrinho, setCarrinho] = useState([]);
    const [modalDetalhesVisible, setModalDetalhesVisible] = useState(false);
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);

    // Produtos fixos para demonstração (em estoque)
    const produtosEstoque = [
        {
            id: 1,
            nome: 'COCA COLA 2L',
            preco: 8.50,
            codigo: '00696621470',
            estoque: 15,
            categoria: 'Bebidas'
        },
        {
            id: 2,
            nome: 'ARROZ 5KG',
            preco: 23.50,
            codigo: '1001',
            estoque: 20,
            categoria: 'Grãos'
        },
        {
            id: 3,
            nome: 'FEIJÃO 1KG',
            preco: 9.50,
            codigo: '1002',
            estoque: 15,
            categoria: 'Grãos'
        },
        {
            id: 4,
            nome: 'AÇÚCAR 1KG',
            preco: 4.20,
            codigo: '1003',
            estoque: 18,
            categoria: 'Mercearia'
        },
        {
            id: 5,
            nome: 'CAFÉ 500G',
            preco: 12.90,
            codigo: '1004',
            estoque: 10,
            categoria: 'Mercearia'
        },
    ];

    // Calcular totais
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    const totalVenda = carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    const valorMedio = totalItens > 0 ? (totalVenda / totalItens).toFixed(2) : 0;

    const adicionarAoCarrinho = (produto) => {
        const produtoExistente = carrinho.find(item => item.id === produto.id);

        if (produtoExistente) {
            const novaQuantidade = produtoExistente.quantidade + 1;
            if (novaQuantidade > produto.estoque) {
                Alert.alert('Estoque Insuficiente', `Só temos ${produto.estoque} unidades em estoque`);
                return;
            }

            setCarrinho(carrinho.map(item =>
                item.id === produto.id
                    ? { ...item, quantidade: novaQuantidade }
                    : item
            ));
        } else {
            if (1 > produto.estoque) {
                Alert.alert('Estoque Insuficiente', `Só temos ${produto.estoque} unidades em estoque`);
                return;
            }

            setCarrinho([...carrinho, {
                ...produto,
                quantidade: 1,
                dataAdicao: new Date().toLocaleTimeString()
            }]);
        }
    };

    const removerDoCarrinho = (id) => {
        setCarrinho(carrinho.filter(item => item.id !== id));
    };

    const alterarQuantidade = (id, novaQuantidade) => {
        if (novaQuantidade <= 0) {
            removerDoCarrinho(id);
            return;
        }

        const produto = produtosEstoque.find(p => p.id === id);
        if (novaQuantidade > produto.estoque) {
            Alert.alert('Estoque Insuficiente', `Só temos ${produto.estoque} unidades em estoque`);
            return;
        }

        setCarrinho(carrinho.map(item =>
            item.id === id ? { ...item, quantidade: novaQuantidade } : item
        ));
    };

    const abrirDetalhesProduto = (produto) => {
        setProdutoSelecionado(produto);
        setModalDetalhesVisible(true);
    };

    const finalizarRetirada = () => {
        if (carrinho.length === 0) {
            Alert.alert('Carrinho Vazio', 'Adicione produtos antes de finalizar');
            return;
        }

        Alert.alert(
            'CONFIRMAR RETIRADA',
            `Total de itens: ${totalItens}\nValor total: R$ ${totalVenda.toFixed(2)}`,
            [
                { text: 'CANCELAR', style: 'cancel' },
                {
                    text: 'CONFIRMAR',
                    onPress: () => {
                        const resumo = `
=== RETIRADA CONFIRMADA ===
Data: ${new Date().toLocaleString('pt-BR')}
Itens retirados: ${totalItens}
Valor total: R$ ${totalVenda.toFixed(2)}

${carrinho.map(item =>
                            `${item.nome} - ${item.quantidade}x R$ ${item.preco.toFixed(2)}`
                        ).join('\n')}
            `;

                        console.log('📦 RETIRADA:', resumo);

                        // Limpar carrinho após retirada
                        setCarrinho([]);
                        Alert.alert('✅ RETIRADA CONCLUÍDA!', `Valor: R$ ${totalVenda.toFixed(2)}`);
                    }
                }
            ]
        );
    };

    const limparCarrinho = () => {
        if (carrinho.length === 0) return;

        Alert.alert(
            'LIMPAR CARRINHO',
            'Deseja remover todos os itens?',
            [
                { text: 'MANTER', style: 'cancel' },
                {
                    text: 'LIMPAR',
                    style: 'destructive',
                    onPress: () => setCarrinho([])
                }
            ]
        );
    };

    // Renderizar item do carrinho
    const renderItemCarrinho = ({ item }) => (
        <TouchableOpacity
            style={styles.itemCarrinho}
            onPress={() => abrirDetalhesProduto(item)}
        >
            <View style={styles.itemInfo}>
                <Text style={styles.itemNome}>{item.nome}</Text>
                <Text style={styles.itemCodigo}>Cód: {item.codigo}</Text>
                <Text style={styles.itemEstoque}>Estoque: {item.estoque}</Text>
            </View>

            <View style={styles.controlesQuantidade}>
                <TouchableOpacity
                    style={styles.botaoQuantidade}
                    onPress={(e) => {
                        e.stopPropagation();
                        alterarQuantidade(item.id, item.quantidade - 1);
                    }}
                >
                    <Text style={styles.botaoQuantidadeTexto}>-</Text>
                </TouchableOpacity>

                <Text style={styles.quantidadeTexto}>{item.quantidade}</Text>

                <TouchableOpacity
                    style={styles.botaoQuantidade}
                    onPress={(e) => {
                        e.stopPropagation();
                        alterarQuantidade(item.id, item.quantidade + 1);
                    }}
                >
                    <Text style={styles.botaoQuantidadeTexto}>+</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.valoresContainer}>
                <Text style={styles.itemPrecoUnit}>R$ {item.preco.toFixed(2)}</Text>
                <Text style={styles.itemTotal}>R$ {(item.preco * item.quantidade).toFixed(2)}</Text>
            </View>
        </TouchableOpacity>
    );

    // Renderizar produto disponível
    const renderProdutoEstoque = ({ item }) => (
        <TouchableOpacity
            style={styles.produtoEstoqueCard}
            onPress={() => adicionarAoCarrinho(item)}
        >
            <View style={styles.produtoInfo}>
                <Text style={styles.produtoNome}>{item.nome}</Text>
                <Text style={styles.produtoCodigo}>Cód: {item.codigo}</Text>
                <Text style={styles.produtoCategoria}>{item.categoria}</Text>
            </View>

            <View style={styles.produtoValores}>
                <Text style={styles.produtoPreco}>R$ {item.preco.toFixed(2)}</Text>
                <Text style={styles.produtoEstoque}>Estoque: {item.estoque}</Text>
                <TouchableOpacity style={styles.botaoAdicionar}>
                    <Ionicons name="add-circle" size={24} color="#28a745" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    // Modal de detalhes do produto
    const renderModalDetalhes = () => {
        if (!produtoSelecionado) return null;

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalDetalhesVisible}
                onRequestClose={() => setModalDetalhesVisible(false)}
            >
                <View style={styles.modalDetalhesContainer}>
                    <View style={styles.modalDetalhesContent}>
                        {/* Header */}
                        <View style={styles.modalDetalhesHeader}>
                            <Text style={styles.modalDetalhesTitle}>Detalhes do Produto</Text>
                            <TouchableOpacity onPress={() => setModalDetalhesVisible(false)}>
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalDetalhesBody}>
                            {/* Informações do produto */}
                            <View style={styles.detalhesTopo}>
                                <View style={styles.produtoIcon}>
                                    <Ionicons name="cube-outline" size={width * 0.15} color="#4CAF50" />
                                </View>
                                <View style={styles.detalhesInfoBasica}>
                                    <Text style={styles.detalhesNome}>{produtoSelecionado.nome}</Text>
                                    <Text style={styles.detalhesCodigo}>Código: {produtoSelecionado.codigo}</Text>
                                    <Text style={styles.detalhesCategoria}>{produtoSelecionado.categoria}</Text>
                                </View>
                            </View>

                            {/* Detalhes */}
                            <View style={styles.detalhesSection}>
                                <View style={styles.detalhesLinha}>
                                    <Text style={styles.detalhesLabel}>Preço Unitário:</Text>
                                    <Text style={styles.detalhesValor}>R$ {produtoSelecionado.preco.toFixed(2)}</Text>
                                </View>

                                <View style={styles.detalhesLinha}>
                                    <Text style={styles.detalhesLabel}>Estoque Disponível:</Text>
                                    <Text style={styles.detalhesValor}>{produtoSelecionado.estoque} unidades</Text>
                                </View>

                                <View style={styles.detalhesLinha}>
                                    <Text style={styles.detalhesLabel}>Quantidade no Carrinho:</Text>
                                    <Text style={styles.detalhesValorDestaque}>
                                        {produtoSelecionado.quantidade || 0} unidades
                                    </Text>
                                </View>

                                <View style={styles.detalhesLinha}>
                                    <Text style={styles.detalhesLabel}>Valor Total:</Text>
                                    <Text style={styles.detalhesValorDestaque}>
                                        R$ {((produtoSelecionado.quantidade || 0) * produtoSelecionado.preco).toFixed(2)}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Botões de ação */}
                        <View style={styles.modalDetalhesFooter}>
                            <TouchableOpacity
                                style={[styles.botaoAcao, styles.botaoRemover]}
                                onPress={() => {
                                    removerDoCarrinho(produtoSelecionado.id);
                                    setModalDetalhesVisible(false);
                                }}
                            >
                                <Ionicons name="trash-outline" size={20} color="#fff" />
                                <Text style={styles.botaoAcaoText}>Remover</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.botaoAcao, styles.botaoFechar]}
                                onPress={() => setModalDetalhesVisible(false)}
                            >
                                <Text style={styles.botaoAcaoText}>Fechar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <TouchableOpacity
                onPress={() => navigation.navigate('Home')}
                style={styles.voltar}
            >
                <Ionicons
                    name="arrow-back"
                    size={width * 0.06}
                    color="black"
                />
                <Text style={styles.title}>
                    Caixa Mobile{"\n"}
                    <Text style={styles.bold}>Retirada de Produtos</Text>
                </Text>
            </TouchableOpacity>

            {/* Informações de Resumo */}
            <View style={styles.resumoContainer}>
                <View style={styles.resumoCard}>
                    <Text style={styles.resumoTitle}>RESUMO DA RETIRADA</Text>

                    <View style={styles.resumoLinhas}>
                        <View style={styles.resumoLinha}>
                            <Text style={styles.resumoLabel}>Itens no Carrinho:</Text>
                            <Text style={styles.resumoValor}>{totalItens}</Text>
                        </View>

                        <View style={styles.resumoLinha}>
                            <Text style={styles.resumoLabel}>Valor Total:</Text>
                            <Text style={styles.resumoValorDestaque}>R$ {totalVenda.toFixed(2)}</Text>
                        </View>

                        <View style={styles.resumoLinha}>
                            <Text style={styles.resumoLabel}>Valor Médio por Item:</Text>
                            <Text style={styles.resumoValor}>R$ {valorMedio}</Text>
                        </View>

                        <View style={styles.resumoLinha}>
                            <Text style={styles.resumoLabel}>Produtos Diferentes:</Text>
                            <Text style={styles.resumoValor}>{carrinho.length}</Text>
                        </View>
                    </View>

                    {/* Botões de Ação */}
                    <View style={styles.botoesAcao}>
                        <TouchableOpacity
                            style={[styles.botaoPrincipal, styles.botaoLimpar]}
                            onPress={limparCarrinho}
                            disabled={carrinho.length === 0}
                        >
                            <Ionicons name="trash-outline" size={20} color="#fff" />
                            <Text style={styles.botaoPrincipalTexto}>Limpar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.botaoPrincipal, styles.botaoFinalizar]}
                            onPress={finalizarRetirada}
                            disabled={carrinho.length === 0}
                        >
                            <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                            <Text style={styles.botaoPrincipalTexto}>Finalizar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Lista de Produtos no Carrinho */}
            <View style={styles.carrinhoContainer}>
                <Text style={styles.sectionTitle}>
                    PRODUTOS NO CARRINHO ({carrinho.length})
                </Text>

                {carrinho.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="cart-outline" size={width * 0.2} color="#ccc" />
                        <Text style={styles.emptyText}>Carrinho vazio</Text>
                        <Text style={styles.emptySubtext}>
                            Toque nos produtos abaixo para adicionar ao carrinho
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={carrinho}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItemCarrinho}
                        style={styles.listaCarrinho}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>

            {/* Lista de Produtos Disponíveis */}
            <View style={styles.estoqueContainer}>
                <Text style={styles.sectionTitle}>PRODUTOS DISPONÍVEIS</Text>
                <FlatList
                    data={produtosEstoque}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderProdutoEstoque}
                    style={styles.listaEstoque}
                    showsVerticalScrollIndicator={false}
                />
            </View>

            {/* Modal de Detalhes */}
            {renderModalDetalhes()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: width * 0.05,
        paddingTop: height * 0.045,
        backgroundColor: '#f8f9fa',
    },
    voltar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: height * 0.02,
    },
    title: {
        fontSize: width * 0.04,
        marginLeft: width * 0.03,
        color: '#000',
    },
    bold: {
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: width * 0.045,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: height * 0.015,
    },
    // Resumo
    resumoContainer: {
        marginBottom: height * 0.02,
    },
    resumoCard: {
        backgroundColor: '#fff',
        padding: width * 0.04,
        borderRadius: width * 0.03,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    resumoTitle: {
        fontSize: width * 0.04,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: height * 0.015,
        textAlign: 'center',
    },
    resumoLinhas: {
        marginBottom: height * 0.015,
    },
    resumoLinha: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: height * 0.008,
    },
    resumoLabel: {
        fontSize: width * 0.035,
        color: '#666',
    },
    resumoValor: {
        fontSize: width * 0.035,
        fontWeight: '600',
        color: '#333',
    },
    resumoValorDestaque: {
        fontSize: width * 0.04,
        fontWeight: 'bold',
        color: '#28a745',
    },
    botoesAcao: {
        flexDirection: 'row',
        gap: width * 0.03,
    },
    botaoPrincipal: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: width * 0.03,
        borderRadius: width * 0.02,
        gap: width * 0.02,
    },
    botaoLimpar: {
        backgroundColor: '#dc3545',
    },
    botaoFinalizar: {
        backgroundColor: '#28a745',
    },
    botaoPrincipalTexto: {
        color: '#fff',
        fontSize: width * 0.035,
        fontWeight: 'bold',
    },
    // Carrinho
    carrinhoContainer: {
        flex: 2,
        backgroundColor: '#fff',
        padding: width * 0.04,
        borderRadius: width * 0.03,
        marginBottom: height * 0.02,
        elevation: 2,
    },
    estoqueContainer: {
        flex: 3,
        backgroundColor: '#fff',
        padding: width * 0.04,
        borderRadius: width * 0.03,
        elevation: 2,
    },
    listaCarrinho: {
        flex: 1,
    },
    listaEstoque: {
        flex: 1,
    },
    itemCarrinho: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: width * 0.03,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
        backgroundColor: '#f8f9fa',
        borderRadius: width * 0.02,
        marginBottom: height * 0.008,
    },
    itemInfo: {
        flex: 1,
    },
    itemNome: {
        fontSize: width * 0.038,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: height * 0.002,
    },
    itemCodigo: {
        fontSize: width * 0.03,
        color: '#6c757d',
        marginBottom: height * 0.002,
    },
    itemEstoque: {
        fontSize: width * 0.028,
        color: '#28a745',
        fontStyle: 'italic',
    },
    controlesQuantidade: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: width * 0.02,
    },
    botaoQuantidade: {
        backgroundColor: '#e9ecef',
        width: width * 0.07,
        height: width * 0.07,
        borderRadius: width * 0.015,
        justifyContent: 'center',
        alignItems: 'center',
    },
    botaoQuantidadeTexto: {
        fontSize: width * 0.04,
        fontWeight: 'bold',
        color: '#495057',
    },
    quantidadeTexto: {
        fontSize: width * 0.035,
        fontWeight: 'bold',
        marginHorizontal: width * 0.02,
        minWidth: width * 0.05,
        textAlign: 'center',
    },
    valoresContainer: {
        alignItems: 'flex-end',
    },
    itemPrecoUnit: {
        fontSize: width * 0.03,
        color: '#666',
        marginBottom: height * 0.002,
    },
    itemTotal: {
        fontSize: width * 0.035,
        fontWeight: 'bold',
        color: '#28a745',
    },
    // Produtos em Estoque
    produtoEstoqueCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: width * 0.03,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
        backgroundColor: '#f8f9fa',
        borderRadius: width * 0.02,
        marginBottom: height * 0.008,
    },
    produtoInfo: {
        flex: 1,
    },
    produtoNome: {
        fontSize: width * 0.038,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: height * 0.002,
    },
    produtoCodigo: {
        fontSize: width * 0.03,
        color: '#6c757d',
        marginBottom: height * 0.002,
    },
    produtoCategoria: {
        fontSize: width * 0.028,
        color: '#666',
        fontStyle: 'italic',
    },
    produtoValores: {
        alignItems: 'flex-end',
    },
    produtoPreco: {
        fontSize: width * 0.035,
        fontWeight: 'bold',
        color: '#28a745',
        marginBottom: height * 0.002,
    },
    produtoEstoque: {
        fontSize: width * 0.03,
        color: '#666',
        marginBottom: height * 0.005,
    },
    botaoAdicionar: {
        padding: width * 0.005,
    },
    // Estados vazios
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: height * 0.05,
    },
    emptyText: {
        fontSize: width * 0.045,
        color: '#666',
        marginTop: height * 0.02,
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: width * 0.035,
        color: '#999',
        marginTop: height * 0.01,
        textAlign: 'center',
        lineHeight: height * 0.025,
    },
    // Modal de Detalhes
    modalDetalhesContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalDetalhesContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: width * 0.05,
        borderTopRightRadius: width * 0.05,
        maxHeight: height * 0.7,
    },
    modalDetalhesHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: width * 0.05,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalDetalhesTitle: {
        fontSize: width * 0.05,
        fontWeight: 'bold',
        color: '#333',
    },
    modalDetalhesBody: {
        padding: width * 0.05,
    },
    modalDetalhesFooter: {
        flexDirection: 'row',
        padding: width * 0.05,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        gap: width * 0.03,
    },
    detalhesTopo: {
        flexDirection: 'row',
        marginBottom: height * 0.03,
    },
    produtoIcon: {
        width: width * 0.2,
        height: width * 0.2,
        borderRadius: width * 0.02,
        backgroundColor: '#f0f9f0',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: width * 0.04,
    },
    detalhesInfoBasica: {
        flex: 1,
        justifyContent: 'center',
    },
    detalhesNome: {
        fontSize: width * 0.045,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: height * 0.005,
    },
    detalhesCodigo: {
        fontSize: width * 0.035,
        color: '#666',
        marginBottom: height * 0.003,
    },
    detalhesCategoria: {
        fontSize: width * 0.032,
        color: '#28a745',
        fontStyle: 'italic',
    },
    detalhesSection: {
        marginBottom: height * 0.02,
    },
    detalhesLinha: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: height * 0.015,
        paddingBottom: height * 0.01,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    detalhesLabel: {
        fontSize: width * 0.038,
        color: '#666',
        fontWeight: '500',
    },
    detalhesValor: {
        fontSize: width * 0.038,
        fontWeight: '600',
        color: '#333',
    },
    detalhesValorDestaque: {
        fontSize: width * 0.04,
        fontWeight: 'bold',
        color: '#28a745',
    },
    botaoAcao: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: height * 0.02,
        borderRadius: width * 0.02,
        gap: width * 0.02,
    },
    botaoRemover: {
        backgroundColor: '#FF6B6B',
    },
    botaoFechar: {
        backgroundColor: '#6c757d',
    },
    botaoAcaoText: {
        color: '#fff',
        fontSize: width * 0.04,
        fontWeight: 'bold',
    },
});
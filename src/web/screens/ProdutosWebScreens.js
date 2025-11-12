// src/web/screens/ProdutosWebScreen.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
    Alert
} from 'react-native';
import ModalCadastroProduto from '../components/ModalCadastroProduto';
import ModalDetalhesProduto from '../components/ModalDetalhesProduto';
import api from '../../services/api';

const ProdutosWebScreen = () => {
    const [modalCadastroVisible, setModalCadastroVisible] = useState(false);
    const [modalDetalhesVisible, setModalDetalhesVisible] = useState(false);
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [produtos, setProdutos] = useState([]);
    const [pesquisa, setPesquisa] = useState('');
    const [carregando, setCarregando] = useState(true);

    // No topo do componente, adicione:
    // No topo do componente, adicione:
    const [showDebug, setShowDebug] = useState(false);
    const [debugInfo, setDebugInfo] = useState('');

    // Atualize a função buscarProdutos:
    const buscarProdutos = async () => {
        try {
            setCarregando(true);
            const response = await api.get('/produto/');
            console.log('Produtos carregados:', response.data);

            // Debug visível
            let debugText = `Total de produtos: ${response.data.length}\n\n`;

            response.data.forEach((produto, index) => {
                debugText += `Produto ${index + 1}:\n`;
                debugText += `- Nome: ${produto.nome}\n`;
                debugText += `- Foto: ${produto.foto || 'Nenhuma'}\n`;
                debugText += `- Tipo: ${typeof produto.foto}\n`;
                debugText += `- URL começa com: ${produto.foto ? produto.foto.substring(0, 20) + '...' : 'N/A'}\n`;
                debugText += `---\n`;
            });

            setDebugInfo(debugText);
            console.log('Debug Info:', debugText);

            setProdutos(response.data || []);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            const errorText = `Erro: ${error.message}`;
            setDebugInfo(errorText);
            Alert.alert('Erro', 'Não foi possível carregar os produtos');
            setProdutos([]);
        } finally {
            setCarregando(false);
        }
    };



    // Buscar produtos da API - CORRIGIDO para usar o mesmo endpoint do mobile
    /*const buscarProdutos = async () => {
        try {
            setCarregando(true);
            const response = await api.get('/produto/'); // Mesmo endpoint do mobile
            console.log('Produtos carregados:', response.data);
            setProdutos(response.data || []);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            Alert.alert('Erro', 'Não foi possível carregar os produtos');
            setProdutos([]); // Garante que a lista fique vazia em caso de erro
        } finally {
            setCarregando(false);
        }
    };
*/
    useEffect(() => {
        buscarProdutos();
    }, []);

    // Filtrar produtos baseado na pesquisa - CORRIGIDO campos
    const produtosFiltrados = produtos.filter(produto =>
        produto.nome?.toLowerCase().includes(pesquisa.toLowerCase()) ||
        produto.codigoDeBarras?.includes(pesquisa)
    );

    // Função para salvar novo produto - CORRIGIDO campos
    const handleSalvarProduto = async (dadosProduto) => {
        try {
            // Mapear campos do modal para os campos do back-end
            const produtoParaSalvar = {
                nome: dadosProduto.nome,
                codigoDeBarras: dadosProduto.codigoBarras,
                descricao: dadosProduto.descricao,
                categoria: dadosProduto.categoria ? { nome: dadosProduto.categoria } : null,
                fornecedor: dadosProduto.fornecedor ? { nome: dadosProduto.fornecedor } : null,
                custoCompra: parseFloat(dadosProduto.custoCompra) || 0,
                precoUnitarioVenda: parseFloat(dadosProduto.precoVenda) || 0,
                estoqueAtual: parseInt(dadosProduto.quantidadeEstoque) || 0,
                estoqueMinimo: parseInt(dadosProduto.estoqueMinimo) || 0,
                // foto: dadosProduto.foto, // Se tiver upload de imagem
                unidadeMedida: dadosProduto.unidadeMedida || 'UN'
            };

            console.log('Enviando produto:', produtoParaSalvar);
            await api.post('/produto/', produtoParaSalvar);
            await buscarProdutos(); // Recarregar a lista
            Alert.alert('Sucesso', 'Produto cadastrado com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar produto:', error);
            Alert.alert('Erro', 'Não foi possível cadastrar o produto');
        }
    };

    // Função para excluir produto - CORRIGIDO endpoint
    const handleExcluirProduto = async (produtoId) => {
        Alert.alert(
            'Confirmar Exclusão',
            'Tem certeza que deseja excluir este produto?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.delete(`/produto/${produtoId}`);
                            await buscarProdutos(); // Recarregar a lista
                            Alert.alert('Sucesso', 'Produto excluído com sucesso!');
                        } catch (error) {
                            console.error('Erro ao excluir produto:', error);
                            Alert.alert('Erro', 'Não foi possível excluir o produto');
                        }
                    }
                }
            ]
        );
    };

    // Função para abrir modal de detalhes
    const handleAbrirDetalhes = (produto) => {
        setProdutoSelecionado(produto);
        setModalDetalhesVisible(true);
    };

    // Calcular estatísticas baseadas nos produtos reais
    const calcularEstatisticas = () => {
        const totalCompra = produtos.reduce((total, produto) =>
            total + (produto.custoCompra * produto.estoqueAtual), 0
        );

        const totalVenda = produtos.reduce((total, produto) =>
            total + (produto.precoUnitarioVenda * produto.estoqueAtual), 0
        );

        const lucroPrevisto = totalVenda - totalCompra;

        const estoqueBaixo = produtos.filter(produto =>
            produto.estoqueAtual <= produto.estoqueMinimo && produto.estoqueAtual > 0
        ).length;

        const semEstoque = produtos.filter(produto =>
            produto.estoqueAtual === 0
        ).length;

        const totalEstoque = produtos.reduce((total, produto) =>
            total + produto.estoqueAtual, 0
        );

        return {
            totalCompra: totalCompra.toFixed(2),
            totalVenda: totalVenda.toFixed(2),
            lucroPrevisto: lucroPrevisto.toFixed(2),
            estoqueBaixo,
            semEstoque,
            totalEstoque
        };
    };

    const estatisticas = calcularEstatisticas();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Produtos</Text>
                    <Text style={styles.subtitle}>{produtos.length} itens Cadastrados</Text>
                </View>
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>Nome de Usuario</Text>
                    <TouchableOpacity
                        style={styles.debugButton}
                        onPress={() => {
                            // Mostrar/ocultar debug
                            setShowDebug(!showDebug);
                        }}
                    >
                        <Text style={styles.debugText}>🔍 Debug Imagens</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Área de Debug (condicional) */}
            {showDebug && (
                <View style={styles.debugContainer}>
                    <Text style={styles.debugTitle}>Informações de Debug - Imagens</Text>
                    <ScrollView style={styles.debugContent}>
                        <Text style={styles.debugTextArea}>{debugInfo}</Text>
                    </ScrollView>
                    <TouchableOpacity
                        style={styles.debugCloseButton}
                        onPress={() => setShowDebug(false)}
                    >
                        <Text style={styles.debugCloseText}>Fechar Debug</Text>
                    </TouchableOpacity>
                </View>
            )}
            {/*
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Produtos</Text>
                    <Text style={styles.subtitle}>{produtos.length} itens Cadastrados</Text>
                </View>
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>Nome de Usuario</Text>
                </View>
            </View>
            */}
            {/* Barra de Pesquisa e Ações */}
            <View style={styles.barraAcoes}>
                <View style={styles.pesquisaContainer}>
                    <TextInput
                        style={styles.inputPesquisa}
                        placeholder="Q. Item ou código"
                        value={pesquisa}
                        onChangeText={setPesquisa}
                    />
                    <TouchableOpacity style={styles.botaoFiltro}>
                        <Text style={styles.textoBotaoFiltro}>Filtros</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.botaoNovoProduto}
                    onPress={() => setModalCadastroVisible(true)}
                >
                    <Text style={styles.textoBotaoNovoProduto}>+ Novo Produto</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {/* Cards de Estatísticas - AGORA COM DADOS REAIS */}
                <View style={styles.cardsContainer}>
                    <View style={styles.cardEstatistica}>
                        <Text style={styles.valorEstatistica}>R$ {estatisticas.totalCompra}</Text>
                        <Text style={styles.labelEstatistica}>Valor total de compra</Text>
                    </View>

                    <View style={styles.cardEstatistica}>
                        <Text style={styles.valorEstatistica}>R$ {estatisticas.totalVenda}</Text>
                        <Text style={styles.labelEstatistica}>Valor total de vendas</Text>
                    </View>

                    <View style={styles.cardEstatistica}>
                        <Text style={styles.valorEstatistica}>R$ {estatisticas.lucroPrevisto}</Text>
                        <Text style={styles.labelEstatistica}>Lucro previsto</Text>
                    </View>

                    <View style={styles.cardEstatistica}>
                        <Text style={styles.valorEstatistica}>{estatisticas.estoqueBaixo}</Text>
                        <Text style={styles.labelEstatistica}>Estoque baixo</Text>
                    </View>

                    <View style={styles.cardEstatistica}>
                        <Text style={styles.valorEstatistica}>{estatisticas.semEstoque}</Text>
                        <Text style={styles.labelEstatistica}>Sem estoque</Text>
                    </View>

                    <View style={styles.cardEstatistica}>
                        <Text style={[styles.valorEstatistica, styles.valorDestaque]}>{estatisticas.totalEstoque}</Text>
                        <Text style={styles.labelEstatistica}>Total em estoque</Text>
                    </View>
                </View>

                {/* Lista de Produtos - CORRIGIDO campos */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Produtos</Text>

                    {carregando ? (
                        <Text style={styles.carregando}>Carregando produtos...</Text>
                    ) : produtosFiltrados.length === 0 ? (
                        <Text style={styles.semProdutos}>
                            {pesquisa ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
                        </Text>
                    ) : (
                        <View style={styles.tabela}>
                            {/* Cabeçalho da Tabela */}
                            <View style={styles.linhaTabelaCabecalho}>
                                <Text style={styles.colunaCabecalho}>Produto</Text>
                                <Text style={styles.colunaCabecalho}>Categoria</Text>
                                <Text style={styles.colunaCabecalho}>Estoque</Text>
                                <Text style={styles.colunaCabecalho}>Preço</Text>
                                <Text style={styles.colunaCabecalho}>Unidade</Text>
                                <Text style={styles.colunaCabecalhoAcoes}>Ações</Text>
                            </View>

                            {/* Linhas da Tabela - CORRIGIDO campos */}
                            {produtosFiltrados.map((produto) => (
                                <TouchableOpacity
                                    key={produto.id}
                                    style={styles.linhaTabela}
                                    onPress={() => handleAbrirDetalhes(produto)}
                                >
                                    <View style={styles.colunaProduto}>
                                        {produto.foto ? (
                                            <Image
                                                source={{ uri: produto.foto }}
                                                style={styles.imagemProduto}
                                            />
                                        ) : (
                                            <View style={styles.imagemPlaceholder}>
                                                <Text style={styles.textoPlaceholder}>📦</Text>
                                            </View>
                                        )}
                                        <Text style={styles.nomeProduto} numberOfLines={1}>
                                            {produto.nome || 'Sem nome'}
                                        </Text>
                                    </View>

                                    <Text style={styles.colunaCategoria}>
                                        {produto.categoria?.nome || 'Sem categoria'}
                                    </Text>

                                    <View style={styles.colunaEstoque}>
                                        <Text style={[
                                            styles.textoEstoque,
                                            produto.estoqueAtual <= produto.estoqueMinimo && styles.estoqueBaixo
                                        ]}>
                                            {produto.estoqueAtual || 0}
                                        </Text>
                                    </View>

                                    <Text style={styles.colunaPreco}>
                                        R$ {produto.precoUnitarioVenda?.toFixed(2) || '0.00'}
                                    </Text>

                                    <Text style={styles.colunaUnidade}>
                                        {produto.unidadeMedida || 'UN'}
                                    </Text>

                                    <View style={styles.colunaAcoes}>
                                        <TouchableOpacity
                                            style={styles.botaoExcluir}
                                            onPress={(e) => {
                                                e.stopPropagation();
                                                handleExcluirProduto(produto.id);
                                            }}
                                        >
                                            <Text style={styles.textoBotaoExcluir}>🗑️</Text>
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Modal de Cadastro */}
            <ModalCadastroProduto
                visible={modalCadastroVisible}
                onClose={() => setModalCadastroVisible(false)}
                onSalvar={handleSalvarProduto}
            />

            {/* Modal de Detalhes */}
            <ModalDetalhesProduto
                visible={modalDetalhesVisible}
                produto={produtoSelecionado}
                onClose={() => setModalDetalhesVisible(false)}
                onSalvar={buscarProdutos}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    userInfo: {
        alignItems: 'flex-end',
    },
    userName: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    barraAcoes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    pesquisaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 16,
    },
    inputPesquisa: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginRight: 12,
        backgroundColor: '#f8f9fa',
    },
    botaoFiltro: {
        backgroundColor: '#6c757d',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    textoBotaoFiltro: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    botaoNovoProduto: {
        backgroundColor: '#28a745',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    textoBotaoNovoProduto: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    cardsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 24,
    },
    cardEstatistica: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        minWidth: 150,
        alignItems: 'center',
    },
    valorEstatistica: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    valorDestaque: {
        color: '#28a745',
        fontSize: 24,
    },
    labelEstatistica: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    tabela: {
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    linhaTabelaCabecalho: {
        flexDirection: 'row',
        backgroundColor: '#f8f9fa',
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    colunaCabecalho: {
        flex: 2,
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    colunaCabecalhoAcoes: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },
    linhaTabela: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f8f9fa',
    },
    colunaProduto: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    imagemProduto: {
        width: 40,
        height: 40,
        borderRadius: 6,
        marginRight: 12,
    },
    imagemPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 6,
        backgroundColor: '#e9ecef',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    textoPlaceholder: {
        fontSize: 16,
    },
    nomeProduto: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        flex: 1,
    },
    colunaCategoria: {
        flex: 2,
        fontSize: 14,
        color: '#666',
    },
    colunaEstoque: {
        flex: 1,
    },
    textoEstoque: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    estoqueBaixo: {
        color: '#dc3545',
    },
    colunaPreco: {
        flex: 1,
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    colunaUnidade: {
        flex: 1,
        fontSize: 14,
        color: '#666',
    },
    colunaAcoes: {
        flex: 1,
        alignItems: 'center',
    },
    botaoExcluir: {
        padding: 8,
        borderRadius: 6,
    },
    textoBotaoExcluir: {
        fontSize: 16,
    },
    carregando: {
        textAlign: 'center',
        padding: 20,
        color: '#666',
        fontSize: 16,
    },
    semProdutos: {
        textAlign: 'center',
        padding: 40,
        color: '#666',
        fontSize: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
    },
    debugButton: {
        backgroundColor: '#6c757d',
        padding: 8,
        borderRadius: 6,
        marginTop: 8,
    },
    debugText: {
        color: 'white',
        fontSize: 12,
    },
});

export default ProdutosWebScreen;
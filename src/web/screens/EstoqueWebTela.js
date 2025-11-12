// src/web/screens/EstoqueWebScreen.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    FlatList
} from 'react-native';
import ModalEntradaEstoque from '../components/ModalEntradaEstoque';
import ModalRetiradaEstoque from '../components/ModalRetiradaEstoque';
import ModalFiltroEstoque from '../components/ModalFiltroEstoque';
import api from '../../services/api';

const EstoqueWebScreen = () => {
    const [modalEntradaVisible, setModalEntradaVisible] = useState(false);
    const [modalRetiradaVisible, setModalRetiradaVisible] = useState(false);
    const [modalFiltroVisible, setModalFiltroVisible] = useState(false);
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [produtos, setProdutos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [fornecedores, setFornecedores] = useState([]);
    const [pesquisa, setPesquisa] = useState('');
    const [carregando, setCarregando] = useState(true);

    // Estados para filtros
    const [filtroNome, setFiltroNome] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('');
    const [filtroFornecedor, setFiltroFornecedor] = useState('');
    const [filtroQuantidadeBaixa, setFiltroQuantidadeBaixa] = useState(false);

    // Buscar produtos da API
    const buscarProdutos = async () => {
        try {
            setCarregando(true);
            const response = await api.get('/produto/');
            console.log('Produtos carregados:', response.data);
            setProdutos(response.data || []);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            Alert.alert('Erro', 'Não foi possível carregar os produtos');
            setProdutos([]);
        } finally {
            setCarregando(false);
        }
    };

    // Buscar categorias e fornecedores para os filtros
    const buscarDadosFiltro = async () => {
        try {
            const [responseCategorias, responseFornecedores] = await Promise.all([
                api.get('/categoria/'),
                api.get('/fornecedor/')
            ]);
            setCategorias(responseCategorias.data || []);
            setFornecedores(responseFornecedores.data || []);
        } catch (error) {
            console.error('Erro ao carregar dados do filtro:', error);
        }
    };

    useEffect(() => {
        buscarProdutos();
        buscarDadosFiltro();
    }, []);

    // Aplicar filtros
    const produtosFiltrados = produtos.filter(produto => {
        const nomeMatch = produto.nome?.toLowerCase().includes(pesquisa.toLowerCase()) ||
            produto.codigoDeBarras?.includes(pesquisa);

        const nomeFiltroMatch = !filtroNome || produto.nome?.toLowerCase().includes(filtroNome.toLowerCase());
        const categoriaMatch = !filtroCategoria || produto.categoria?.id?.toString() === filtroCategoria;
        const fornecedorMatch = !filtroFornecedor || produto.fornecedor?.id?.toString() === filtroFornecedor;
        const quantidadeBaixaMatch = !filtroQuantidadeBaixa || (produto.estoqueAtual || 0) <= 10;

        return nomeMatch && nomeFiltroMatch && categoriaMatch && fornecedorMatch && quantidadeBaixaMatch;
    });

    // Abrir modal de entrada
    const handleAbrirEntrada = (produto) => {
        setProdutoSelecionado(produto);
        setModalEntradaVisible(true);
    };

    // Abrir modal de retirada
    const handleAbrirRetirada = (produto) => {
        setProdutoSelecionado(produto);
        setModalRetiradaVisible(true);
    };

    // Fechar modais
    const handleFecharModais = () => {
        setModalEntradaVisible(false);
        setModalRetiradaVisible(false);
        setModalFiltroVisible(false);
        setProdutoSelecionado(null);
    };

    // Processar entrada de estoque
    const handleProcessarEntrada = async (quantidade, observacao) => {
        try {
            const qtd = parseInt(quantidade);
            const estoqueAtual = produtoSelecionado.estoqueAtual || 0;

            const dadosAtualizacao = {
                ...produtoSelecionado,
                estoqueAtual: estoqueAtual + qtd
            };

            await api.put('/produto/', dadosAtualizacao);

            Alert.alert('Sucesso', `Entrada de ${qtd} unidades realizada com sucesso!`);
            handleFecharModais();
            buscarProdutos();
        } catch (error) {
            console.error('Erro ao processar entrada:', error);
            Alert.alert('Erro', 'Não foi possível processar a entrada');
        }
    };

    // Processar retirada de estoque
    const handleProcessarRetirada = async (quantidade, observacao) => {
        try {
            const qtd = parseInt(quantidade);
            const estoqueAtual = produtoSelecionado.estoqueAtual || 0;

            if (qtd > estoqueAtual) {
                Alert.alert('Erro', `Quantidade indisponível. Estoque atual: ${estoqueAtual}`);
                return;
            }

            const dadosAtualizacao = {
                ...produtoSelecionado,
                estoqueAtual: estoqueAtual - qtd
            };

            await api.put('/produto/', dadosAtualizacao);

            Alert.alert('Sucesso', `Retirada de ${qtd} unidades realizada com sucesso!`);
            handleFecharModais();
            buscarProdutos();
        } catch (error) {
            console.error('Erro ao processar retirada:', error);
            Alert.alert('Erro', 'Não foi possível processar a retirada');
        }
    };

    // Limpar filtros
    const handleLimparFiltros = () => {
        setFiltroNome('');
        setFiltroCategoria('');
        setFiltroFornecedor('');
        setFiltroQuantidadeBaixa(false);
        setModalFiltroVisible(false);
    };

    // Aplicar filtros
    const handleAplicarFiltros = () => {
        setModalFiltroVisible(false);
    };

    // Calcular estatísticas
    const calcularEstatisticas = () => {
        const totalProdutos = produtos.length;
        const totalEstoque = produtos.reduce((total, produto) => total + (produto.estoqueAtual || 0), 0);

        const produtosEstoqueBaixo = produtos.filter(produto =>
            (produto.estoqueAtual || 0) <= 10
        ).length;

        const produtosSemEstoque = produtos.filter(produto =>
            (produto.estoqueAtual || 0) === 0
        ).length;

        const valorTotalEstoque = produtos.reduce((total, produto) =>
            total + ((produto.estoqueAtual || 0) * (produto.precoUnitarioVenda || 0)), 0
        );

        const produtoMaisEstoque = produtos.reduce((max, produto) =>
            (produto.estoqueAtual || 0) > (max.estoqueAtual || 0) ? produto : max,
            { nome: 'Nenhum', estoqueAtual: 0 }
        );

        return {
            totalProdutos,
            totalEstoque,
            produtosEstoqueBaixo,
            produtosSemEstoque,
            valorTotalEstoque: valorTotalEstoque.toFixed(2),
            produtoMaisEstoque: produtoMaisEstoque.nome,
            estoqueProdutoMais: produtoMaisEstoque.estoqueAtual
        };
    };

    const estatisticas = calcularEstatisticas();

    // Renderizar item do produto
    const renderProdutoItem = ({ item }) => {
        const estoqueBaixo = (item.estoqueAtual || 0) <= 10;
        const semEstoque = (item.estoqueAtual || 0) === 0;

        return (
            <View style={styles.linhaTabela}>
                <View style={styles.colunaProduto}>
                    <View style={styles.iconeProduto}>
                        <Text style={styles.textoIcone}>📦</Text>
                    </View>
                    <View style={styles.infoProduto}>
                        <Text style={styles.nomeProduto}>
                            {item.nome || 'Sem nome'}
                        </Text>
                        <Text style={styles.codigoProduto}>
                            Código: {item.codigoDeBarras || 'N/A'}
                        </Text>
                        {item.categoria && (
                            <Text style={styles.categoriaProduto}>
                                {item.categoria.nome}
                            </Text>
                        )}
                    </View>
                </View>

                <View style={styles.colunaEstoque}>
                    <Text style={[
                        styles.textoEstoque,
                        semEstoque && styles.estoqueZero,
                        estoqueBaixo && !semEstoque && styles.estoqueBaixo
                    ]}>
                        {item.estoqueAtual || 0}
                    </Text>
                </View>

                <Text style={styles.colunaPreco}>
                    R$ {item.precoUnitarioVenda?.toFixed(2) || '0.00'}
                </Text>

                <Text style={styles.colunaCategoria}>
                    {item.categoria?.nome || 'Sem categoria'}
                </Text>

                <View style={styles.colunaAcoes}>
                    <TouchableOpacity
                        style={[styles.botaoAcao, styles.botaoEntrada]}
                        onPress={() => handleAbrirEntrada(item)}
                    >
                        <Text style={styles.textoBotaoAcao}>+</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.botaoAcao, styles.botaoRetirada]}
                        onPress={() => handleAbrirRetirada(item)}
                    >
                        <Text style={styles.textoBotaoAcao}>-</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>📊 Estoque</Text>
                    <Text style={styles.subtitle}>Gestão de inventário</Text>
                </View>
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>Nome de Usuario</Text>
                </View>
            </View>

            {/* Barra de Pesquisa e Ações */}
            <View style={styles.barraAcoes}>
                <View style={styles.pesquisaContainer}>
                    <TextInput
                        style={styles.inputPesquisa}
                        placeholder="Pesquisar produtos..."
                        value={pesquisa}
                        onChangeText={setPesquisa}
                    />
                    <TouchableOpacity
                        style={styles.botaoFiltro}
                        onPress={() => setModalFiltroVisible(true)}
                    >
                        <Text style={styles.textoBotaoFiltro}>Filtros</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.botaoRelatorio}>
                    <Text style={styles.textoBotaoRelatorio}>📋 Relatório</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {/* Cards de Estatísticas */}
                <View style={styles.cardsContainer}>
                    <View style={styles.cardEstatistica}>
                        <Text style={styles.valorEstatistica}>{estatisticas.totalProdutos}</Text>
                        <Text style={styles.labelEstatistica}>Total de Produtos</Text>
                    </View>

                    <View style={styles.cardEstatistica}>
                        <Text style={styles.valorEstatistica}>{estatisticas.totalEstoque}</Text>
                        <Text style={styles.labelEstatistica}>Total em Estoque</Text>
                    </View>

                    <View style={styles.cardEstatistica}>
                        <Text style={styles.valorEstatistica}>{estatisticas.produtosEstoqueBaixo}</Text>
                        <Text style={styles.labelEstatistica}>Estoque Baixo</Text>
                    </View>

                    <View style={styles.cardEstatistica}>
                        <Text style={styles.valorEstatistica}>{estatisticas.produtosSemEstoque}</Text>
                        <Text style={styles.labelEstatistica}>Sem Estoque</Text>
                    </View>

                    <View style={styles.cardEstatistica}>
                        <Text style={styles.valorEstatistica}>R$ {estatisticas.valorTotalEstoque}</Text>
                        <Text style={styles.labelEstatistica}>Valor Total</Text>
                    </View>

                    <View style={styles.cardEstatistica}>
                        <Text style={[styles.valorEstatistica, styles.valorDestaque]}>
                            {estatisticas.produtoMaisEstoque}
                        </Text>
                        <Text style={styles.labelEstatistica}>Produto com Mais Estoque</Text>
                        <Text style={styles.subLabelEstatistica}>
                            ({estatisticas.estoqueProdutoMais} unidades)
                        </Text>
                    </View>
                </View>

                {/* Lista de Produtos */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Produtos em Estoque</Text>

                    {carregando ? (
                        <Text style={styles.carregando}>Carregando produtos...</Text>
                    ) : produtosFiltrados.length === 0 ? (
                        <Text style={styles.semProdutos}>
                            {pesquisa ? 'Nenhum produto encontrado' : 'Nenhum produto em estoque'}
                        </Text>
                    ) : (
                        <View style={styles.tabela}>
                            {/* Cabeçalho da Tabela */}
                            <View style={styles.linhaTabelaCabecalho}>
                                <Text style={styles.colunaCabecalho}>Produto</Text>
                                <Text style={styles.colunaCabecalho}>Estoque</Text>
                                <Text style={styles.colunaCabecalho}>Preço</Text>
                                <Text style={styles.colunaCabecalho}>Categoria</Text>
                                <Text style={styles.colunaCabecalhoAcoes}>Movimentação</Text>
                            </View>

                            {/* Linhas da Tabela */}
                            <FlatList
                                data={produtosFiltrados}
                                keyExtractor={(item) => item.id?.toString()}
                                renderItem={renderProdutoItem}
                                scrollEnabled={false}
                            />
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Modais */}
            <ModalEntradaEstoque
                visible={modalEntradaVisible}
                produto={produtoSelecionado}
                onClose={handleFecharModais}
                onSalvar={handleProcessarEntrada}
            />

            <ModalRetiradaEstoque
                visible={modalRetiradaVisible}
                produto={produtoSelecionado}
                onClose={handleFecharModais}
                onSalvar={handleProcessarRetirada}
            />

            <ModalFiltroEstoque
                visible={modalFiltroVisible}
                categorias={categorias}
                fornecedores={fornecedores}
                filtros={{
                    nome: filtroNome,
                    categoria: filtroCategoria,
                    fornecedor: filtroFornecedor,
                    quantidadeBaixa: filtroQuantidadeBaixa
                }}
                onFiltroChange={{
                    setNome: setFiltroNome,
                    setCategoria: setFiltroCategoria,
                    setFornecedor: setFiltroFornecedor,
                    setQuantidadeBaixa: setFiltroQuantidadeBaixa
                }}
                onClose={handleFecharModais}
                onLimpar={handleLimparFiltros}
                onAplicar={handleAplicarFiltros}
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
    botaoRelatorio: {
        backgroundColor: '#17a2b8',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    textoBotaoRelatorio: {
        color: 'white',
        fontSize: 14,
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
        minWidth: 180,
        alignItems: 'center',
    },
    valorEstatistica: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    valorDestaque: {
        color: '#28a745',
        fontSize: 20,
    },
    labelEstatistica: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 4,
    },
    subLabelEstatistica: {
        fontSize: 12,
        color: '#999',
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
    iconeProduto: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#e3f2fd',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    textoIcone: {
        fontSize: 18,
    },
    infoProduto: {
        flex: 1,
    },
    nomeProduto: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    codigoProduto: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    categoriaProduto: {
        fontSize: 12,
        color: '#999',
    },
    colunaEstoque: {
        flex: 1,
        alignItems: 'center',
    },
    textoEstoque: {
        fontSize: 16,
        fontWeight: '600',
        color: '#28a745',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
    },
    estoqueBaixo: {
        color: '#ffc107',
        backgroundColor: '#fff3cd',
    },
    estoqueZero: {
        color: '#dc3545',
        backgroundColor: '#f8d7da',
    },
    colunaPreco: {
        flex: 1,
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    colunaCategoria: {
        flex: 1,
        fontSize: 14,
        color: '#666',
    },
    colunaAcoes: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    botaoAcao: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    botaoEntrada: {
        backgroundColor: '#28a745',
    },
    botaoRetirada: {
        backgroundColor: '#dc3545',
    },
    textoBotaoAcao: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
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
});

export default EstoqueWebScreen;
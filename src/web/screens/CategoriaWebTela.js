// src/web/screens/CategoriaWebTela.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
    Alert,
    FlatList
} from 'react-native';
import ModalCadastroCategoria from '../components/ModalCadastroCategoria';
import ModalDetalhesCategoria from '../components/ModalDetalhesCategoria';
import api from '../../services/api';

const CategoriasWebScreen = () => {
    const [modalCadastroVisible, setModalCadastroVisible] = useState(false);
    const [modalDetalhesVisible, setModalDetalhesVisible] = useState(false);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [pesquisa, setPesquisa] = useState('');
    const [carregando, setCarregando] = useState(true);

    // Buscar categorias da API
    const buscarCategorias = async () => {
        try {
            setCarregando(true);
            const response = await api.get('/categoria/');
            console.log('Categorias carregadas:', response.data);
            setCategorias(response.data || []);
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
            Alert.alert('Erro', 'Não foi possível carregar as categorias');
            setCategorias([]);
        } finally {
            setCarregando(false);
        }
    };

    // Buscar produtos para estatísticas
    const buscarProdutos = async () => {
        try {
            const response = await api.get('/produto/');
            setProdutos(response.data || []);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
        }
    };

    useEffect(() => {
        buscarCategorias();
        buscarProdutos();
    }, []);

    // Filtrar categorias baseado na pesquisa
    const categoriasFiltradas = categorias.filter(categoria =>
        categoria.nome?.toLowerCase().includes(pesquisa.toLowerCase())
    );

    // Função para salvar nova categoria
    const handleSalvarCategoria = async (dadosCategoria) => {
        try {
            const categoriaParaSalvar = {
                nome: dadosCategoria.nome,
                descricao: dadosCategoria.descricao
            };

            console.log('Salvando categoria:', categoriaParaSalvar);
            await api.post('/categoria/', categoriaParaSalvar);
            await buscarCategorias();
            Alert.alert('Sucesso', 'Categoria cadastrada com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar categoria:', error);
            Alert.alert('Erro', 'Não foi possível cadastrar a categoria');
        }
    };

    // Função para excluir categoria
    const handleExcluirCategoria = async (categoriaId) => {
        Alert.alert(
            'Confirmar Exclusão',
            'Tem certeza que deseja excluir esta categoria?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.delete(`/categoria/${categoriaId}`);
                            await buscarCategorias();
                            Alert.alert('Sucesso', 'Categoria excluída com sucesso!');
                        } catch (error) {
                            console.error('Erro ao excluir categoria:', error);
                            Alert.alert('Erro', 'Não foi possível excluir a categoria');
                        }
                    }
                }
            ]
        );
    };

    // Função para abrir modal de detalhes
    const handleAbrirDetalhes = async (categoria) => {
        setCategoriaSelecionada(categoria);
        setModalDetalhesVisible(true);
    };

    // Calcular estatísticas
    const calcularEstatisticas = () => {
        const totalCategorias = categorias.length;

        const categoriasComProdutos = categorias.filter(categoria => {
            return produtos.some(produto => produto.categoria?.id === categoria.id);
        }).length;

        const categoriasVazias = totalCategorias - categoriasComProdutos;

        const produtoPorCategoria = categorias.map(categoria => {
            const produtosNaCategoria = produtos.filter(produto =>
                produto.categoria?.id === categoria.id
            ).length;
            return produtosNaCategoria;
        });

        const mediaProdutosPorCategoria = totalCategorias > 0
            ? (produtos.length / totalCategorias).toFixed(1)
            : 0;

        const categoriaComMaisProdutos = categorias.reduce((max, categoria) => {
            const count = produtos.filter(produto =>
                produto.categoria?.id === categoria.id
            ).length;
            return count > max.count ? { nome: categoria.nome, count } : max;
        }, { nome: 'Nenhuma', count: 0 });

        return {
            totalCategorias,
            categoriasComProdutos,
            categoriasVazias,
            mediaProdutosPorCategoria,
            categoriaComMaisProdutos: categoriaComMaisProdutos.nome,
            totalProdutosCategoriaMais: categoriaComMaisProdutos.count
        };
    };

    const estatisticas = calcularEstatisticas();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>📁 Categorias</Text>
                    <Text style={styles.subtitle}>{categorias.length} Categorias Cadastradas</Text>
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
                        placeholder="Pesquisar categorias..."
                        value={pesquisa}
                        onChangeText={setPesquisa}
                    />
                    <TouchableOpacity style={styles.botaoFiltro}>
                        <Text style={styles.textoBotaoFiltro}>Filtros</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.botaoNovaCategoria}
                    onPress={() => setModalCadastroVisible(true)}
                >
                    <Text style={styles.textoBotaoNovaCategoria}>+ Nova Categoria</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {/* Cards de Estatísticas */}
                <View style={styles.cardsContainer}>
                    <View style={styles.cardEstatistica}>
                        <Text style={styles.valorEstatistica}>{estatisticas.totalCategorias}</Text>
                        <Text style={styles.labelEstatistica}>Total de Categorias</Text>
                    </View>

                    <View style={styles.cardEstatistica}>
                        <Text style={styles.valorEstatistica}>{estatisticas.categoriasComProdutos}</Text>
                        <Text style={styles.labelEstatistica}>Categorias com Produtos</Text>
                    </View>

                    <View style={styles.cardEstatistica}>
                        <Text style={styles.valorEstatistica}>{estatisticas.categoriasVazias}</Text>
                        <Text style={styles.labelEstatistica}>Categorias Vazias</Text>
                    </View>

                    <View style={styles.cardEstatistica}>
                        <Text style={styles.valorEstatistica}>{estatisticas.mediaProdutosPorCategoria}</Text>
                        <Text style={styles.labelEstatistica}>Média por Categoria</Text>
                    </View>

                    <View style={styles.cardEstatistica}>
                        <Text style={[styles.valorEstatistica, styles.valorDestaque]}>
                            {estatisticas.categoriaComMaisProdutos}
                        </Text>
                        <Text style={styles.labelEstatistica}>Categoria com Mais Produtos</Text>
                        <Text style={styles.subLabelEstatistica}>
                            ({estatisticas.totalProdutosCategoriaMais} produtos)
                        </Text>
                    </View>
                </View>

                {/* Lista de Categorias */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Categorias</Text>

                    {carregando ? (
                        <Text style={styles.carregando}>Carregando categorias...</Text>
                    ) : categoriasFiltradas.length === 0 ? (
                        <Text style={styles.semCategorias}>
                            {pesquisa ? 'Nenhuma categoria encontrada' : 'Nenhuma categoria cadastrada'}
                        </Text>
                    ) : (
                        <View style={styles.tabela}>
                            {/* Cabeçalho da Tabela */}
                            <View style={styles.linhaTabelaCabecalho}>
                                <Text style={styles.colunaCabecalho}>Categoria</Text>
                                <Text style={styles.colunaCabecalho}>Quantidade de Produtos</Text>
                                <Text style={styles.colunaCabecalho}>Status</Text>
                                <Text style={styles.colunaCabecalhoAcoes}>Ações</Text>
                            </View>

                            {/* Linhas da Tabela */}
                            {categoriasFiltradas.map((categoria) => {
                                const produtosNaCategoria = produtos.filter(produto =>
                                    produto.categoria?.id === categoria.id
                                ).length;

                                const status = produtosNaCategoria === 0 ? 'Vazia' :
                                    produtosNaCategoria <= 5 ? 'Poucos Produtos' : 'Ativa';

                                return (
                                    <TouchableOpacity
                                        key={categoria.id}
                                        style={styles.linhaTabela}
                                        onPress={() => handleAbrirDetalhes(categoria)}
                                    >
                                        <View style={styles.colunaCategoria}>
                                            <View style={styles.iconeCategoria}>
                                                <Text style={styles.textoIcone}>📁</Text>
                                            </View>
                                            <View style={styles.infoCategoria}>
                                                <Text style={styles.nomeCategoria}>
                                                    {categoria.nome || 'Sem nome'}
                                                </Text>
                                                <Text style={styles.descricaoCategoria}>
                                                    {categoria.descricao || 'Sem descrição'}
                                                </Text>
                                            </View>
                                        </View>

                                        <Text style={styles.colunaQuantidade}>
                                            {produtosNaCategoria} produtos
                                        </Text>

                                        <View style={styles.colunaStatus}>
                                            <Text style={[
                                                styles.textoStatus,
                                                status === 'Vazia' && styles.statusVazia,
                                                status === 'Poucos Produtos' && styles.statusPoucos,
                                                status === 'Ativa' && styles.statusAtiva
                                            ]}>
                                                {status}
                                            </Text>
                                        </View>

                                        <View style={styles.colunaAcoes}>
                                            <TouchableOpacity
                                                style={styles.botaoExcluir}
                                                onPress={(e) => {
                                                    e.stopPropagation();
                                                    handleExcluirCategoria(categoria.id);
                                                }}
                                            >
                                                <Text style={styles.textoBotaoExcluir}>🗑️</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Modal de Cadastro */}
            <ModalCadastroCategoria
                visible={modalCadastroVisible}
                onClose={() => setModalCadastroVisible(false)}
                onSalvar={handleSalvarCategoria}
            />

            {/* Modal de Detalhes */}
            <ModalDetalhesCategoria
                visible={modalDetalhesVisible}
                categoria={categoriaSelecionada}
                produtos={produtos}
                onClose={() => setModalDetalhesVisible(false)}
                onSalvar={buscarCategorias}
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
    botaoNovaCategoria: {
        backgroundColor: '#28a745',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    textoBotaoNovaCategoria: {
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
    colunaCategoria: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconeCategoria: {
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
    infoCategoria: {
        flex: 1,
    },
    nomeCategoria: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    descricaoCategoria: {
        fontSize: 14,
        color: '#666',
    },
    colunaQuantidade: {
        flex: 2,
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    colunaStatus: {
        flex: 1,
    },
    textoStatus: {
        fontSize: 12,
        fontWeight: '600',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
        textAlign: 'center',
        overflow: 'hidden',
    },
    statusVazia: {
        backgroundColor: '#fff3cd',
        color: '#856404',
    },
    statusPoucos: {
        backgroundColor: '#d1ecf1',
        color: '#0c5460',
    },
    statusAtiva: {
        backgroundColor: '#d4edda',
        color: '#155724',
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
    semCategorias: {
        textAlign: 'center',
        padding: 40,
        color: '#666',
        fontSize: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
    },
});

export default CategoriasWebScreen;
// src/web/screens/FornecedorWebScreen.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    RefreshControl
} from 'react-native';
import ModalCadastroFornecedor from '../components/ModalCadastroFornecedor';
import ModalDetalhesFornecedor from '../components/ModalDetalhesFornecedor';
import api from '../../services/api';

const FornecedorWebScreen = () => {
    const [modalCadastroVisible, setModalCadastroVisible] = useState(false);
    const [modalDetalhesVisible, setModalDetalhesVisible] = useState(false);
    const [fornecedorSelecionado, setFornecedorSelecionado] = useState(null);
    const [fornecedores, setFornecedores] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [pesquisa, setPesquisa] = useState('');
    const [carregando, setCarregando] = useState(true);
    const [atualizando, setAtualizando] = useState(false);

    // Buscar fornecedores da API - CORRIGIDO
    const buscarFornecedores = async () => {
        try {
            setCarregando(true);
            console.log('Buscando fornecedores...');
            const response = await api.get('/fornecedor/');
            console.log('Resposta da API:', response.data);

            if (response.data && Array.isArray(response.data)) {
                setFornecedores(response.data);
                console.log(`${response.data.length} fornecedores carregados`);
            } else {
                console.log('Resposta inesperada:', response.data);
                setFornecedores([]);
            }
        } catch (error) {
            console.error('Erro detalhado ao buscar fornecedores:', error);
            console.error('Mensagem de erro:', error.message);
            console.error('Resposta de erro:', error.response?.data);
            Alert.alert('Erro', 'Não foi possível carregar os fornecedores');
            setFornecedores([]);
        } finally {
            setCarregando(false);
            setAtualizando(false);
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
        buscarFornecedores();
        buscarProdutos();
    }, []);

    // Pull to refresh
    const handleRefresh = () => {
        setAtualizando(true);
        buscarFornecedores();
    };

    // Filtrar fornecedores baseado na pesquisa
    const fornecedoresFiltrados = fornecedores.filter(fornecedor =>
        (fornecedor.nome || '').toLowerCase().includes(pesquisa.toLowerCase()) ||
        (fornecedor.telefone || '').includes(pesquisa) ||
        (fornecedor.email || '').toLowerCase().includes(pesquisa.toLowerCase()) ||
        (fornecedor.cpf_cnpj || '').includes(pesquisa)
    );

    // Função para salvar novo fornecedor - CORRIGIDO para campos obrigatórios
    const handleSalvarFornecedor = async (dadosFornecedor) => {
        try {
            console.log('Salvando fornecedor:', dadosFornecedor);

            // Validações para campos obrigatórios
            if (!dadosFornecedor.nome?.trim()) {
                Alert.alert('Erro', 'Nome é obrigatório');
                return;
            }
            if (!dadosFornecedor.cpfCnpj?.trim()) {
                Alert.alert('Erro', 'CPF/CNPJ é obrigatório');
                return;
            }
            if (!dadosFornecedor.telefone?.trim()) {
                Alert.alert('Erro', 'Telefone é obrigatório');
                return;
            }
            if (!dadosFornecedor.email?.trim()) {
                Alert.alert('Erro', 'Email é obrigatório');
                return;
            }

            // Preparar dados para a API (campos obrigatórios conforme backend)
            const dadosParaAPI = {
                nome: dadosFornecedor.nome.trim(),
                cpf_cnpj: dadosFornecedor.cpfCnpj.replace(/\D/g, ''), // Remove formatação
                telefone: dadosFornecedor.telefone.replace(/\D/g, ''), // Remove formatação
                email: dadosFornecedor.email.trim(),
                observacao: dadosFornecedor.observacao?.trim() || "" // Campo opcional
            };

            console.log('Dados enviados para API:', dadosParaAPI);

            let response;
            if (fornecedorSelecionado) {
                // Edição - inclui o ID
                response = await api.put('/fornecedor/', {
                    ...dadosParaAPI,
                    id: fornecedorSelecionado.id
                });
            } else {
                // Novo cadastro
                response = await api.post('/fornecedor/', dadosParaAPI);
            }

            console.log('Resposta do servidor:', response.data);
            await buscarFornecedores();
            Alert.alert('Sucesso', fornecedorSelecionado ? 'Fornecedor atualizado com sucesso!' : 'Fornecedor cadastrado com sucesso!');
            setModalCadastroVisible(false);
        } catch (error) {
            console.error('Erro detalhado ao salvar fornecedor:', error);
            let errorMessage = 'Não foi possível salvar o fornecedor';

            if (error.response?.status === 409) {
                errorMessage = 'CPF/CNPJ já cadastrado';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data) {
                // Tenta extrair mensagem de erro do Spring
                errorMessage = JSON.stringify(error.response.data);
            }

            Alert.alert('Erro', errorMessage);
        }
    };

    // Função para excluir fornecedor - CORRIGIDO para tipo Integer
    const handleExcluirFornecedor = async (fornecedorId, fornecedorNome) => {
        Alert.alert(
            'Confirmar Exclusão',
            `Tem certeza que deseja excluir o fornecedor "${fornecedorNome}" ?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            console.log('Excluindo fornecedor ID:', fornecedorId);
                            await api.delete(`/fornecedor/${fornecedorId}`);
                            await buscarFornecedores();
                            Alert.alert('Sucesso', 'Fornecedor excluído com sucesso!');
                        } catch (error) {
                            console.error('Erro ao excluir fornecedor:', error);
                            Alert.alert('Erro', 'Não foi possível excluir o fornecedor');
                        }
                    }
                }
            ]
        );
    };

    // Função para abrir modal de detalhes
    const handleAbrirDetalhes = (fornecedor) => {
        console.log('Abrindo detalhes do fornecedor:', fornecedor);
        setFornecedorSelecionado(fornecedor);
        setModalDetalhesVisible(true);
    };

    // Função para editar fornecedor
    const handleEditarFornecedor = (fornecedor) => {
        setFornecedorSelecionado(fornecedor);
        setModalDetalhesVisible(false);
        setModalCadastroVisible(true);
    };

    // Formatar telefone
    const formatarTelefone = (telefone) => {
        if (!telefone) return 'Não informado';

        const cleaned = telefone.replace(/\D/g, '');

        if (cleaned.length === 11) {
            return (`${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`);
        } else if (cleaned.length === 10) {
            return (`${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`);
        }

        return telefone;
    };

    // Formatar CPF/CNPJ
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

    // Calcular estatísticas
    const calcularEstatisticas = () => {
        const totalFornecedores = fornecedores.length;

        const fornecedoresComProdutos = fornecedores.filter(fornecedor => {
            return produtos.some(produto => produto.fornecedor?.id === fornecedor.id);
        }).length;

        const fornecedoresSemProdutos = totalFornecedores - fornecedoresComProdutos;

        const fornecedoresComContato = fornecedores.filter(fornecedor =>
            fornecedor.telefone || fornecedor.email
        ).length;

        const fornecedorComMaisProdutos = fornecedores.reduce((max, fornecedor) => {
            const count = produtos.filter(produto =>
                produto.fornecedor?.id === fornecedor.id
            ).length;
            return count > max.count ? { nome: fornecedor.nome, count } : max;
        }, { nome: 'Nenhum', count: 0 });

        return {
            totalFornecedores,
            fornecedoresComProdutos,
            fornecedoresSemProdutos,
            fornecedoresComContato,
            fornecedorComMaisProdutos: fornecedorComMaisProdutos.nome,
            totalProdutosFornecedorMais: fornecedorComMaisProdutos.count
        };
    };

    const estatisticas = calcularEstatisticas();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>🏭 Fornecedores</Text>
                    <Text style={styles.subtitle}>{fornecedores.length} Fornecedores Cadastrados</Text>
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
                        placeholder="Pesquisar fornecedores por nome, telefone, email ou documento..."
                        value={pesquisa}
                        onChangeText={setPesquisa}
                    />
                    <TouchableOpacity style={styles.botaoFiltro}>
                        <Text style={styles.textoBotaoFiltro}>Filtros</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.botaoNovoFornecedor}
                    onPress={() => {
                        setFornecedorSelecionado(null);
                        setModalCadastroVisible(true);
                    }}
                >
                    <Text style={styles.textoBotaoNovoFornecedor}>+ Novo Fornecedor</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={atualizando}
                        onRefresh={handleRefresh}
                        colors={['#28a745']}
                    />
                }
            >
                {/*
                {/* Debug Info
                {__DEV__ && (
                    <View style={styles.debugInfo}>
                        <Text style={styles.debugText}>
                            Fornecedores carregados: {fornecedores.length} |
                            Carregando: {carregando.toString()} |
                            Atualizando: {atualizando.toString()}
                        </Text>
                    </View>
                )}
                */}

                {/* Cards de Estatísticas */}
                <View style={styles.cardsContainer}>
                    <View style={styles.cardEstatistica}>
                        <Text style={styles.valorEstatistica}>{estatisticas.totalFornecedores}</Text>
                        <Text style={styles.labelEstatistica}>Total de Fornecedores</Text>
                    </View>

                    <View style={styles.cardEstatistica}>
                        <Text style={styles.valorEstatistica}>{estatisticas.fornecedoresComProdutos}</Text>
                        <Text style={styles.labelEstatistica}>Com Produtos</Text>
                    </View>

                    <View style={styles.cardEstatistica}>
                        <Text style={styles.valorEstatistica}>{estatisticas.fornecedoresSemProdutos}</Text>
                        <Text style={styles.labelEstatistica}>Sem Produtos</Text>
                    </View>

                    <View style={styles.cardEstatistica}>
                        <Text style={styles.valorEstatistica}>{estatisticas.fornecedoresComContato}</Text>
                        <Text style={styles.labelEstatistica}>Com Contato</Text>
                    </View>

                    <View style={styles.cardEstatistica}>
                        <Text style={[styles.valorEstatistica, styles.valorDestaque]}>
                            {estatisticas.fornecedorComMaisProdutos}
                        </Text>
                        <Text style={styles.labelEstatistica}>Fornecedor com Mais Produtos</Text>
                        <Text style={styles.subLabelEstatistica}>
                            ({estatisticas.totalProdutosFornecedorMais} produtos)
                        </Text>
                    </View>
                </View>

                {/* Lista de Fornecedores */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Fornecedores</Text>

                    {carregando ? (
                        <Text style={styles.carregando}>Carregando fornecedores...</Text>
                    ) : fornecedoresFiltrados.length === 0 ? (
                        <View style={styles.semFornecedores}>
                            <Text style={styles.semFornecedoresText}>
                                {pesquisa ? 'Nenhum fornecedor encontrado' : 'Nenhum fornecedor cadastrado'}
                            </Text>
                            {fornecedores.length === 0 && !pesquisa && (
                                <TouchableOpacity
                                    style={styles.botaoCadastrarPrimeiro}
                                    onPress={() => setModalCadastroVisible(true)}
                                >
                                    <Text style={styles.textoBotaoCadastrar}>Cadastrar Primeiro Fornecedor</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ) : (
                        <View style={styles.tabela}>
                            {/* Cabeçalho da Tabela */}
                            <View style={styles.linhaTabelaCabecalho}>
                                <Text style={styles.colunaCabecalho}>Fornecedor</Text>
                                <Text style={styles.colunaCabecalho}>Contato</Text>
                                <Text style={styles.colunaCabecalho}>Documento</Text>
                                <Text style={styles.colunaCabecalho}>Produtos</Text>
                                <Text style={styles.colunaCabecalhoAcoes}>Ações</Text>
                            </View>

                            {/* Linhas da Tabela */}
                            {fornecedoresFiltrados.map((fornecedor) => {
                                const produtosDoFornecedor = produtos.filter(produto =>
                                    produto.fornecedor?.id === fornecedor.id
                                ).length;

                                return (
                                    <TouchableOpacity
                                        key={fornecedor.id}
                                        style={styles.linhaTabela}
                                        onPress={() => handleAbrirDetalhes(fornecedor)}
                                    >
                                        <View style={styles.colunaFornecedor}>
                                            <View style={styles.iconeFornecedor}>
                                                <Text style={styles.textoIcone}>🏭</Text>
                                            </View>
                                            <View style={styles.infoFornecedor}>
                                                <Text style={styles.nomeFornecedor}>
                                                    {fornecedor.nome || 'Sem nome'}
                                                </Text>
                                                <Text style={styles.emailFornecedor}>
                                                    {fornecedor.email || 'Sem email'}
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={styles.colunaContato}>
                                            <Text style={styles.telefoneFornecedor}>
                                                {formatarTelefone(fornecedor.telefone)}
                                            </Text>
                                        </View>

                                        <Text style={styles.colunaDocumento}>
                                            {formatarCpfCnpj(fornecedor.cpf_cnpj)}
                                        </Text>

                                        <View style={styles.colunaProdutos}>
                                            <Text style={[
                                                styles.textoProdutos,
                                                produtosDoFornecedor === 0 && styles.produtosZero
                                            ]}>
                                                {produtosDoFornecedor}
                                            </Text>
                                        </View>

                                        <View style={styles.colunaAcoes}>
                                            <TouchableOpacity
                                                style={styles.botaoAcao}
                                                onPress={(e) => {
                                                    e.stopPropagation();
                                                    handleEditarFornecedor(fornecedor);
                                                }}
                                            >
                                                <Text style={styles.textoBotaoEditar}>✏️</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.botaoAcao}
                                                onPress={(e) => {
                                                    e.stopPropagation();
                                                    handleExcluirFornecedor(fornecedor.id, fornecedor.nome);
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
            <ModalCadastroFornecedor
                visible={modalCadastroVisible}
                onClose={() => setModalCadastroVisible(false)}
                onSalvar={handleSalvarFornecedor}
                fornecedor={fornecedorSelecionado}
            />

            {/* Modal de Detalhes */}
            <ModalDetalhesFornecedor
                visible={modalDetalhesVisible}
                fornecedor={fornecedorSelecionado}
                produtos={produtos}
                onClose={() => setModalDetalhesVisible(false)}
                onEditar={handleEditarFornecedor}
                onExcluir={(fornecedorId, fornecedorNome) => handleExcluirFornecedor(fornecedorId, fornecedorNome)}
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
    botaoNovoFornecedor: {
        backgroundColor: '#28a745',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    textoBotaoNovoFornecedor: {
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
    colunaFornecedor: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconeFornecedor: {
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
    infoFornecedor: {
        flex: 1,
    },
    nomeFornecedor: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    emailFornecedor: {
        fontSize: 14,
        color: '#666',
    },
    colunaContato: {
        flex: 2,
    },
    telefoneFornecedor: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    colunaDocumento: {
        flex: 2,
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    colunaProdutos: {
        flex: 1,
        alignItems: 'center',
    },
    textoProdutos: {
        fontSize: 14,
        fontWeight: '600',
        color: '#28a745',
    },
    produtosZero: {
        color: '#6c757d',
    },
    colunaAcoes: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    botaoAcao: {
        padding: 8,
        borderRadius: 6,
    },
    textoBotaoEditar: {
        fontSize: 16,
        color: '#007AFF',
    },
    textoBotaoExcluir: {
        fontSize: 16,
        color: '#FF3B30',
    },
    carregando: {
        textAlign: 'center',
        padding: 20,
        color: '#666',
        fontSize: 16,
    },
    semFornecedores: {
        textAlign: 'center',
        padding: 40,
        color: '#666',
        fontSize: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
    },
});

export default FornecedorWebScreen;
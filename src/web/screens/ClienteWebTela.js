// src/web/screens/ClienteWebTela.js
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
import ModalCadastroCliente from '../components/ModalCadastroCliente';
import ModalDetalhesCliente from '../components/ModalDetalhesCliente';
import api from '../../services/api';

const ClientesWebScreen = () => {
    const [modalCadastroVisible, setModalCadastroVisible] = useState(false);
    const [modalDetalhesVisible, setModalDetalhesVisible] = useState(false);
    const [clienteSelecionado, setClienteSelecionado] = useState(null);
    const [clientes, setClientes] = useState([]);
    const [pesquisa, setPesquisa] = useState('');
    const [carregando, setCarregando] = useState(true);
    const [atualizando, setAtualizando] = useState(false);

    // Buscar clientes da API
    const buscarClientes = async () => {
        try {
            setCarregando(true);
            const response = await api.get('/cliente/');
            console.log('Clientes carregados:', response.data);
            setClientes(response.data || []);
        } catch (error) {
            console.error('Erro ao buscar clientes:', error);
            Alert.alert('Erro', 'Não foi possível carregar os clientes');
            setClientes([]);
        } finally {
            setCarregando(false);
            setAtualizando(false);
        }
    };

    useEffect(() => {
        buscarClientes();
    }, []);

    // Pull to refresh
    const handleRefresh = () => {
        setAtualizando(true);
        buscarClientes();
    };

    // Filtrar clientes baseado na pesquisa
    const clientesFiltrados = clientes.filter(cliente =>
        (cliente.nome || '').toLowerCase().includes(pesquisa.toLowerCase()) ||
        (cliente.telefone || '').includes(pesquisa) ||
        (cliente.cpfCnpj || '').includes(pesquisa) ||
        (cliente.email || '').toLowerCase().includes(pesquisa.toLowerCase())
    );

    // Função para salvar novo cliente
    const handleSalvarCliente = async (dadosCliente) => {
        try {
            console.log('Salvando cliente:', dadosCliente);
            await api.post('/cliente/', dadosCliente);
            await buscarClientes();
            Alert.alert('Sucesso', 'Cliente cadastrado com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar cliente:', error);
            let errorMessage = 'Não foi possível cadastrar o cliente';
            if (error.response?.status === 409) {
                errorMessage = 'CPF/CNPJ já cadastrado';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            Alert.alert('Erro', errorMessage);
        }
    };

    // Função para excluir cliente
    const handleExcluirCliente = async (clienteId, clienteNome) => {
        Alert.alert(
            'Confirmar Exclusão',
            `Tem certeza que deseja excluir o cliente "${clienteNome}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.delete(`/cliente/${clienteId}`);
                            await buscarClientes();
                            Alert.alert('Sucesso', 'Cliente excluído com sucesso!');
                        } catch (error) {
                            console.error('Erro ao excluir cliente:', error);
                            Alert.alert('Erro', 'Não foi possível excluir o cliente');
                        }
                    }
                }
            ]
        );
    };

    // Função para abrir modal de detalhes
    const handleAbrirDetalhes = async (cliente) => {
        setClienteSelecionado(cliente);
        setModalDetalhesVisible(true);
    };

    // Função para editar cliente
    const handleEditarCliente = (cliente) => {
        setClienteSelecionado(cliente);
        setModalDetalhesVisible(false);
        setModalCadastroVisible(true);
    };

    // Calcular estatísticas
    const calcularEstatisticas = () => {
        const totalClientes = clientes.length;

        const clientesComTelefone = clientes.filter(cliente =>
            cliente.telefone && cliente.telefone.trim() !== ''
        ).length;

        const clientesComEmail = clientes.filter(cliente =>
            cliente.email && cliente.email.trim() !== ''
        ).length;

        const clientesPessoaFisica = clientes.filter(cliente => {
            const cpfCnpj = cliente.cpfCnpj || '';
            return cpfCnpj.replace(/\D/g, '').length <= 11;
        }).length;

        const clientesPessoaJuridica = totalClientes - clientesPessoaFisica;

        // Calcular idade média (apenas para PF com data de nascimento)
        const clientesComDataNascimento = clientes.filter(cliente => {
            const cpfCnpj = cliente.cpfCnpj || '';
            return cpfCnpj.replace(/\D/g, '').length <= 11 && cliente.dataNascimento;
        });

        let idadeMedia = 0;
        if (clientesComDataNascimento.length > 0) {
            const idades = clientesComDataNascimento.map(cliente => {
                const nascimento = new Date(cliente.dataNascimento);
                const hoje = new Date();
                let idade = hoje.getFullYear() - nascimento.getFullYear();
                const mesAtual = hoje.getMonth();
                const mesNascimento = nascimento.getMonth();

                if (mesAtual < mesNascimento ||
                    (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
                    idade--;
                }
                return idade;
            });
            idadeMedia = idades.reduce((a, b) => a + b, 0) / idades.length;
        }

        return {
            totalClientes,
            clientesComTelefone,
            clientesComEmail,
            clientesPessoaFisica,
            clientesPessoaJuridica,
            idadeMedia: idadeMedia.toFixed(1)
        };
    };

    const estatisticas = calcularEstatisticas();

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

    // Determinar tipo de cliente
    const getTipoCliente = (cliente) => {
        const cpfCnpj = cliente.cpfCnpj || '';
        return cpfCnpj.replace(/\D/g, '').length <= 11 ? 'Pessoa Física' : 'Pessoa Jurídica';
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>👥 Clientes</Text>
                    <Text style={styles.subtitle}>{clientes.length} Clientes Cadastrados</Text>
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
                        placeholder="Pesquisar clientes por nome, telefone, CPF/CNPJ ou email..."
                        value={pesquisa}
                        onChangeText={setPesquisa}
                    />
                    <TouchableOpacity style={styles.botaoFiltro}>
                        <Text style={styles.textoBotaoFiltro}>Filtros</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.botaoNovoCliente}
                    onPress={() => {
                        setClienteSelecionado(null);
                        setModalCadastroVisible(true);
                    }}
                >
                    <Text style={styles.textoBotaoNovoCliente}>+ Novo Cliente</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={atualizando}
                        onRefresh={handleRefresh}
                        colors={['#4CAF50']}
                    />
                }
            >
                {/* Cards de Estatísticas */}
                <View style={styles.cardsContainer}>
                    <View style={styles.cardEstatistica}>
                        <Text style={styles.valorEstatistica}>{estatisticas.totalClientes}</Text>
                        <Text style={styles.labelEstatistica}>Total de Clientes</Text>
                    </View>

                    <View style={styles.cardEstatistica}>
                        <Text style={styles.valorEstatistica}>{estatisticas.clientesComTelefone}</Text>
                        <Text style={styles.labelEstatistica}>Com Telefone</Text>
                    </View>

                    <View style={styles.cardEstatistica}>
                        <Text style={styles.valorEstatistica}>{estatisticas.clientesComEmail}</Text>
                        <Text style={styles.labelEstatistica}>Com Email</Text>
                    </View>

                    <View style={styles.cardEstatistica}>
                        <Text style={styles.valorEstatistica}>{estatisticas.clientesPessoaFisica}</Text>
                        <Text style={styles.labelEstatistica}>Pessoa Física</Text>
                    </View>

                    <View style={styles.cardEstatistica}>
                        <Text style={styles.valorEstatistica}>{estatisticas.clientesPessoaJuridica}</Text>
                        <Text style={styles.labelEstatistica}>Pessoa Jurídica</Text>
                    </View>

                    <View style={styles.cardEstatistica}>
                        <Text style={[styles.valorEstatistica, styles.valorDestaque]}>
                            {estatisticas.idadeMedia}
                        </Text>
                        <Text style={styles.labelEstatistica}>Idade Média</Text>
                        <Text style={styles.subLabelEstatistica}>(Pessoas Físicas)</Text>
                    </View>
                </View>

                {/* Lista de Clientes */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Clientes</Text>

                    {carregando ? (
                        <Text style={styles.carregando}>Carregando clientes...</Text>
                    ) : clientesFiltrados.length === 0 ? (
                        <Text style={styles.semClientes}>
                            {pesquisa ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
                        </Text>
                    ) : (
                        <View style={styles.tabela}>
                            {/* Cabeçalho da Tabela */}
                            <View style={styles.linhaTabelaCabecalho}>
                                <Text style={styles.colunaCabecalho}>Cliente</Text>
                                <Text style={styles.colunaCabecalho}>Contato</Text>
                                <Text style={styles.colunaCabecalho}>Documento</Text>
                                <Text style={styles.colunaCabecalho}>Tipo</Text>
                                <Text style={styles.colunaCabecalhoAcoes}>Ações</Text>
                            </View>

                            {/* Linhas da Tabela */}
                            {clientesFiltrados.map((cliente) => {
                                const tipoCliente = getTipoCliente(cliente);

                                return (
                                    <TouchableOpacity
                                        key={cliente.id}
                                        style={styles.linhaTabela}
                                        onPress={() => handleAbrirDetalhes(cliente)}
                                    >
                                        <View style={styles.colunaCliente}>
                                            <View style={styles.iconeCliente}>
                                                <Text style={styles.textoIcone}>👤</Text>
                                            </View>
                                            <View style={styles.infoCliente}>
                                                <Text style={styles.nomeCliente}>
                                                    {cliente.nome || 'Sem nome'}
                                                </Text>
                                                <Text style={styles.emailCliente}>
                                                    {cliente.email || 'Sem email'}
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={styles.colunaContato}>
                                            <Text style={styles.telefoneCliente}>
                                                {formatarTelefone(cliente.telefone)}
                                            </Text>
                                        </View>

                                        <Text style={styles.colunaDocumento}>
                                            {formatarCpfCnpj(cliente.cpfCnpj)}
                                        </Text>

                                        <View style={styles.colunaTipo}>
                                            <Text style={[
                                                styles.textoTipo,
                                                tipoCliente === 'Pessoa Física' ? styles.tipoPF : styles.tipoPJ
                                            ]}>
                                                {tipoCliente}
                                            </Text>
                                        </View>

                                        <View style={styles.colunaAcoes}>
                                            <TouchableOpacity
                                                style={styles.botaoAcao}
                                                onPress={(e) => {
                                                    e.stopPropagation();
                                                    handleEditarCliente(cliente);
                                                }}
                                            >
                                                <Text style={styles.textoBotaoEditar}>✏️</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.botaoAcao}
                                                onPress={(e) => {
                                                    e.stopPropagation();
                                                    handleExcluirCliente(cliente.id, cliente.nome);
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
            <ModalCadastroCliente
                visible={modalCadastroVisible}
                onClose={() => setModalCadastroVisible(false)}
                onSalvar={handleSalvarCliente}
                cliente={clienteSelecionado}
            />

            {/* Modal de Detalhes */}
            <ModalDetalhesCliente
                visible={modalDetalhesVisible}
                cliente={clienteSelecionado}
                onClose={() => setModalDetalhesVisible(false)}
                onEditar={handleEditarCliente}
                onExcluir={(clienteId, clienteNome) => handleExcluirCliente(clienteId, clienteNome)}
            />
        </View>
    );
};

// Adicionando RefreshControl ao ScrollView
import { RefreshControl } from 'react-native';

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
    botaoNovoCliente: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    textoBotaoNovoCliente: {
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
        color: '#4CAF50',
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
    colunaCliente: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconeCliente: {
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
    infoCliente: {
        flex: 1,
    },
    nomeCliente: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    emailCliente: {
        fontSize: 14,
        color: '#666',
    },
    colunaContato: {
        flex: 2,
    },
    telefoneCliente: {
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
    colunaTipo: {
        flex: 1,
    },
    textoTipo: {
        fontSize: 12,
        fontWeight: '600',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
        textAlign: 'center',
        overflow: 'hidden',
    },
    tipoPF: {
        backgroundColor: '#e3f2fd',
        color: '#1565c0',
    },
    tipoPJ: {
        backgroundColor: '#f3e5f5',
        color: '#7b1fa2',
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
    semClientes: {
        textAlign: 'center',
        padding: 40,
        color: '#666',
        fontSize: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
    },
});

export default ClientesWebScreen;
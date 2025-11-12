import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  Modal,
  ScrollView,
  Alert,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';

const { width, height } = Dimensions.get('window');

export default function ClientesTela({ navigation }) {
  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [pesquisa, setPesquisa] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Buscar clientes da API
  const fetchClientes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cliente/');
      setClientes(response.data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      Alert.alert('Erro', 'Não foi possível carregar os clientes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Carregar clientes quando a tela abrir
  useEffect(() => {
    fetchClientes();
  }, []);

  // Pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchClientes();
  };

  // Filtrar clientes baseado na pesquisa
  const clientesFiltrados = clientes.filter(cliente =>
    (cliente.nome || '').toLowerCase().includes(pesquisa.toLowerCase()) ||
    (cliente.telefone || '').includes(pesquisa) ||
    (cliente.cpfCnpj || '').includes(pesquisa)
  );

  // Abrir modal com detalhes do cliente
  const abrirDetalhesCliente = (cliente) => {
    setClienteSelecionado(cliente);
    setModalVisible(true);
  };

  // Fechar modal
  const fecharModal = () => {
    setModalVisible(false);
    setClienteSelecionado(null);
  };

  // Excluir cliente
  const handleExcluirCliente = () => {
    if (!clienteSelecionado) return;

    Alert.alert(
      'Excluir Cliente',
      `Tem certeza que deseja excluir "${clienteSelecionado.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/cliente/${clienteSelecionado.id}`);
              setModalVisible(false);
              fetchClientes();
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

  // Editar cliente
  const handleEditarCliente = () => {
    if (!clienteSelecionado) return;

    setModalVisible(false);
    navigation.navigate('CadastroClientes', {
      cliente: clienteSelecionado,
      onClienteAtualizado: fetchClientes
    });
  };

  // Formatar telefone para exibição
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

  // Calcular idade a partir da data de nascimento
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

  // Renderizar card do cliente
  const renderClienteCard = ({ item }) => {
    const idade = calcularIdade(item.dataNascimento);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => abrirDetalhesCliente(item)}
      >
        <View style={styles.cardContent}>
          <View style={styles.cardIcon}>
            <Ionicons name="person-outline" size={width * 0.08} color="#4CAF50" />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardNome} numberOfLines={1}>
              {item.nome || 'Sem nome'}
            </Text>
            <Text style={styles.cardTelefone}>
              {item.telefone ? formatarTelefone(item.telefone) : 'Telefone não informado'}
            </Text>
            {idade && (
              <Text style={styles.cardIdade}>
                {idade} anos
              </Text>
            )}
          </View>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </View>
      </TouchableOpacity>
    );
  };

  // Modal de detalhes do cliente
  const renderModalDetalhes = () => {
    if (!clienteSelecionado) return null;

    const idade = calcularIdade(clienteSelecionado.dataNascimento);

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={fecharModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalhes do Cliente</Text>
              <TouchableOpacity onPress={fecharModal}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Informações básicas */}
              <View style={styles.detalhesTopo}>
                <View style={styles.clienteIconGrande}>
                  <Ionicons name="person-outline" size={width * 0.15} color="#4CAF50" />
                </View>
                <View style={styles.detalhesInfoBasica}>
                  <Text style={styles.detalhesNome}>{clienteSelecionado.nome || 'Sem nome'}</Text>
                  <Text style={styles.detalhesDocumento}>
                    {formatarCpfCnpj(clienteSelecionado.cpfCnpj)}
                  </Text>
                  {idade && (
                    <Text style={styles.detalhesIdade}>
                      {idade} anos
                    </Text>
                  )}
                </View>
              </View>

              {/* Contato */}
              <View style={styles.detalhesSection}>
                <Text style={styles.detalhesSectionTitle}>Contato</Text>

                <View style={styles.infoRow}>
                  <Ionicons name="call-outline" size={20} color="#666" />
                  <Text style={styles.infoText}>
                    {clienteSelecionado.telefone ? formatarTelefone(clienteSelecionado.telefone) : 'Não informado'}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name="mail-outline" size={20} color="#666" />
                  <Text style={styles.infoText}>
                    {clienteSelecionado.email || 'Não informado'}
                  </Text>
                </View>
              </View>

              {/* Data de Nascimento */}
              {clienteSelecionado.dataNascimento && (
                <View style={styles.detalhesSection}>
                  <Text style={styles.detalhesSectionTitle}>Data de Nascimento</Text>
                  <View style={styles.infoRow}>
                    <Ionicons name="calendar-outline" size={20} color="#666" />
                    <Text style={styles.infoText}>
                      {formatarDataNascimento(clienteSelecionado.dataNascimento)}
                      {idade && ` (${idade} anos)`}
                    </Text>
                  </View>
                </View>
              )}

              {/* Observações */}
              {clienteSelecionado.observacao && (
                <View style={styles.detalhesSection}>
                  <Text style={styles.detalhesSectionTitle}>Observações</Text>
                  <Text style={styles.observacaoText}>
                    {clienteSelecionado.observacao}
                  </Text>
                </View>
              )}
            </ScrollView>

            {/* Botões de ação */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.botaoAcao, styles.botaoExcluir]}
                onPress={handleExcluirCliente}
              >
                <Ionicons name="trash-outline" size={20} color="#fff" />
                <Text style={styles.botaoAcaoText}>Excluir</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.botaoAcao, styles.botaoEditar]}
                onPress={handleEditarCliente}
              >
                <Ionicons name="create-outline" size={20} color="#fff" />
                <Text style={styles.botaoAcaoText}>Editar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
        style={styles.voltar}
      >
        <Ionicons name="arrow-back" size={width * 0.06} color="black" />
        <Text style={styles.title}>Listar{"\n"}<Text style={styles.bold}>Clientes</Text></Text>
      </TouchableOpacity>

      {/* Campo de pesquisa */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={width * 0.05}
          color="#aaa"
          style={{ marginLeft: width * 0.02 }}
        />
        <TextInput
          placeholder="Pesquisar clientes..."
          style={styles.input}
          placeholderTextColor="#999"
          value={pesquisa}
          onChangeText={setPesquisa}
        />
        {pesquisa.length > 0 && (
          <TouchableOpacity onPress={() => setPesquisa('')}>
            <Ionicons name="close-circle" size={width * 0.05} color="#aaa" />
          </TouchableOpacity>
        )}
      </View>

      {/* Lista de clientes */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Carregando clientes...</Text>
        </View>
      ) : clientesFiltrados.length > 0 ? (
        <FlatList
          data={clientesFiltrados}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={renderClienteCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#4CAF50']}
            />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={width * 0.2} color="#ccc" />
          <Text style={styles.emptyText}>Nenhum cliente encontrado</Text>
          <Text style={styles.emptySubtext}>
            {pesquisa ? 'Tente buscar com outros termos' : 'Cadastre seu primeiro cliente usando o botão abaixo'}
          </Text>
        </View>
      )}

      {/* Modal de detalhes */}
      {renderModalDetalhes()}

      {/* Botão flutuante */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CadastroClientes', { onClienteCriado: fetchClientes })}
      >
        <Ionicons name="add" size={width * 0.08} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05,
    paddingTop: height * 0.045,
    backgroundColor: '#fff',
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: width * 0.02,
    marginVertical: height * 0.01,
    paddingHorizontal: width * 0.03,
    height: height * 0.06,
  },
  input: {
    flex: 1,
    height: '100%',
    marginLeft: width * 0.02,
    fontSize: width * 0.04,
  },
  // Cards
  card: {
    backgroundColor: '#fff',
    borderRadius: width * 0.02,
    marginBottom: height * 0.01,
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: width * 0.04,
  },
  cardIcon: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.02,
    backgroundColor: '#f0f9f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: width * 0.04,
  },
  cardInfo: {
    flex: 1,
  },
  cardNome: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.005,
  },
  cardTelefone: {
    fontSize: width * 0.035,
    color: '#666',
    marginBottom: height * 0.003,
  },
  cardIdade: {
    fontSize: width * 0.033,
    color: '#888',
  },
  listContent: {
    paddingBottom: height * 0.1,
  },
  // Estados vazios/carregamento
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.1,
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
  // Botão flutuante
  addButton: {
    backgroundColor: '#4CAF50',
    position: 'absolute',
    bottom: height * 0.03,
    right: width * 0.05,
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: width * 0.05,
    borderTopRightRadius: width * 0.05,
    maxHeight: height * 0.9,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: width * 0.05,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    padding: width * 0.05,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: width * 0.05,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: width * 0.03,
  },
  // Detalhes do cliente no modal
  detalhesTopo: {
    flexDirection: 'row',
    marginBottom: height * 0.03,
  },
  clienteIconGrande: {
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
    marginBottom: height * 0.01,
  },
  detalhesDocumento: {
    fontSize: width * 0.035,
    color: '#666',
    marginBottom: height * 0.005,
  },
  detalhesIdade: {
    fontSize: width * 0.035,
    color: '#888',
  },
  detalhesSection: {
    marginBottom: height * 0.03,
  },
  detalhesSectionTitle: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.02,
    paddingBottom: height * 0.01,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.015,
  },
  infoText: {
    fontSize: width * 0.038,
    color: '#333',
    marginLeft: width * 0.03,
    flex: 1,
  },
  observacaoText: {
    fontSize: width * 0.038,
    color: '#333',
    lineHeight: height * 0.025,
  },
  // Botões de ação
  botaoAcao: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: height * 0.02,
    borderRadius: width * 0.02,
    gap: width * 0.02,
  },
  botaoExcluir: {
    backgroundColor: '#f44336',
  },
  botaoEditar: {
    backgroundColor: '#4CAF50',
  },
  botaoAcaoText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
});
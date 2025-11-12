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

export default function FornecedorTela({ navigation }) {
  const [fornecedores, setFornecedores] = useState([]);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [pesquisa, setPesquisa] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Buscar fornecedores da API
  const fetchFornecedores = async () => {
    try {
      setLoading(true);
      const response = await api.get('/fornecedor/');
      setFornecedores(response.data);
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error);
      Alert.alert('Erro', 'Não foi possível carregar os fornecedores');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Carregar fornecedores quando a tela abrir
  useEffect(() => {
    fetchFornecedores();
  }, []);

  // Pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchFornecedores();
  };

  // Filtrar fornecedores baseado na pesquisa
  const fornecedoresFiltrados = fornecedores.filter(fornecedor =>
    (fornecedor.nome || '').toLowerCase().includes(pesquisa.toLowerCase()) ||
    (fornecedor.telefone || '').includes(pesquisa)
  );

  // Abrir modal com detalhes do fornecedor
  const abrirDetalhesFornecedor = (fornecedor) => {
    setFornecedorSelecionado(fornecedor);
    setModalVisible(true);
  };

  // Fechar modal
  const fecharModal = () => {
    setModalVisible(false);
    setFornecedorSelecionado(null);
  };

  // Excluir fornecedor
  const handleExcluirFornecedor = () => {
    if (!fornecedorSelecionado) return;

    Alert.alert(
      'Excluir Fornecedor',
      `Tem certeza que deseja excluir "${fornecedorSelecionado.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/fornecedor/${fornecedorSelecionado.id}`);
              setModalVisible(false);
              fetchFornecedores();
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

  // Editar fornecedor
  const handleEditarFornecedor = () => {
    if (!fornecedorSelecionado) return;

    setModalVisible(false);
    navigation.navigate('CadastroFornecedor', {
      fornecedor: fornecedorSelecionado,
      onFornecedorAtualizado: fetchFornecedores
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

  // Renderizar card do fornecedor
  const renderFornecedorCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => abrirDetalhesFornecedor(item)}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardIcon}>
          <Ionicons name="business-outline" size={width * 0.08} color="#4CAF50" />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardNome} numberOfLines={1}>
            {item.nome || 'Sem nome'}
          </Text>
          <Text style={styles.cardTelefone}>
            {item.telefone ? formatarTelefone(item.telefone) : 'Telefone não informado'}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </View>
    </TouchableOpacity>
  );

  // Modal de detalhes do fornecedor
  const renderModalDetalhes = () => {
    if (!fornecedorSelecionado) return null;

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
              <Text style={styles.modalTitle}>Detalhes do Fornecedor</Text>
              <TouchableOpacity onPress={fecharModal}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Informações básicas */}
              <View style={styles.detalhesTopo}>
                <View style={styles.fornecedorIconGrande}>
                  <Ionicons name="business-outline" size={width * 0.15} color="#4CAF50" />
                </View>
                <View style={styles.detalhesInfoBasica}>
                  <Text style={styles.detalhesNome}>{fornecedorSelecionado.nome || 'Sem nome'}</Text>
                  <Text style={styles.detalhesDocumento}>
                    {formatarCpfCnpj(fornecedorSelecionado.cpfCnpj)}
                  </Text>
                </View>
              </View>

              {/* Contato */}
              <View style={styles.detalhesSection}>
                <Text style={styles.detalhesSectionTitle}>Contato</Text>

                <View style={styles.infoRow}>
                  <Ionicons name="call-outline" size={20} color="#666" />
                  <Text style={styles.infoText}>
                    {fornecedorSelecionado.telefone ? formatarTelefone(fornecedorSelecionado.telefone) : 'Não informado'}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name="mail-outline" size={20} color="#666" />
                  <Text style={styles.infoText}>
                    {fornecedorSelecionado.email || 'Não informado'}
                  </Text>
                </View>
              </View>

              {/* Observações */}
              {fornecedorSelecionado.observacao && (
                <View style={styles.detalhesSection}>
                  <Text style={styles.detalhesSectionTitle}>Observações</Text>
                  <Text style={styles.observacaoText}>
                    {fornecedorSelecionado.observacao}
                  </Text>
                </View>
              )}
            </ScrollView>

            {/* Botões de ação */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.botaoAcao, styles.botaoExcluir]}
                onPress={handleExcluirFornecedor}
              >
                <Ionicons name="trash-outline" size={20} color="#fff" />
                <Text style={styles.botaoAcaoText}>Excluir</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.botaoAcao, styles.botaoEditar]}
                onPress={handleEditarFornecedor}
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
        <Ionicons
          name="arrow-back"
          size={width * 0.06}
          color="black"
        />
        <Text style={styles.title}>
          Listar{"\n"}
          <Text style={styles.bold}>Fornecedores</Text>
        </Text>
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
          placeholder="Pesquisar fornecedores..."
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

      {/* Lista de fornecedores */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Carregando fornecedores...</Text>
        </View>
      ) : fornecedoresFiltrados.length > 0 ? (
        <FlatList
          data={fornecedoresFiltrados}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={renderFornecedorCard}
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
          <Ionicons name="business-outline" size={width * 0.2} color="#ccc" />
          <Text style={styles.emptyText}>Nenhum fornecedor encontrado</Text>
          <Text style={styles.emptySubtext}>
            {pesquisa ? 'Tente buscar com outros termos' : 'Cadastre seu primeiro fornecedor usando o botão abaixo'}
          </Text>
        </View>
      )}

      {/* Modal de detalhes */}
      {renderModalDetalhes()}

      {/* Botão flutuante */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CadastroFornecedor', { onFornecedorCriado: fetchFornecedores })}
      >
        <Ionicons
          name="add"
          size={width * 0.08}
          color="white"
        />
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
  // Detalhes do fornecedor no modal
  detalhesTopo: {
    flexDirection: 'row',
    marginBottom: height * 0.03,
  },
  fornecedorIconGrande: {
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
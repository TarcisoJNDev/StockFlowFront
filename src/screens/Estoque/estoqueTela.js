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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../../services/api';

const { width, height } = Dimensions.get('window');

export default function EstoqueTela({ navigation }) {
  const [pesquisa, setPesquisa] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [modalRetiradaVisible, setModalRetiradaVisible] = useState(false);
  const [modalEntradaVisible, setModalEntradaVisible] = useState(false);
  const [modalFiltroVisible, setModalFiltroVisible] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [quantidade, setQuantidade] = useState('');
  const [observacao, setObservacao] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Estados para filtros
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroFornecedor, setFiltroFornecedor] = useState('');
  const [filtroQuantidadeBaixa, setFiltroQuantidadeBaixa] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);

  // Buscar produtos da API
  const fetchProdutos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/produto/');
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os produtos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Buscar categorias e fornecedores para os filtros
  const fetchDadosFiltro = async () => {
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
    fetchProdutos();
    fetchDadosFiltro();
  }, []);

  // Pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchProdutos();
  };

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

  // Abrir modal de retirada
  const abrirModalRetirada = (produto) => {
    setProdutoSelecionado(produto);
    setQuantidade('');
    setObservacao('');
    setModalRetiradaVisible(true);
  };

  // Abrir modal de entrada
  const abrirModalEntrada = (produto) => {
    setProdutoSelecionado(produto);
    setQuantidade('');
    setObservacao('');
    setModalEntradaVisible(true);
  };

  // Fechar modais
  const fecharModais = () => {
    setModalRetiradaVisible(false);
    setModalEntradaVisible(false);
    setModalFiltroVisible(false);
    setProdutoSelecionado(null);
  };

  // Processar retirada de estoque
  const processarRetirada = async () => {
    if (!quantidade || parseInt(quantidade) <= 0) {
      Alert.alert('Erro', 'Informe uma quantidade válida');
      return;
    }

    if (!produtoSelecionado) {
      Alert.alert('Erro', 'Produto não selecionado');
      return;
    }

    const qtd = parseInt(quantidade);
    const estoqueAtual = produtoSelecionado.estoqueAtual || 0;

    if (qtd > estoqueAtual) {
      Alert.alert(`'Erro', Quantidade indisponível.Estoque atual: ${estoqueAtual}`);
      return;
    }

    try {
      const dadosAtualizacao = {
        ...produtoSelecionado,
        estoqueAtual: estoqueAtual - qtd
      };

      await api.put('/produto/', dadosAtualizacao);

      Alert.alert(`'Sucesso', Retirada de ${qtd} unidades realizada com sucesso!`);
      fecharModais();
      fetchProdutos();
    } catch (error) {
      console.error('Erro ao processar retirada:', error);
      Alert.alert('Erro', 'Não foi possível processar a retirada');
    }
  };

  // Processar entrada de estoque
  const processarEntrada = async () => {
    if (!quantidade || parseInt(quantidade) <= 0) {
      Alert.alert('Erro', 'Informe uma quantidade válida');
      return;
    }

    if (!produtoSelecionado) {
      Alert.alert('Erro', 'Produto não selecionado');
      return;
    }

    try {
      const qtd = parseInt(quantidade);
      const estoqueAtual = produtoSelecionado.estoqueAtual || 0;

      const dadosAtualizacao = {
        ...produtoSelecionado,
        estoqueAtual: estoqueAtual + qtd
      };

      await api.put('/produto/', dadosAtualizacao);

      Alert.alert(`'Sucesso', Entrada de ${qtd} unidades realizada com sucesso!`);
      fecharModais();
      fetchProdutos();
    } catch (error) {
      console.error('Erro ao processar entrada:', error);
      Alert.alert('Erro', 'Não foi possível processar a entrada');
    }
  };

  // Limpar filtros
  const limparFiltros = () => {
    setFiltroNome('');
    setFiltroCategoria('');
    setFiltroFornecedor('');
    setFiltroQuantidadeBaixa(false);
    setModalFiltroVisible(false);
  };

  // Aplicar filtros
  const aplicarFiltros = () => {
    setModalFiltroVisible(false);
  };

  // Renderizar card do produto
  const renderProdutoCard = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.cardInfo}>
          <Text style={styles.cardNome} numberOfLines={1}>
            {item.nome || 'Sem nome'}
          </Text>
          <Text style={styles.cardDetalhes}>
            Código: {item.codigoDeBarras || 'N/A'} • Estoque: {item.estoqueAtual || 0}
          </Text>
          {item.categoria && (
            <Text style={styles.cardCategoria}>
              Categoria: {item.categoria.nome}
            </Text>
          )}
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.entradaButton]}
            onPress={() => abrirModalEntrada(item)}
          >
            <Ionicons name="add-circle-outline" size={20} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.retiradaButton]}
            onPress={() => abrirModalRetirada(item)}
          >
            <Ionicons name="remove-circle-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Modal de retirada de estoque
  const renderModalRetirada = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalRetiradaVisible}
      onRequestClose={fecharModais}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Retirar do Estoque</Text>
            <TouchableOpacity onPress={fecharModais}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <Text style={styles.produtoSelecionadoText}>
              Produto: {produtoSelecionado?.nome}
            </Text>
            <Text style={styles.estoqueAtualText}>
              Estoque atual: {produtoSelecionado?.estoqueAtual || 0}
            </Text>

            <TextInput
              placeholder="Quantidade a retirar*"
              value={quantidade}
              onChangeText={setQuantidade}
              style={styles.modalInput}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />

            <TextInput
              placeholder="Observação (opcional)"
              value={observacao}
              onChangeText={setObservacao}
              style={[styles.modalInput, { height: 80 }]}
              multiline
              placeholderTextColor="#999"
            />
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={fecharModais}
            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton]}
              onPress={processarRetirada}
            >
              <Text style={styles.modalButtonText}>Confirmar Retirada</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Modal de entrada de estoque
  const renderModalEntrada = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalEntradaVisible}
      onRequestClose={fecharModais}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Adicionar ao Estoque</Text>
            <TouchableOpacity onPress={fecharModais}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <Text style={styles.produtoSelecionadoText}>
              Produto: {produtoSelecionado?.nome}
            </Text>
            <Text style={styles.estoqueAtualText}>
              Estoque atual: {produtoSelecionado?.estoqueAtual || 0}
            </Text>

            <TextInput
              placeholder="Quantidade a adicionar*"
              value={quantidade}
              onChangeText={setQuantidade}
              style={styles.modalInput}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />

            <TextInput
              placeholder="Observação (opcional)"
              value={observacao}
              onChangeText={setObservacao}
              style={[styles.modalInput, { height: 80 }]}
              multiline
              placeholderTextColor="#999"
            />
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={fecharModais}
            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton]}
              onPress={processarEntrada}
            >
              <Text style={styles.modalButtonText}>Confirmar Entrada</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Modal de filtro
  const renderModalFiltro = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalFiltroVisible}
      onRequestClose={fecharModais}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtrar Produtos</Text>
            <TouchableOpacity onPress={fecharModais}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <TextInput
              placeholder="Nome do produto"
              value={filtroNome}
              onChangeText={setFiltroNome}
              style={styles.modalInput}
              placeholderTextColor="#999"
            />

            <TouchableOpacity
              style={styles.filterSwitch}
              onPress={() => setFiltroQuantidadeBaixa(!filtroQuantidadeBaixa)}
            >
              <Text style={styles.filterSwitchText}>Mostrar apenas produtos com estoque baixo</Text>
              <View style={[
                styles.switch,
                filtroQuantidadeBaixa ? styles.switchOn : styles.switchOff
              ]}>
                <View style={[
                  styles.switchKnob,
                  filtroQuantidadeBaixa ? styles.switchKnobOn : styles.switchKnobOff
                ]} />
              </View>
            </TouchableOpacity>

            <Text style={styles.filterSectionTitle}>Categoria</Text>
            <ScrollView
              style={styles.filterScroll}
              nestedScrollEnabled={true}
              horizontal
            >
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  !filtroCategoria && styles.filterChipSelected
                ]}
                onPress={() => setFiltroCategoria('')}
              >
                <Text style={[
                  styles.filterChipText,
                  !filtroCategoria && styles.filterChipTextSelected
                ]}>Todas</Text>
              </TouchableOpacity>
              {categorias.map(categoria => (
                <TouchableOpacity
                  key={categoria.id}
                  style={[
                    styles.filterChip,
                    filtroCategoria === categoria.id.toString() && styles.filterChipSelected
                  ]}
                  onPress={() => setFiltroCategoria(categoria.id.toString())}
                >
                  <Text style={[
                    styles.filterChipText,
                    filtroCategoria === categoria.id.toString() && styles.filterChipTextSelected
                  ]}>{categoria.nome}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.filterSectionTitle}>Fornecedor</Text>
            <ScrollView
              style={styles.filterScroll}
              nestedScrollEnabled={true}
              horizontal
            >
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  !filtroFornecedor && styles.filterChipSelected
                ]}
                onPress={() => setFiltroFornecedor('')}
              >
                <Text style={[
                  styles.filterChipText,
                  !filtroFornecedor && styles.filterChipTextSelected
                ]}>Todos</Text>
              </TouchableOpacity>
              {fornecedores.map(fornecedor => (
                <TouchableOpacity
                  key={fornecedor.id}
                  style={[
                    styles.filterChip,
                    filtroFornecedor === fornecedor.id.toString() && styles.filterChipSelected
                  ]}
                  onPress={() => setFiltroFornecedor(fornecedor.id.toString())}
                >
                  <Text style={[
                    styles.filterChipText,
                    filtroFornecedor === fornecedor.id.toString() && styles.filterChipTextSelected
                  ]}>{fornecedor.nome}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.clearButton]}
              onPress={limparFiltros}
            >
              <Text style={styles.modalButtonText}>Limpar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton]}
              onPress={aplicarFiltros}
            >
              <Text style={styles.modalButtonText}>Aplicar Filtros</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

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
          Controle de{"\n"}
          <Text style={styles.bold}>Estoque</Text>
        </Text>
      </TouchableOpacity>

      <View style={styles.searchRow}>
        <View style={styles.searchInputContainer}>
          <Ionicons
            name="search"
            size={width * 0.05}
            color="#aaa"
            style={{ marginLeft: width * 0.02 }}
          />
          <TextInput
            placeholder="Pesquisar produto..."
            style={styles.input}
            value={pesquisa}
            onChangeText={setPesquisa}
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity style={styles.iconButton}>
          <MaterialCommunityIcons
            name="qrcode-scan"
            size={width * 0.06}
            color="#333"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setModalFiltroVisible(true)}
        >
          <Ionicons
            name="filter-outline"
            size={width * 0.06}
            color="#333"
          />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Carregando produtos...</Text>
        </View>
      ) : produtosFiltrados.length > 0 ? (
        <FlatList
          data={produtosFiltrados}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={renderProdutoCard}
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
          <Ionicons name="cube-outline" size={width * 0.2} color="#ccc" />
          <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
          <Text style={styles.emptySubtext}>
            {pesquisa || filtroNome ? 'Tente buscar com outros termos' : 'Cadastre seu primeiro produto'}
          </Text>
        </View>
      )}

      {/* Modais */}
      {renderModalRetirada()}
      {renderModalEntrada()}
      {renderModalFiltro()}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CadastroProduto')}
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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: height * 0.01,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: width * 0.02,
    paddingHorizontal: width * 0.01,
    height: height * 0.06,
  },
  input: {
    flex: 1,
    marginLeft: width * 0.01,
    fontSize: width * 0.04,
    height: '100%',
  },
  iconButton: {
    padding: width * 0.025,
    backgroundColor: '#eaeaea',
    borderRadius: width * 0.02,
    marginLeft: width * 0.01,
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
  cardInfo: {
    flex: 1,
  },
  cardNome: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.005,
  },
  cardDetalhes: {
    fontSize: width * 0.035,
    color: '#666',
    marginBottom: height * 0.003,
  },
  cardCategoria: {
    fontSize: width * 0.033,
    color: '#888',
  },
  cardActions: {
    flexDirection: 'row',
    gap: width * 0.02,
  },
  actionButton: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.02,
    alignItems: 'center',
    justifyContent: 'center',
  },
  entradaButton: {
    backgroundColor: '#4CAF50',
  },
  retiradaButton: {
    backgroundColor: '#f44336',
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
  // Modais
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
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: width * 0.02,
    padding: width * 0.04,
    fontSize: width * 0.04,
    marginBottom: height * 0.02,
  },
  modalButton: {
    flex: 1,
    paddingVertical: height * 0.02,
    borderRadius: width * 0.02,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  clearButton: {
    backgroundColor: '#ff9800',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  produtoSelecionadoText: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    marginBottom: height * 0.01,
  },
  estoqueAtualText: {
    fontSize: width * 0.04,
    color: '#666',
    marginBottom: height * 0.03,
  },
  // Filtros
  filterSwitch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: height * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: height * 0.02,
  },
  filterSwitchText: {
    fontSize: width * 0.04,
    color: '#333',
    flex: 1,
  },
  switch: {
    width: width * 0.1,
    height: width * 0.05,
    borderRadius: width * 0.025,
    justifyContent: 'center',
    paddingHorizontal: width * 0.005,
  },
  switchOn: {
    backgroundColor: '#4CAF50',
  },
  switchOff: {
    backgroundColor: '#ccc',
  },
  switchKnob: {
    width: width * 0.04,
    height: width * 0.04,
    borderRadius: width * 0.02,
  },
  switchKnobOn: {
    backgroundColor: '#fff',
    alignSelf: 'flex-end',
  },
  switchKnobOff: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  filterSectionTitle: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    marginTop: height * 0.02,
    marginBottom: height * 0.01,
  },
  filterScroll: {
    marginBottom: height * 0.02,
  },
  filterChip: {
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.01,
    borderRadius: width * 0.02,
    backgroundColor: '#f0f0f0',
    marginRight: width * 0.02,
  },
  filterChipSelected: {
    backgroundColor: '#4CAF50',
  },
  filterChipText: {
    fontSize: width * 0.035,
    color: '#333',
  },
  filterChipTextSelected: {
    color: '#fff',
  },
});
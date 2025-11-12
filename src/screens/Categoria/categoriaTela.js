import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Alert,
  FlatList,
  ScrollView,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';

const { width, height } = Dimensions.get('window');

export default function CategoriaTela({ navigation }) {
  const [modalDetalhesVisible, setModalDetalhesVisible] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [produtosDaCategoria, setProdutosDaCategoria] = useState([]);
  const [pesquisa, setPesquisa] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Buscar categorias da API
  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const response = await api.get('/categoria/');
      setCategorias(response.data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      Alert.alert('Erro', 'Não foi possível carregar as categorias');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Buscar produtos de uma categoria específica
  // Buscar produtos de uma categoria específica - VERSÃO DEBUG
  const fetchProdutosDaCategoria = async (categoriaId) => {
    try {
      console.log('🔍 [DEBUG] Iniciando busca de produtos para categoria...');
      console.log('🎯 Categoria ID recebida:', categoriaId, 'Tipo:', typeof categoriaId);

      const response = await api.get('/produto/');
      const todosProdutos = response.data || [];

      console.log('📦 Total de produtos na API:', todosProdutos.length);

      // DEBUG: Mostrar TODOS os produtos e suas categorias
      console.log('📝 [DEBUG] ESTRUTURA COMPLETA DOS PRODUTOS:');
      todosProdutos.forEach((produto, index) => {
        console.log(`   Produto ${index}:`, {
          id: produto.id,
          nome: produto.nome,
          categoria: produto.categoria,
          categoriaId: produto.categoria?.id,
          tipoCategoriaId: typeof produto.categoria?.id,
          categoriaNome: produto.categoria?.nome
        });
      });

      // Filtro SUPER robusto
      const produtosFiltrados = todosProdutos.filter(produto => {
        if (!produto || !produto.categoria) {
          console.log(`   ❌ Produto "${produto?.nome}" sem categoria`);
          return false;
        }

        const produtoCategoriaId = produto.categoria.id;
        console.log(`   🔄 Comparando: Produto "${produto.nome}" (Categoria ID: ${produtoCategoriaId}, Tipo: ${typeof produtoCategoriaId}) com Categoria Selecionada: ${categoriaId} (Tipo: ${typeof categoriaId})`);

        // Múltiplas estratégias de comparação
        const matchExato = produtoCategoriaId === categoriaId;
        const matchString = String(produtoCategoriaId) === String(categoriaId);
        const matchNumber = Number(produtoCategoriaId) === Number(categoriaId);
        const matchLoose = produtoCategoriaId == categoriaId; // == comparação flexível

        console.log(`   📊 Resultados: Exato: ${matchExato}, String: ${matchString}, Number: ${matchNumber}, Loose: ${matchLoose}`);

        if (matchExato || matchString || matchNumber || matchLoose) {
          console.log(`   ✅ ENCONTRADO: "${produto.nome}" pertence à categoria!`);
          return true;
        }

        return false;
      });

      console.log('🎉 [RESULTADO] Produtos encontrados:', produtosFiltrados.length);
      console.log('📋 Lista de produtos encontrados:', produtosFiltrados.map(p => p.nome));

      setProdutosDaCategoria(produtosFiltrados);

    } catch (error) {
      console.error('💥 Erro ao carregar produtos da categoria:', error);
      setProdutosDaCategoria([]);
    }
  };
  /*
  // SOLUÇÃO DE EMERGÊNCIA - Mostrar produtos manualmente
const fetchProdutosDaCategoria = async (categoriaId) => {
  try {
    console.log('🚨 MODO EMERGÊNCIA - Mostrando produtos de teste');
    
    // Dados de teste - REMOVA depois que funcionar
    const produtosTeste = [
      {
        id: 999,
        nome: 'PRODUTO TESTE - Bolo de Chocolate',
        estoqueAtual: 10,
        precoUnitarioVenda: 25.90,
        codigoDeBarras: 'TEST123'
      },
      {
        id: 998,
        nome: 'PRODUTO TESTE - Bolo de Cenoura',
        estoqueAtual: 5,
        precoUnitarioVenda: 22.50,
        codigoDeBarras: 'TEST124'
      }
    ];
    
    console.log('🎯 Mostrando produtos de teste para categoria:', categoriaId);
    setProdutosDaCategoria(produtosTeste);
    
  } catch (error) {
    console.error('Erro:', error);
    setProdutosDaCategoria([]);
  }
};
  */
  /*
   const fetchProdutosDaCategoria = async (categoriaId) => {
      try {
        const response = await api.get('/produto/');
        const todosProdutos = response.data;
        const produtosFiltrados = todosProdutos.filter(produto =>
          produto.categoria?.id === categoriaId
        );
        setProdutosDaCategoria(produtosFiltrados);
      } catch (error) {
        console.error('Erro ao carregar produtos da categoria:', error);
        setProdutosDaCategoria([]);
      }
    };
  */
  // Carregar categorias quando a tela abrir
  useEffect(() => {
    fetchCategorias();
  }, []);

  // Pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchCategorias();
  };

  // Filtrar categorias baseado na pesquisa
  const categoriasFiltradas = categorias.filter(categoria =>
    (categoria.nome || '').toLowerCase().includes(pesquisa.toLowerCase())
  );

  /*
  const abrirDetalhesCategoria = async (categoria) => {
    setCategoriaSelecionada(categoria);
    await fetchProdutosDaCategoria(categoria.id);
    setModalDetalhesVisible(true);
  };
*/

  // E modifique também a função abrirDetalhesCategoria para mais debug:
  const abrirDetalhesCategoria = async (categoria) => {
    console.log('🔄 [DEBUG] Abrindo detalhes da categoria:', categoria);
    console.log('🆔 ID da categoria clicada:', categoria.id, 'Tipo:', typeof categoria.id);
    console.log('📛 Nome da categoria:', categoria.nome);

    setCategoriaSelecionada(categoria);
    await fetchProdutosDaCategoria(categoria.id);
    setModalDetalhesVisible(true);
  };

  const handleEditarCategoria = () => {
    setModalDetalhesVisible(false);
    navigation.navigate('CadastroCategoria', {
      categoria: categoriaSelecionada,
      onCategoriaAtualizada: fetchCategorias
    });
  };

  // Excluir categoria via API
  const handleExcluirCategoria = async () => {
    Alert.alert(
      'Excluir Categoria',
      `Tem certeza que deseja excluir "${categoriaSelecionada.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/categoria/${categoriaSelecionada.id}`);
              setModalDetalhesVisible(false);
              fetchCategorias();
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

  // Renderizar card da categoria
  const renderCategoriaCard = ({ item }) => (
    <TouchableOpacity
      style={styles.categoriaCard}
      onPress={() => abrirDetalhesCategoria(item)}
    >
      <View style={styles.categoriaIcon}>
        <Ionicons name="folder-outline" size={width * 0.08} color="#4CAF50" />
      </View>
      <View style={styles.categoriaInfo}>
        <Text style={styles.categoriaNome} numberOfLines={2}>
          {item.nome || 'Sem nome'}
        </Text>
        <Text style={styles.categoriaQuantidade}>
          {item.quantidadeProdutos || '0'} produtos
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#666" />
    </TouchableOpacity>
  );

  // Renderizar card do produto na modal
  const renderProdutoCard = ({ item }) => (
    <View style={styles.produtoCardModal}>
      <View style={styles.produtoInfoModal}>
        <Text style={styles.produtoNomeModal} numberOfLines={1}>
          {item.nome || 'Sem nome'}
        </Text>
        <Text style={styles.produtoDetalhesModal}>
          Estoque: {item.estoqueAtual || 0} • R$ {item.precoUnitarioVenda?.toFixed(2) || '0.00'}
        </Text>
      </View>
    </View>
  );

  // Modal de detalhes da categoria
  const renderModalDetalhes = () => {
    if (!categoriaSelecionada) return null;

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
              <Text style={styles.modalDetalhesTitle}>Detalhes da Categoria</Text>
              <TouchableOpacity onPress={() => setModalDetalhesVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalDetalhesBody}>
              {/* Informações da categoria */}
              <View style={styles.detalhesTopo}>
                <View style={styles.categoriaIconGrande}>
                  <Ionicons name="folder-outline" size={width * 0.15} color="#4CAF50" />
                </View>
                <View style={styles.detalhesInfoBasica}>
                  <Text style={styles.detalhesNome}>{categoriaSelecionada.nome || 'Sem nome'}</Text>
                  <Text style={styles.detalhesQuantidade}>
                    {produtosDaCategoria.length} produtos nesta categoria
                  </Text>
                </View>
              </View>

              {/* Lista de produtos da categoria */}
              <View style={styles.detalhesSection}>
                <Text style={styles.detalhesSectionTitle}>
                  Produtos ({produtosDaCategoria.length})
                </Text>

                {produtosDaCategoria.length > 0 ? (
                  <FlatList
                    data={produtosDaCategoria}
                    keyExtractor={(item) => item.id?.toString()}
                    renderItem={renderProdutoCard}
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                  />
                ) : (
                  <View style={styles.emptyProdutos}>
                    <Ionicons name="cube-outline" size={width * 0.1} color="#ccc" />
                    <Text style={styles.emptyProdutosText}>
                      Nenhum produto nesta categoria
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>

            {/* Botões de ação */}
            <View style={styles.modalDetalhesFooter}>
              <TouchableOpacity
                style={[styles.botaoAcao, styles.botaoExcluir]}
                onPress={handleExcluirCategoria}
              >
                <Ionicons name="trash-outline" size={20} color="#fff" />
                <Text style={styles.botaoAcaoText}>Excluir</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.botaoAcao, styles.botaoEditar]}
                onPress={handleEditarCategoria}
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
          <Text style={styles.bold}>Categoria de Produto</Text>
        </Text>
      </TouchableOpacity>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={width * 0.05}
          color="#aaa"
          style={{ marginLeft: width * 0.02 }}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar categorias..."
          placeholderTextColor="#999"
          value={pesquisa}
          onChangeText={setPesquisa}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Carregando categorias...</Text>
        </View>
      ) : categoriasFiltradas.length > 0 ? (
        <FlatList
          data={categoriasFiltradas}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={renderCategoriaCard}
          contentContainerStyle={styles.listaContainer}
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
          <Ionicons name="folder-outline" size={width * 0.2} color="#ccc" />
          <Text style={styles.emptyText}>Nenhuma categoria encontrada</Text>
          <Text style={styles.emptySubtext}>
            {pesquisa ? 'Tente buscar com outros termos' : 'Cadastre sua primeira categoria usando o botão abaixo'}
          </Text>
        </View>
      )}

      {/* Modal de Detalhes */}
      {renderModalDetalhes()}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CadastroCategoria', { onCategoriaCriada: fetchCategorias })}
      >
        <Ionicons
          name="add"
          size={width * 0.08}
          color="#fff"
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
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: width * 0.02,
    marginVertical: height * 0.01,
    paddingHorizontal: width * 0.01,
    height: height * 0.06,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    marginLeft: width * 0.01,
    fontSize: width * 0.04,
  },
  listaContainer: {
    paddingBottom: height * 0.1,
  },
  categoriaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: width * 0.04,
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
  categoriaIcon: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.02,
    backgroundColor: '#f0f9f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: width * 0.04,
  },
  categoriaInfo: {
    flex: 1,
  },
  categoriaNome: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.005,
  },
  categoriaQuantidade: {
    fontSize: width * 0.035,
    color: '#666',
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
  fab: {
    position: 'absolute',
    bottom: height * 0.14,
    right: width * 0.05,
    backgroundColor: '#4CAF50',
    borderRadius: width * 0.075,
    width: width * 0.15,
    height: width * 0.15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Estilos do Modal de Detalhes
  modalDetalhesContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalDetalhesContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: width * 0.05,
    borderTopRightRadius: width * 0.05,
    maxHeight: height * 0.9,
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
  detalhesTopo: {
    flexDirection: 'row',
    marginBottom: height * 0.03,
  },
  categoriaIconGrande: {
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
  detalhesQuantidade: {
    fontSize: width * 0.035,
    color: '#666',
  },
  detalhesSection: {
    marginBottom: height * 0.02,
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
  produtoCardModal: {
    backgroundColor: '#f9f9f9',
    padding: width * 0.04,
    borderRadius: width * 0.02,
    marginBottom: height * 0.01,
    borderWidth: 1,
    borderColor: '#eee',
  },
  produtoInfoModal: {
    flex: 1,
  },
  produtoNomeModal: {
    fontSize: width * 0.038,
    fontWeight: '500',
    color: '#333',
    marginBottom: height * 0.003,
  },
  produtoDetalhesModal: {
    fontSize: width * 0.032,
    color: '#666',
  },
  emptyProdutos: {
    alignItems: 'center',
    paddingVertical: height * 0.03,
  },
  emptyProdutosText: {
    fontSize: width * 0.035,
    color: '#999',
    marginTop: height * 0.01,
    textAlign: 'center',
  },
  modalDetalhesFooter: {
    flexDirection: 'row',
    padding: width * 0.05,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: width * 0.03,
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
  botaoExcluir: {
    backgroundColor: '#FF6B6B',
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
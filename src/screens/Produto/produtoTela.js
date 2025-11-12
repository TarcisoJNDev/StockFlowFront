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
  Image,
  ScrollView,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, Camera } from 'expo-camera';
import api from '../../services/api'; // Importe apenas o api.js que já existe

const { width, height } = Dimensions.get('window');

export default function ProdutoTela({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDetalhesVisible, setModalDetalhesVisible] = useState(false);
  const [cameraType, setCameraType] = useState('back');
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [pesquisa, setPesquisa] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  // Carregar produtos quando a tela abrir
  useEffect(() => {
    fetchProdutos();
  }, []);

  // Solicitar permissão da câmera
  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  // Pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchProdutos();
  };

  // Filtrar produtos baseado na pesquisa
  const produtosFiltrados = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
    produto.codigoDeBarras.includes(pesquisa)
  );

  // Função chamada quando um QR Code é escaneado
  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    setModalVisible(false);
    processQRCodeData(data);
  };

  const processQRCodeData = (data) => {
    try {
      console.log('QR Code escaneado:', data);
      let productData;
      try {
        productData = JSON.parse(data);
      } catch {
        productData = { codigo: data };
      }

      Alert.alert(
        'QR Code Escaneado!',
        `Dados: ${typeof productData === 'object' ? JSON.stringify(productData) : productData}`,
        [
          {
            text: 'OK',
            onPress: () => {
              if (productData.codigo) {
                buscarProdutoPorCodigo(productData.codigo);
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Erro ao processar QR Code:', error);
      Alert.alert('Erro', 'Não foi possível processar o QR Code escaneado.');
    }
  };

  // Buscar produto por código na API
  const buscarProdutoPorCodigo = async (codigo) => {
    try {
      const response = await api.get(`/produto/codigo/${codigo}`);
      const produtoEncontrado = response.data;
      if (produtoEncontrado) {
        setProdutoSelecionado(produtoEncontrado);
        setModalDetalhesVisible(true);
      } else {
        Alert.alert(`'Produto não encontrado', Nenhum produto encontrado com código: ${codigo}`);
      }
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      Alert.alert('Erro', 'Produto não encontrado');
    }
  };

  const resetScanner = () => {
    setScanned(false);
  };

  const toggleCameraType = () => {
    setCameraType(cameraType === 'back' ? 'front' : 'back');
  };

  const abrirDetalhesProduto = (produto) => {
    setProdutoSelecionado(produto);
    setModalDetalhesVisible(true);
  };

  const handleEditarProduto = () => {
    setModalDetalhesVisible(false);
    // Navegar para tela de edição do produto
    navigation.navigate('CadastroProduto', {
      produto: produtoSelecionado,
      onProdutoAtualizado: fetchProdutos // Recarregar lista após edição
    });
  };

  // Excluir produto via API
  const handleExcluirProduto = async () => {
    Alert.alert(
      'Excluir Produto',
      `Tem certeza que deseja excluir "${produtoSelecionado.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/produto/${produtoSelecionado.id}`);
              setModalDetalhesVisible(false);
              // Recarregar lista após exclusão
              fetchProdutos();
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

  // Renderizar card do produto
  // No renderProdutoCard
  const renderProdutoCard = ({ item }) => (
    <TouchableOpacity
      style={styles.produtoCard}
      onPress={() => abrirDetalhesProduto(item)}
    >
      <Image
        source={{ uri: item.foto || 'https://via.placeholder.com/150x150/CCCCCC/FFFFFF?text=Sem+Imagem' }}
        style={styles.produtoImagem}
      // defaultSource={require('../../assets/placeholder-image.png')}
      />
      <View style={styles.produtoInfo}>
        <Text style={styles.produtoNome} numberOfLines={2}>
          {item.nome || 'Sem nome'} {/* Mude titulo para nome */}
        </Text>
        <Text style={styles.produtoQuantidade}>
          Quantidade: {item.estoqueAtual || 0} {/* Mude estoque para estoqueAtual */}
        </Text>
        <Text style={styles.produtoPreco}>
          R$ {item.precoUnitarioVenda?.toFixed(2) || '0.00'} {/* Mude preco para precoUnitarioVenda */}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#666" />
    </TouchableOpacity>
  );


  // Modal do leitor de QR Code
  const renderQRCodeModal = () => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
            <Ionicons name="close" size={width * 0.07} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Escaneie o QR Code</Text>
          <TouchableOpacity onPress={toggleCameraType} style={styles.flipButton}>
            <Ionicons name="camera-reverse" size={width * 0.06} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.cameraContainer}>
          {hasPermission === null ? (
            <View style={styles.permissionContainer}>
              <Text style={styles.permissionText}>Solicitando permissão da câmera...</Text>
            </View>
          ) : hasPermission === false ? (
            <View style={styles.permissionContainer}>
              <Ionicons name="camera-off" size={width * 0.15} color="#666" />
              <Text style={styles.permissionText}>Sem acesso à câmera</Text>
              <Text style={styles.permissionSubtext}>
                Para escanear QR Codes, permita o acesso à câmera nas configurações do app
              </Text>
            </View>
          ) : (
            <CameraView
              style={styles.camera}
              facing={cameraType}
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
              barcodeScannerSettings={{
                barcodeTypes: ["qr", "pdf417", "ean13", "ean8", "upc_e", "code39", "code128"]
              }}
            >
              <View style={styles.overlay}>
                <View style={styles.scanFrame}>
                  <View style={styles.cornerTopLeft} />
                  <View style={styles.cornerTopRight} />
                  <View style={styles.cornerBottomLeft} />
                  <View style={styles.cornerBottomRight} />
                </View>
                <Text style={styles.scanText}>Posicione o QR Code dentro do quadro</Text>
                {scanned && (
                  <TouchableOpacity style={styles.rescanButton} onPress={resetScanner}>
                    <Text style={styles.rescanText}>Escanear Novamente</Text>
                  </TouchableOpacity>
                )}
              </View>
            </CameraView>
          )}
        </View>

        <View style={styles.modalFooter}>
          <Text style={styles.footerText}>O QR Code será escaneado automaticamente</Text>
        </View>
      </View>
    </Modal>
  );

  // No modal de detalhes - ajuste TODOS os campos
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

            <ScrollView style={styles.modalDetalhesBody}>
              {/* Imagem e informações básicas */}
              <View style={styles.detalhesTopo}>
                <Image
                  source={{ uri: produtoSelecionado.foto || 'https://via.placeholder.com/150x150/CCCCCC/FFFFFF?text=Sem+Imagem' }}
                  style={styles.detalhesImagem}
                />
                <View style={styles.detalhesInfoBasica}>
                  <Text style={styles.detalhesNome}>{produtoSelecionado.nome || 'Sem nome'}</Text> {/* titulo → nome */}
                  <Text style={styles.detalhesQuantidade}>
                    Quantidade em estoque: {produtoSelecionado.estoqueAtual || 0} {/* estoque → estoqueAtual */}
                  </Text>
                  <Text style={styles.detalhesPreco}>
                    R$ {produtoSelecionado.precoUnitarioVenda?.toFixed(2) || '0.00'} {/* preco → precoUnitarioVenda */}
                  </Text>
                </View>
              </View>

              {/* Informações detalhadas */}
              <View style={styles.detalhesSection}>
                <Text style={styles.detalhesSectionTitle}>Informações do Produto</Text>

                <View style={styles.detalhesRow}>
                  <Text style={styles.detalhesLabel}>Código de Barras:</Text>
                  <Text style={styles.detalhesValue}>{produtoSelecionado.codigoDeBarras || 'N/A'}</Text>
                </View>

                <View style={styles.detalhesRow}>
                  <Text style={styles.detalhesLabel}>Descrição:</Text>
                  <Text style={styles.detalhesValue}>{produtoSelecionado.descricao || 'N/A'}</Text>
                </View>

                <View style={styles.detalhesRow}>
                  <Text style={styles.detalhesLabel}>Categoria:</Text>
                  <Text style={styles.detalhesValue}>{produtoSelecionado.categoria?.nome || 'N/A'}</Text>
                </View>

                <View style={styles.detalhesRow}>
                  <Text style={styles.detalhesLabel}>Fornecedor:</Text>
                  <Text style={styles.detalhesValue}>{produtoSelecionado.fornecedor?.nome || 'N/A'}</Text>
                </View>

                <View style={styles.detalhesRow}>
                  <Text style={styles.detalhesLabel}>Custo:</Text>
                  <Text style={styles.detalhesValue}>R$ {produtoSelecionado.custoCompra?.toFixed(2) || '0.00'}</Text> {/* custo → custoCompra */}
                </View>

                {/* REMOVA campos que não existem na entity */}
                {/* 
              <View style={styles.detalhesRow}>
                <Text style={styles.detalhesLabel}>Lucro:</Text>
                <Text style={styles.detalhesValue}>
                  {produtoSelecionado.lucroPercentual}% (R$ {produtoSelecionado.lucroReais?.toFixed(2) || '0.00'})
                </Text>
              </View>

              <View style={styles.detalhesRow}>
                <Text style={styles.detalhesLabel}>Estoque Mínimo:</Text>
                <Text style={styles.detalhesValue}>{produtoSelecionado.estoqueMinimo}</Text>
              </View>

              <View style={styles.detalhesRow}>
                <Text style={styles.detalhesLabel}>Unidade de Medida:</Text>
                <Text style={styles.detalhesValue}>{produtoSelecionado.unidadeMedida}</Text>
              </View>

              <View style={styles.detalhesRow}>
                <Text style={styles.detalhesLabel}>Venda Fracionada:</Text>
                <Text style={styles.detalhesValue}>
                  {produtoSelecionado.vendaFracionada ? 'Sim' : 'Não'}
                </Text>
              </View>

              <View style={styles.detalhesRow}>
                <Text style={styles.detalhesLabel}>No Catálogo:</Text>
                <Text style={styles.detalhesValue}>
                  {produtoSelecionado.mostrarCatalogo ? 'Sim' : 'Não'}
                </Text>
              </View>
              */}
              </View>
            </ScrollView>

            {/* Botões de ação */}
            <View style={styles.modalDetalhesFooter}>
              <TouchableOpacity
                style={[styles.botaoAcao, styles.botaoExcluir]}
                onPress={handleExcluirProduto}
              >
                <Ionicons name="trash-outline" size={20} color="#fff" />
                <Text style={styles.botaoAcaoText}>Excluir</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.botaoAcao, styles.botaoEditar]}
                onPress={handleEditarProduto}
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
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.voltar}>
        <Ionicons name="arrow-back" size={width * 0.06} color="black" />
        <Text style={styles.title}>
          Listar{"\n"}
          <Text style={styles.bold}>Produto</Text>
        </Text>
      </TouchableOpacity>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={width * 0.05} color="#aaa" style={{ marginLeft: width * 0.02 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar..."
          placeholderTextColor="#999"
          value={pesquisa}
          onChangeText={setPesquisa}
        />
        <TouchableOpacity style={styles.qrButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="qr-code-outline" size={width * 0.06} color="#777" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Carregando produtos...</Text>
        </View>
      ) : produtosFiltrados.length > 0 ? (
        <FlatList
          data={produtosFiltrados}
          keyExtractor={(item) => item.id}
          renderItem={renderProdutoCard}
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
          <Ionicons name="cube-outline" size={width * 0.2} color="#ccc" />
          <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
          <Text style={styles.emptySubtext}>
            {pesquisa ? 'Tente buscar com outros termos' : 'Cadastre seu primeiro produto usando o botão abaixo'}
          </Text>
        </View>
      )}

      {/* Modais */}
      {renderQRCodeModal()}
      {renderModalDetalhes()}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CadastroProduto', { onProdutoCriado: fetchProdutos })}
      >
        <Ionicons name="add" size={width * 0.08} color="#fff" />
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
  qrButton: {
    marginRight: width * 0.02,
    padding: width * 0.01,
  },
  listaContainer: {
    paddingBottom: height * 0.1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  produtoCard: {
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
  produtoImagem: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.02,
    marginRight: width * 0.04,
  },
  produtoInfo: {
    flex: 1,
  },
  produtoNome: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.005,
  },
  produtoQuantidade: {
    fontSize: width * 0.035,
    color: '#666',
    marginBottom: height * 0.003,
  },
  produtoPreco: {
    fontSize: width * 0.038,
    fontWeight: '600',
    color: '#4CAF50',
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
    bottom: height * 0.03,
    right: width * 0.05,
    backgroundColor: '#4CAF50',
    borderRadius: width * 0.075,
    width: width * 0.15,
    height: width * 0.15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
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
  detalhesImagem: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: width * 0.02,
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
    marginBottom: height * 0.005,
  },
  detalhesPreco: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#4CAF50',
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
  detalhesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: height * 0.015,
  },
  detalhesLabel: {
    fontSize: width * 0.035,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },
  detalhesValue: {
    fontSize: width * 0.035,
    color: '#333',
    flex: 1,
    textAlign: 'right',
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
  // Estilos do Modal do QR Code (mantidos do código anterior)
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: width * 0.05,
    paddingTop: height * 0.05,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalTitle: {
    color: '#fff',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: width * 0.02,
  },
  flipButton: {
    padding: width * 0.02,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: width * 0.1,
  },
  permissionText: {
    color: '#fff',
    fontSize: width * 0.045,
    textAlign: 'center',
    marginTop: height * 0.02,
  },
  permissionSubtext: {
    color: '#ccc',
    fontSize: width * 0.035,
    textAlign: 'center',
    marginTop: height * 0.01,
    lineHeight: height * 0.025,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: width * 0.7,
    height: width * 0.7,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 30,
    height: 30,
    borderLeftWidth: 4,
    borderTopWidth: 4,
    borderColor: '#4CAF50',
  },
  cornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderColor: '#4CAF50',
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 30,
    height: 30,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderColor: '#4CAF50',
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderColor: '#4CAF50',
  },
  scanText: {
    color: '#fff',
    fontSize: width * 0.04,
    marginTop: height * 0.05,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: width * 0.03,
    borderRadius: width * 0.02,
  },
  rescanButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: width * 0.06,
    paddingVertical: height * 0.015,
    borderRadius: width * 0.02,
    marginTop: height * 0.03,
  },
  rescanText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  modalFooter: {
    padding: width * 0.05,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
  },
  footerText: {
    color: '#ccc',
    fontSize: width * 0.035,
    textAlign: 'center',
  },
});
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Image,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Alert,
  ActivityIndicator
} from 'react-native';
import { TextInput, Button, IconButton } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import api from '../../services/api';

export default function CadastroProduto({ navigation }) {

  const [codigoDeBarras, setCodigoDeBarras] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [custo, setCusto] = useState('');
  const [fornecedores, setFornecedores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [showFornecedores, setShowFornecedores] = useState(false);
  const [showCategorias, setShowCategorias] = useState(false);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState(null);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [preco, setPreco] = useState('');
  const [lucroPercentual, setLucroPercentual] = useState('');
  const [lucroReais, setLucroReais] = useState('');
  const [estoque, setEstoque] = useState('');
  const [estoqueMinimo, setEstoqueMinimo] = useState('');
  const [mostrarCatalogo, setMostrarCatalogo] = useState(false);
  const [qtdMinimaCompra, setQtdMinimaCompra] = useState('');
  const [vendaFracionada, setVendaFracionada] = useState(false);
  const [unidadeMedida, setUnidadeMedida] = useState('');
  const [showUnidadesMedida, setShowUnidadesMedida] = useState(false);
  const [foto, setFoto] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const responseFornecedores = await api.get('/fornecedor/');
        setFornecedores(responseFornecedores.data);

        const responseCategorias = await api.get('/categoria/');
        setCategorias(responseCategorias.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    carregarDados();
  }, []);

  useEffect(() => {
    if (custo && preco) {
      const custoNum = parseFloat(custo.replace('.', '').replace(',', '.'));
      const precoNum = parseFloat(preco.replace('.', '').replace(',', '.'));

      if (custoNum > 0 && precoNum > 0) {
        const lucroEmReais = precoNum - custoNum;
        setLucroReais(lucroEmReais.toFixed(2).replace('.', ','));

        const lucroPercent = ((precoNum - custoNum) / custoNum) * 100;
        setLucroPercentual(lucroPercent.toFixed(2).replace('.', ','));
      }
    } else {
      setLucroReais('');
      setLucroPercentual('');
    }
  }, [custo, preco]);


  const slideAnim = useRef(new Animated.Value(1000)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const unidadesMedida = [
    { id: 1, nome: 'Unidade (un)' },
    { id: 2, nome: 'Quilograma (kg)' },
    { id: 3, nome: 'Grama (g)' },
    { id: 4, nome: 'Litro (L)' },
    { id: 5, nome: 'Mililitro (mL)' },
    { id: 6, nome: 'Metro (m)' },
    { id: 7, nome: 'Centímetro (cm)' },
    { id: 8, nome: 'Milímetro (mm)' },
    { id: 9, nome: 'Caixa (cx)' },
    { id: 10, nome: 'Pacote (pc)' },
    { id: 11, nome: 'Fardo (fd)' },
    { id: 12, nome: 'Dúzia (dz)' },
  ];

  const selecionarFoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos da permissão para acessar suas fotos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setFoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem');
    }
  };

  const cadastrarProduto = async () => {
    try {
      setLoading(true);

      if (!titulo) {
        Alert.alert('Atenção', 'Por favor, informe o título do produto');
        return;
      }

      if (!custo) {
        Alert.alert('Atenção', 'Por favor, informe o custo do produto');
        return;
      }

      if (!preco) {
        Alert.alert('Atenção', 'Por favor, informe o preço do produto');
        return;
      }

      const dadosProduto = {
        nome: titulo,
        codigoDeBarras: codigoDeBarras.replace(/\D/g, ''),
        descricao: descricao || null,
        custoCompra: parseFloat(custo.replace(',', '.')),
        precoUnitario: parseFloat(preco.replace(',', '.')),
        precoUnitarioVenda: parseFloat(preco.replace(',', '.')),
        estoqueAtual: parseInt(estoque) || 0,
        foto: foto || null
      };
      const response = await api.post('/produto/', dadosProduto);

      Animated.timing(slideAnim, {
        toValue: 1000,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        Alert.alert('Sucesso', 'Produto cadastrado com sucesso!', [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]);
      });

    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);

      let errorMessage = 'Falha ao cadastrar produto';
      if (error.response) {
        if (error.response.status === 409) {
          errorMessage = 'Código de barras já cadastrado';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      }

      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const formatCurrency = (value) => {
    let cleaned = value.replace(/\D/g, '');

    if (cleaned.length === 0) return '';

    cleaned = cleaned.padStart(3, '0');

    const reais = cleaned.slice(0, -2);
    const centavos = cleaned.slice(-2);

    const formattedReais = reais.length > 0
      ? parseInt(reais).toLocaleString('pt-BR')
      : '0';

    return (`${formattedReais},${centavos}`);
  };


  return (
    <SafeAreaView style={styles.overlay}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>

          <View style={styles.header}>
            <Text style={styles.title}>Produtos</Text>
            <IconButton icon="close" size={24} onPress={() => navigation.goBack()} />
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Seção de Foto */}
            <View style={styles.imageRow}>
              {foto ? (
                <Image source={{ uri: foto }} style={styles.productImage} />
              ) : (
                <Image source={require('../../../assets/images/produtoExemplo.png')} style={styles.productImage} />
              )}
              <TouchableOpacity
                style={styles.addPhotoButton}
                onPress={selecionarFoto}
              >
                <Text style={styles.addPhotoText}>
                  {foto ? 'Alterar foto' : 'Adicionar foto'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Código de Barras */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                label="Código de Barras*"
                value={codigoDeBarras}
                onChangeText={setCodigoDeBarras}
                mode="outlined"
                style={[styles.input, { flex: 1 }]}
                keyboardType="numeric"
                activeOutlineColor="#4CAF50"
                outlineColor="#ccc"
                right={<TextInput.Icon icon="barcode-scan" />}
                autoComplete="off"
                autoCorrect={false}
              />
              <TouchableOpacity style={styles.qrButton}>
                <Icon name="qrcode-scan" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Título */}
            <TextInput
              label="Nome do Produto*"
              value={titulo}
              onChangeText={setTitulo}
              mode="outlined"
              style={styles.input}
              activeOutlineColor="#4CAF50"
              outlineColor="#ccc"
              right={<TextInput.Icon icon="package-variant" />}
              autoCapitalize="words"
            />

            {/* Descrição */}
            <TextInput
              label="Descrição"
              value={descricao}
              onChangeText={setDescricao}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={[styles.input, { height: 100 }]}
              activeOutlineColor="#4CAF50"
              outlineColor="#ccc"
              right={<TextInput.Icon icon="note-text-outline" />}
            />

            {/* Fornecedor */}
            <TouchableOpacity
              style={styles.selectInput}
              onPress={() => setShowFornecedores(!showFornecedores)}
            >
              <Text style={fornecedorSelecionado ? styles.selectTextSelected : styles.selectText}>
                {fornecedorSelecionado ? fornecedorSelecionado.nome : 'Selecione um fornecedor*'}
              </Text>
              <Feather
                name={showFornecedores ? "chevron-up" : "chevron-down"}
                size={20}
                color="#999"
              />
            </TouchableOpacity>

            {showFornecedores && (
              <View style={styles.dropdownContainer}>
                <ScrollView
                  style={styles.dropdownScroll}
                  nestedScrollEnabled={true}
                >
                  {fornecedores.map((fornecedor) => (
                    <TouchableOpacity
                      key={fornecedor.id}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setFornecedorSelecionado(fornecedor);
                        setShowFornecedores(false);
                      }}
                    >
                      <Text>{fornecedor.nome}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}


            {/* Categoria */}
            <TouchableOpacity
              style={styles.selectInput}
              onPress={() => setShowCategorias(!showCategorias)}
            >
              <Text style={categoriaSelecionada ? styles.selectTextSelected : styles.selectText}>
                {categoriaSelecionada ? categoriaSelecionada.nome : 'Selecione uma categoria*'}
              </Text>
              <Feather
                name={showCategorias ? "chevron-up" : "chevron-down"}
                size={20}
                color="#999"
              />
            </TouchableOpacity>

            {showCategorias && (
              <View style={styles.dropdownContainer}>
                <ScrollView
                  style={styles.dropdownScroll}
                  nestedScrollEnabled={true}
                >
                  {categorias.map((categoria) => (
                    <TouchableOpacity
                      key={categoria.id}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setCategoriaSelecionada(categoria);
                        setShowCategorias(false);
                      }}
                    >
                      <Text>{categoria.nome}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <TextInput
              label="Custo (R$)*"
              value={custo}
              onChangeText={(text) => {
                const formatted = formatCurrency(text);
                setCusto(formatted);
              }}
              mode="outlined"
              keyboardType="numeric"
              style={styles.input}
              activeOutlineColor="#4CAF50"
              outlineColor="#ccc"
              right={<TextInput.Icon icon="currency-usd" />}
            />

            <TextInput
              label="Preço (R$)*"
              value={preco}
              onChangeText={(text) => {
                const formatted = formatCurrency(text);
                setPreco(formatted);
              }}
              mode="outlined"
              keyboardType="numeric"
              style={styles.input}
              activeOutlineColor="#4CAF50"
              outlineColor="#ccc"
              right={<TextInput.Icon icon="currency-usd" />}
            />
            <TextInput
              label="Lucro (%)"
              value={lucroPercentual}
              mode="outlined"
              style={[styles.input, { flex: 1, marginRight: 0 }]}
              activeOutlineColor="#4CAF50"
              outlineColor="#ccc"
              right={<TextInput.Icon icon="percent" />}
              editable={false}
            />

            <TextInput
              label="Lucro (R$)"
              value={lucroReais}
              mode="outlined"
              style={[styles.input, { flex: 1, marginLeft: 0 }]}
              activeOutlineColor="#4CAF50"
              outlineColor="#ccc"
              right={<TextInput.Icon icon="currency-usd" />}
              editable={false}
            />

            {/* Estoque */}
            <View style={styles.row}>
              <TextInput
                label="Qtd. em estoque*"
                value={estoque}
                onChangeText={setEstoque}
                mode="outlined"
                keyboardType="numeric"
                style={[styles.input, { flex: 1, marginRight: 5 }]}
                activeOutlineColor="#4CAF50"
                outlineColor="#ccc"
                right={<TextInput.Icon icon="warehouse" />}
              />
              <TextInput
                label="Estoque mínimo*"
                value={estoqueMinimo}
                onChangeText={setEstoqueMinimo}
                mode="outlined"
                keyboardType="numeric"
                style={[styles.input, { flex: 1, marginLeft: 5 }]}
                activeOutlineColor="#4CAF50"
                outlineColor="#ccc"
                right={<TextInput.Icon icon="alert-outline" />}
              />
            </View>

            {/* Mostrar no catálogo */}
            <View style={styles.switchRow}>
              <Text style={styles.label}>Mostrar no catálogo?</Text>
              <Switch
                value={mostrarCatalogo}
                onValueChange={setMostrarCatalogo}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={mostrarCatalogo ? "#4CAF50" : "#f4f3f4"}
              />
            </View>

            {/* Quantidade mínima */}
            <TextInput
              label="Qtd. mínima para compra no catálogo"
              value={qtdMinimaCompra}
              onChangeText={setQtdMinimaCompra}
              mode="outlined"
              keyboardType="numeric"
              style={styles.input}
              activeOutlineColor="#4CAF50"
              outlineColor="#ccc"
              right={<TextInput.Icon icon="cart-outline" />}
            />

            {/* Venda fracionada */}
            <View style={styles.switchRow}>
              <Text style={styles.label}>Venda fracionada?</Text>
              <Switch
                value={vendaFracionada}
                onValueChange={setVendaFracionada}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={vendaFracionada ? "#4CAF50" : "#f4f3f4"}
              />
            </View>

            {/* Unidade de medida (condicional) */}
            {vendaFracionada && (
              <View style={styles.unidadeMedidaContainer}>
                <TouchableOpacity
                  style={styles.selectInput}
                  onPress={() => setShowUnidadesMedida(!showUnidadesMedida)}
                >
                  <Text style={unidadeMedida ? styles.selectTextSelected : styles.selectText}>
                    {unidadeMedida || 'Selecione a unidade de medida'}
                  </Text>
                  <Feather
                    name={showUnidadesMedida ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#999"
                  />
                </TouchableOpacity>

                {showUnidadesMedida && (
                  <View style={styles.dropdownContainer}>
                    <ScrollView
                      style={styles.dropdownScroll}
                      nestedScrollEnabled={true} // Importante para ScrollView dentro de outro ScrollView
                    >
                      {unidadesMedida.map((item) => (
                        <TouchableOpacity
                          key={item.id}
                          style={styles.dropdownItem}
                          onPress={() => {
                            setUnidadeMedida(item.nome);
                            setShowUnidadesMedida(false);
                          }}
                        >
                          <Text>{item.nome}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            )}

            {/* Botão de Salvar */}
            <Button
              mode="contained"
              onPress={cadastrarProduto}
              style={styles.button}
              buttonColor="#4CAF50"
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                'Salvar Produto'
              )}
            </Button>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView >
  );
}

// Estilos (mantidos os mesmos)
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(120, 120, 120, 0.4)',
    justifyContent: 'flex-end',
    paddingTop: 90,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    maxHeight: '100%',
    height: '100%',
  },
  scrollContent: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  input: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: '#000',
  },
  selectInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
  },
  selectText: {
    fontSize: 16,
    color: '#000',
  },
  button: {
    marginTop: 20,
    padding: 8,
    borderRadius: 8,
  },
  imageRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  productImage: {
    width: 130,
    height: 160,
    borderRadius: 12,
    marginRight: 10,
    marginBottom: 8,
  },
  addPhotoButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 21,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addPhotoText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  qrButton: {
    marginLeft: 8,
    marginBottom: 5,
    backgroundColor: 'rgb(87, 87, 87)',
    padding: 12,
    borderRadius: 6,
  },
  unidadeMedidaContainer: {
    marginBottom: 12,
    zIndex: 1,
  },
  selectInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 10,
    padding: 14,
  },
  selectText: {
    fontSize: 16,
    color: '#555',
  },
  selectTextSelected: {
    fontSize: 16,
    color: '#000',
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    maxHeight: 200,
    elevation: 3,
    zIndex: 2,
  },
  dropdownScroll: {
    flexGrow: 1,
  },
  dropdownContainer: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: '#fff',
    marginTop: 4,
    elevation: 3,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
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
import api from '../services/api';

export default function CadastroProduto({ navigation }) {
  // Estados dos campos do formulário
  const [codigoDeBarras, setCodigoDeBarras] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [custo, setCusto] = useState('');
  const [preco, setPreco] = useState('');
  const [lucroPercentual, setLucroPercentual] = useState('');
  const [lucroReais, setLucroReais] = useState('');
  const [estoque, setEstoque] = useState('');
  const [estoqueMinimo, setEstoqueMinimo] = useState('');
  const [mostrarCatalogo, setMostrarCatalogo] = useState(false);
  const [qtdMinimaCompra, setQtdMinimaCompra] = useState('');
  const [vendaFracionada, setVendaFracionada] = useState(false);
  const [unidadeMedida, setUnidadeMedida] = useState('');
  const [foto, setFoto] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Animação
  const slideAnim = useRef(new Animated.Value(1000)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Função para selecionar foto
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

  // Função assíncrona para cadastrar produto
  const cadastrarProduto = async () => {
    try {
      setLoading(true);

      // Formata os dados antes de enviar
      const dadosProduto = {
        codigo_de_barras: codigoDeBarras.replace(/\D/g, ''),
        titulo,
        descricao,
        custo: parseFloat(custo.replace(',', '.')),
        preco: parseFloat(preco.replace(',', '.')),
        estoque: parseInt(estoque),
        estoque_minimo: parseInt(estoqueMinimo),
        mostrar_catalogo: mostrarCatalogo,
        venda_fracionada: vendaFracionada,
        unidade_medida: vendaFracionada ? unidadeMedida : null,
        qtd_minima_compra: qtdMinimaCompra ? parseInt(qtdMinimaCompra) : null,
        foto: foto ? foto : null
      };

      // Validações básicas
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

      // Versão para teste (apenas log)
      console.log("📤 Dados do produto:", dadosProduto);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simula delay

      // Versão real (descomente quando tiver o endpoint)
      // const response = await api.post('/produtos', dadosProduto);
      // console.log('Produto cadastrado:', response.data);

      Alert.alert('Sucesso', 'Produto cadastrado com sucesso!');
      navigation.goBack();

    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
      Alert.alert('Erro', error.response?.data?.message || 'Falha ao cadastrar produto');
    } finally {
      setLoading(false);
    }
  };

  // Funções de formatação
  const formatCurrency = (text) => {
    const cleaned = text.replace(/\D/g, '');
    let formattedText = '';
    
    if (cleaned.length > 0) {
      // Converte para formato de moeda (ex: 1234 -> 12,34)
      const reais = cleaned.slice(0, -2) || '0';
      const centavos = cleaned.slice(-2).padStart(2, '0');
      formattedText = (`${reais},${centavos}`);
      
      // Remove zeros à esquerda
      formattedText = formattedText.replace(/^0+/, '');
      if (formattedText.startsWith(',')) formattedText = '0' + formattedText;
    }
    
    return formattedText;
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
                <Image source={require('../../assets/produtoExemplo.png')} style={styles.productImage} />
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
            <TouchableOpacity style={styles.selectInput}>
              <Text style={styles.selectText}>Fornecedor*</Text>
              <Feather name="chevron-down" size={20} color="#999" />
            </TouchableOpacity>

            {/* Categoria */}
            <TouchableOpacity style={styles.selectInput}>
              <Text style={styles.selectText}>Categoria*</Text>
              <Feather name="chevron-down" size={20} color="#999" />
            </TouchableOpacity>

            {/* Custo */}
            <TextInput
              label="Custo (R$)*"
              value={custo}
              onChangeText={(text) => setCusto(formatCurrency(text))}
              mode="outlined"
              keyboardType="numeric"
              style={styles.input}
              activeOutlineColor="#4CAF50"
              outlineColor="#ccc"
              right={<TextInput.Icon icon="currency-usd" />}
            />

            {/* Preço */}
            <TextInput
              label="Preço (R$)*"
              value={preco}
              onChangeText={(text) => setPreco(formatCurrency(text))}
              mode="outlined"
              keyboardType="numeric"
              style={styles.input}
              activeOutlineColor="#4CAF50"
              outlineColor="#ccc"
              right={<TextInput.Icon icon="currency-usd" />}
            />

            {/* Lucro */}
            <View style={styles.row}>
              <TextInput
                label="Lucro (%)"
                value={lucroPercentual}
                onChangeText={setLucroPercentual}
                mode="outlined"
                keyboardType="numeric"
                style={[styles.input, { flex: 1, marginRight: 5 }]}
                activeOutlineColor="#4CAF50"
                outlineColor="#ccc"
                right={<TextInput.Icon icon="percent" />}
              />
              <TextInput
                label="Lucro (R$)"
                value={lucroReais}
                onChangeText={setLucroReais}
                mode="outlined"
                keyboardType="numeric"
                style={[styles.input, { flex: 1, marginLeft: 5 }]}
                activeOutlineColor="#4CAF50"
                outlineColor="#ccc"
                right={<TextInput.Icon icon="currency-usd" />}
              />
            </View>

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
              <TouchableOpacity style={styles.selectInput}>
                <Text style={styles.selectText}>
                  {unidadeMedida || 'Unidade de medida (Ex: kg, ml)'}
                </Text>
                <Feather name="chevron-down" size={20} color="#999" />
              </TouchableOpacity>
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
    </SafeAreaView>
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
});
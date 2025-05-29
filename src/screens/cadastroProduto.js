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
  Animated
} from 'react-native';
import { TextInput, Button, IconButton } from 'react-native-paper';
import { Feather, AntDesign } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CadastroProduto({ navigation }) {
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

  const slideAnim = useRef(new Animated.Value(1000)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSalvar = () => {
    const formData = {
      codigoDeBarras,
      titulo,
      descricao,
      custo,
      preco,
      lucroPercentual,
      lucroReais,
      estoque,
      estoqueMinimo,
      mostrarCatalogo,
      qtdMinimaCompra,
      vendaFracionada,
      unidadeMedida,
    };
    console.log(formData);
    navigation.goBack();
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
            <View style={styles.imageRow}>
              <Image source={require('../../assets/produtoExemplo.png')} style={styles.productImage} />
              <TouchableOpacity style={styles.addPhotoButton}>
                <Text style={styles.addPhotoText}>Adicionar foto</Text>
              </TouchableOpacity>
            </View>

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
              />
              <TouchableOpacity style={styles.qrButton}>
                <Icon name="qrcode-scan" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <TextInput
              label="Título*"
              value={titulo}
              onChangeText={setTitulo}
              mode="outlined"
              style={styles.input}
              activeOutlineColor="#4CAF50"
              outlineColor="#ccc"
              right={<TextInput.Icon icon="format-title" />}
            />

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

            <TouchableOpacity style={styles.selectInput}>
              <Text style={styles.selectText}>Fornecedor*</Text>
              <Feather name="chevron-down" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.selectInput}>
              <Text style={styles.selectText}>Categoria*</Text>
              <Feather name="chevron-down" size={20} color="#999" />
            </TouchableOpacity>

            <TextInput
              label="Custo (R$)*"
              value={custo}
              onChangeText={setCusto}
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
              onChangeText={setPreco}
              mode="outlined"
              keyboardType="numeric"
              style={styles.input}
              activeOutlineColor="#4CAF50"
              outlineColor="#ccc"
              right={<TextInput.Icon icon="currency-usd" />}
            />

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

            <View style={styles.switchRow}>
              <Text style={styles.label}>Mostrar no catálogo?</Text>
              <Switch value={mostrarCatalogo} onValueChange={setMostrarCatalogo} />
            </View>

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

            <View style={styles.switchRow}>
              <Text style={styles.label}>Venda fracionada?</Text>
              <Switch value={vendaFracionada} onValueChange={setVendaFracionada} />
            </View>

            {vendaFracionada && (
              <TouchableOpacity style={styles.selectInput}>
                <Text style={styles.selectText}>{unidadeMedida || 'Unidade de medida (Ex: kg, ml)'}</Text>
                <Feather name="chevron-down" size={20} color="#999" />
              </TouchableOpacity>
            )}

            <Button
              mode="contained"
              onPress={handleSalvar}
              style={styles.button}
              buttonColor="#4CAF50"
            >
              Salvar Produto
            </Button>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

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
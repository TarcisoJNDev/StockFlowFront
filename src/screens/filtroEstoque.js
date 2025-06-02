import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  TextInput
} from 'react-native';
import { IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

export default function FiltroEstoque({ 
  visible, 
  onClose, 
  onPesquisar, 
  onLimpar, 
  navigation,
  fornecedores = [], // Lista de fornecedores do seu backend
  categorias = []    // Lista de categorias do seu backend
}) {
  const [baixoEstoque, setBaixoEstoque] = useState('');
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [visivelCatalogo, setVisivelCatalogo] = useState('');
  
  const [showBaixoEstoque, setShowBaixoEstoque] = useState(false);
  const [showFornecedores, setShowFornecedores] = useState(false);
  const [showCategorias, setShowCategorias] = useState(false);
  const [showVisivelCatalogo, setShowVisivelCatalogo] = useState(false);

  const opcoesSimNao = ['Sim', 'Não'];
  const opcoesVisivelCatalogo = ['Sim', 'Não', 'Todos'];

  const handleLimpar = () => {
    setBaixoEstoque('');
    setFornecedorSelecionado('');
    setCategoriaSelecionada('');
    setVisivelCatalogo('');
    if (onLimpar) onLimpar();
  };

  const handlePesquisar = () => {
    const filtros = {
      baixoEstoque,
      fornecedor: fornecedorSelecionado,
      categoria: categoriaSelecionada,
      visivelCatalogo
    };
    if (onPesquisar) onPesquisar(filtros);
    if (onClose) onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.overlay}>
          <View style={styles.container}>
            <IconButton
              icon="close"
              size={width * 0.06}
              onPress={() => navigation.goBack()}
              style={styles.closeButton}
            />

            <Text style={styles.title}>Filtrar Estoque</Text>

            {/* Baixo Estoque */}
            <Text style={styles.label}>Baixo estoque</Text>
            <TouchableOpacity 
              onPress={() => setShowBaixoEstoque(!showBaixoEstoque)}
              style={styles.inputContainer}
            >
              <TextInput
                style={styles.input}
                placeholder="Selecione"
                value={baixoEstoque}
                editable={false}
                pointerEvents="none"
              />
              <Icon 
                name={showBaixoEstoque ? "chevron-up" : "chevron-down"} 
                size={width * 0.06} 
                color="#555" 
                style={styles.icon}
              />
            </TouchableOpacity>
            
            {showBaixoEstoque && (
              <View style={styles.dropdown}>
                <ScrollView>
                  {opcoesSimNao.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setBaixoEstoque(item);
                        setShowBaixoEstoque(false);
                      }}
                    >
                      <Text>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Fornecedores */}
            <Text style={styles.label}>Fornecedores</Text>
            <TouchableOpacity 
              onPress={() => setShowFornecedores(!showFornecedores)}
              style={styles.inputContainer}
            >
              <TextInput
                style={styles.input}
                placeholder="Selecione"
                value={fornecedorSelecionado}
                editable={false}
                pointerEvents="none"
              />
              <Icon 
                name={showFornecedores ? "chevron-up" : "chevron-down"} 
                size={width * 0.06} 
                color="#555" 
                style={styles.icon}
              />
            </TouchableOpacity>
            
            {showFornecedores && (
              <View style={styles.dropdown}>
                <ScrollView>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setFornecedorSelecionado('Todos');
                      setShowFornecedores(false);
                    }}
                  >
                    <Text>Todos</Text>
                  </TouchableOpacity>
                  {fornecedores.map((fornecedor) => (
                    <TouchableOpacity
                      key={fornecedor.id}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setFornecedorSelecionado(fornecedor.nome);
                        setShowFornecedores(false);
                      }}
                    >
                      <Text>{fornecedor.nome}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Categorias */}
            <Text style={styles.label}>Categorias</Text>
            <TouchableOpacity 
              onPress={() => setShowCategorias(!showCategorias)}
              style={styles.inputContainer}
            >
              <TextInput
                style={styles.input}
                placeholder="Selecione"
                value={categoriaSelecionada}
                editable={false}
                pointerEvents="none"
              />
              <Icon 
                name={showCategorias ? "chevron-up" : "chevron-down"} 
                size={width * 0.06} 
                color="#555" 
                style={styles.icon}
              />
            </TouchableOpacity>
            
            {showCategorias && (
              <View style={styles.dropdown}>
                <ScrollView>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setCategoriaSelecionada('Todas');
                      setShowCategorias(false);
                    }}
                  >
                    <Text>Todas</Text>
                  </TouchableOpacity>
                  {categorias.map((categoria) => (
                    <TouchableOpacity
                      key={categoria.id}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setCategoriaSelecionada(categoria.nome);
                        setShowCategorias(false);
                      }}
                    >
                      <Text>{categoria.nome}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Visível no catálogo */}
            <Text style={styles.label}>Visível no catálogo</Text>
            <TouchableOpacity 
              onPress={() => setShowVisivelCatalogo(!showVisivelCatalogo)}
              style={styles.inputContainer}
            >
              <TextInput
                style={styles.input}
                placeholder="Selecione"
                value={visivelCatalogo}
                editable={false}
                pointerEvents="none"
              />
              <Icon 
                name={showVisivelCatalogo ? "chevron-up" : "chevron-down"} 
                size={width * 0.06} 
                color="#555" 
                style={styles.icon}
              />
            </TouchableOpacity>
            
            {showVisivelCatalogo && (
              <View style={styles.dropdown}>
                <ScrollView>
                  {opcoesVisivelCatalogo.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setVisivelCatalogo(item);
                        setShowVisivelCatalogo(false);
                      }}
                    >
                      <Text>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Botões */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.limparButton]} 
                onPress={handleLimpar}
              >
                <Text style={styles.limparText}>Limpar Filtros</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, styles.pesquisarButton]} 
                onPress={handlePesquisar}
              >
                <Text style={styles.pesquisarText}>Pesquisar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    width: width * 0.9,
    backgroundColor: 'white',
    borderRadius: width * 0.05,
    padding: width * 0.05,
    alignSelf: 'center',
    maxHeight: height * 0.8,
  },
  closeButton: {
    position: 'absolute',
    right: width * 0.02,
    top: width * 0.02,
    zIndex: 1,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: height * 0.03,
    color: '#000',
    textAlign: 'center',
  },
  label: {
    marginTop: height * 0.01,
    marginBottom: height * 0.005,
    fontWeight: 'bold',
    color: '#333',
    fontSize: width * 0.04,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: width * 0.02,
    paddingHorizontal: width * 0.03,
    marginBottom: height * 0.01,
  },
  input: {
    flex: 1,
    padding: width * 0.03,
    fontSize: width * 0.04,
    color: '#000',
  },
  icon: {
    marginLeft: width * 0.02,
  },
  dropdown: {
    maxHeight: height * 0.2,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: width * 0.02,
    marginTop: -height * 0.01,
    marginBottom: height * 0.01,
    backgroundColor: 'white',
  },
  dropdownItem: {
    padding: width * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.03,
  },
  button: {
    flex: 1,
    padding: height * 0.015,
    borderRadius: width * 0.02,
    alignItems: 'center',
    justifyContent: 'center',
  },
  limparButton: {
    backgroundColor: '#f8d7da',
    marginRight: width * 0.02,
  },
  pesquisarButton: {
    backgroundColor: '#4CAF50',
    marginLeft: width * 0.02,
  },
  limparText: {
    color: '#c82333',
    fontWeight: 'bold',
    fontSize: width * 0.04,
  },
  pesquisarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: width * 0.04,
  },
});
import React, { useState } from 'react';
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
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function FiadoTela({ navigation }) {
  const [modalDespesaVisible, setModalDespesaVisible] = useState(false);
  const [modalEntradaVisible, setModalEntradaVisible] = useState(false);
  const [tipoModal, setTipoModal] = useState(''); // 'despesa' ou 'entrada'
  const [pesquisa, setPesquisa] = useState('');
  const [modalAberto, setModalAberto] = useState(false);

  const [formData, setFormData] = useState({
    titulo: '',
    valor: '',
    dataPagamento: '',
    categoria: '',
    fornecedor: '',
    recorrencia: '',
    observacao: '',
    status: 'pagar', // 'pagar' ou 'pago'
    formaPagamento: ''
  });

  // Opções de recorrência
  const opcoesRecorrencia = [
    'Não repete',
    'Diariamente (segunda a sexta)',
    'Todos os dias',
    'Semanal',
    'Quinzenal',
    'Mensal',
    'Trimestral'
  ];

  // Opções de forma de pagamento
  const formasPagamento = [
    'Dinheiro',
    'Pix',
    'Cheque',
    'Cartão de crédito',
    'Cartão de débito',
    'Boleto'
  ];

  const [recorrenciaModalVisible, setRecorrenciaModalVisible] = useState(false);
  const [formaPagamentoModalVisible, setFormaPagamentoModalVisible] = useState(false);

  // Dados fictícios para demonstração
  const [modalDetalhesVisible, setModalDetalhesVisible] = useState(false);
  const [lancamentoSelecionado, setLancamentoSelecionado] = useState(null);

  // Dados fictícios para demonstração (apenas 2 clientes como solicitado)
  const lancamentos = [
    {
      id: '1',
      nome: 'Cliente A',
      valor: 150.00,
      tipo: 'entrada',
      titulo: 'Antonio',
      total: 50.00,
      operacao: 'Entrada',
      fornecedor: 'Luiz Fornecedor',
      categoria: 'Pedidos',
      dataCadastro: '27/10/2025 10:58:23',
      dataPrevista: '30/10/2025',
      dataPagamento: '',
      formaPagamento: 'Outro',
      status: 'pagar', // 'pagar' ou 'pago'
      descricao: 'Esse lançamento ainda não foi pago. A data prevista para pagamento é 30/10/2025.'
    },
    {
      id: '2',
      nome: 'Cliente B',
      valor: 75.50,
      tipo: 'despesa',
      titulo: 'Despesa Mercado',
      total: 75.50,
      operacao: 'Despesa',
      fornecedor: 'Supermercado XYZ',
      categoria: 'Alimentação',
      dataCadastro: '26/10/2025 14:30:15',
      dataPrevista: '28/10/2025',
      dataPagamento: '27/10/2025',
      formaPagamento: 'Cartão de débito',
      status: 'pago',
      descricao: 'Esse lançamento foi pago em 27/10/2025.'
    },
  ];

  // Função para abrir modal de detalhes quando clicar no cliente
  const abrirModalDetalhes = (lancamento) => {
    setLancamentoSelecionado(lancamento);
    setModalAberto(true);
    setModalDetalhesVisible(true);
  };

  const abrirModal = (tipo) => {
    setTipoModal(tipo);
    setModalAberto(true);
    setFormData({
      titulo: '',
      valor: '',
      dataPagamento: '',
      categoria: '',
      fornecedor: '',
      recorrencia: '',
      observacao: '',
      status: 'pagar',
      formaPagamento: ''
    });

    if (tipo === 'despesa') {
      setModalDespesaVisible(true);
    } else {
      setModalEntradaVisible(true);
    }
  };



  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSalvar = () => {
    // Validação básica
    if (!formData.titulo || !formData.valor) {
      Alert.alert('Atenção', 'Preencha pelo menos título e valor');
      return;
    }

    // Se estiver como "pago", verificar forma de pagamento
    if (formData.status === 'pago' && !formData.formaPagamento) {
      Alert.alert('Atenção', 'Selecione a forma de pagamento');
      return;
    }

    // Aqui você faria a lógica para salvar os dados
    console.log('Dados do formulário:', formData);

    // Fecha o modal e limpa o formulário
    setModalDespesaVisible(false);
    setModalEntradaVisible(false);
    setModalAberto(false);
    setFormData({
      titulo: '',
      valor: '',
      dataPagamento: '',
      categoria: '',
      fornecedor: '',
      recorrencia: '',
      observacao: '',
      status: 'pagar',
      formaPagamento: ''
    });

    Alert.alert(`'Sucesso', ${tipoModal === 'despesa' ? 'Despesa' : 'Entrada'} cadastrada com sucesso!`);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => abrirModalDetalhes(item)}
    >
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.nome}</Text>
        <Text style={[
          styles.cardValue,
          item.tipo === 'despesa' ? styles.despesaValue : styles.entradaValue
        ]}>
          R$ {item.valor.toFixed(2)}
        </Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={width * 0.05}
        color="#666"
      />
    </TouchableOpacity>
  );

  const renderModal = (modalType) => {
    const isVisible = modalType === 'despesa' ? modalDespesaVisible : modalEntradaVisible;
    const setVisible = modalType === 'despesa' ? setModalDespesaVisible : setModalEntradaVisible;
    const tituloModal = modalType === 'despesa' ? 'Cadastrar Despesa' : 'Cadastrar Entrada';
    const corPrincipal = modalType === 'despesa' ? '#FF6B6B' : '#4CAF50';

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Header do Modal */}
            <View style={[styles.modalHeader, { borderBottomColor: corPrincipal }]}>
              <Text style={styles.modalTitle}>{tituloModal}</Text>
              <TouchableOpacity
                onPress={() => {
                  setVisible(false);
                  setModalAberto(false);
                }}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={width * 0.06} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer}>
              {/* Status Pago/Pagar */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Status</Text>
                <View style={styles.statusContainer}>
                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      styles.pagarButton,
                      formData.status === 'pagar' && { backgroundColor: corPrincipal }
                    ]}
                    onPress={() => handleInputChange('status', 'pagar')}
                  >
                    <Text style={[
                      styles.statusButtonText,
                      formData.status === 'pagar' && styles.statusButtonTextSelected
                    ]}>
                      A Pagar
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      styles.pagoButton,
                      formData.status === 'pago' && { backgroundColor: corPrincipal }
                    ]}
                    onPress={() => handleInputChange('status', 'pago')}
                  >
                    <Text style={[
                      styles.statusButtonText,
                      formData.status === 'pago' && styles.statusButtonTextSelected
                    ]}>
                      Pago
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forma de Pagamento (apenas se status for "pago") */}
              {formData.status === 'pago' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Forma de Pagamento *</Text>
                  <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={() => setFormaPagamentoModalVisible(true)}
                  >
                    <Text style={formData.formaPagamento ? styles.pickerTextSelected : styles.pickerText}>
                      {formData.formaPagamento || 'Selecione a forma de pagamento'}
                    </Text>
                    <Ionicons name="chevron-down" size={width * 0.05} color="#666" />
                  </TouchableOpacity>
                </View>
              )}

              {/* Título */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Título *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.titulo}
                  onChangeText={(text) => handleInputChange('titulo', text)}
                  placeholder="Digite o título"
                  placeholderTextColor="#999"
                />
              </View>

              {/* Valor */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Valor *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.valor}
                  onChangeText={(text) => handleInputChange('valor', text)}
                  placeholder="0,00"
                  placeholderTextColor="#999"
                  keyboardType="decimal-pad"
                />
              </View>

              {/* Data de Pagamento */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Data de Pagamento</Text>
                <TextInput
                  style={styles.input}
                  value={formData.dataPagamento}
                  onChangeText={(text) => handleInputChange('dataPagamento', text)}
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor="#999"
                />
              </View>

              {/* Categoria */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Categoria</Text>
                <TextInput
                  style={styles.input}
                  value={formData.categoria}
                  onChangeText={(text) => handleInputChange('categoria', text)}
                  placeholder="Pedido"
                  placeholderTextColor="#999"
                />
              </View>

              {/* Fornecedor */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Fornecedor</Text>
                <TextInput
                  style={styles.input}
                  value={formData.fornecedor}
                  onChangeText={(text) => handleInputChange('fornecedor', text)}
                  placeholder="Digite o fornecedor"
                  placeholderTextColor="#999"
                />
              </View>

              {/* Recorrência */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Recorrência</Text>
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() => setRecorrenciaModalVisible(true)}
                >
                  <Text style={formData.recorrencia ? styles.pickerTextSelected : styles.pickerText}>
                    {formData.recorrencia || 'Selecione a recorrência'}
                  </Text>
                  <Ionicons name="chevron-down" size={width * 0.05} color="#666" />
                </TouchableOpacity>
              </View>

              {/* Observação */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Observação</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.observacao}
                  onChangeText={(text) => handleInputChange('observacao', text)}
                  placeholder="Digite uma observação"
                  placeholderTextColor="#999"
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>

            {/* Botões do Modal */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setVisible(false);
                  setModalAberto(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: corPrincipal }]}
                onPress={handleSalvar}
              >
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderModalDetalhes = () => {
    if (!lancamentoSelecionado) return null;

    const {
      titulo,
      total,
      operacao,
      fornecedor,
      categoria,
      dataCadastro,
      dataPrevista,
      dataPagamento,
      formaPagamento,
      descricao,
      status
    } = lancamentoSelecionado;

    const corPrincipal = operacao === 'Despesa' ? '#FF6B6B' : '#4CAF50';

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalDetalhesVisible}
        onRequestClose={() => setModalDetalhesVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Header do Modal */}
            <View style={[styles.modalHeader, { borderBottomColor: corPrincipal }]}>
              <Text style={styles.modalTitle}>Lançamento Financeiro</Text>
              <TouchableOpacity
                onPress={() => {
                  setModalDetalhesVisible(false);
                  setModalAberto(false);
                }}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={width * 0.06} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer}>
              {/* Descrição */}
              <Text style={styles.descricaoText}>
                {descricao}
              </Text>

              {/* Título */}
              <View style={styles.detalheGroup}>
                <Text style={styles.detalheLabel}>Título</Text>
                <Text style={styles.detalheValorGrande}>{titulo}</Text>
              </View>

              {/* Linha divisória */}
              <View style={styles.divider} />

              {/* Total */}
              <View style={styles.detalheGroup}>
                <Text style={styles.detalheLabel}>Total</Text>
                <Text style={styles.detalheValorGrande}>R$ {total.toFixed(2)}</Text>
              </View>

              {/* Tabela de informações */}
              <View style={styles.tabela}>
                <View style={styles.linhaTabela}>
                  <Text style={styles.celulaLabel}>Operação</Text>
                  <Text style={[
                    styles.celulaValor,
                    operacao === 'Despesa' ? styles.despesaValue : styles.entradaValue
                  ]}>
                    {operacao}
                  </Text>
                </View>

                <View style={styles.linhaTabela}>
                  <Text style={styles.celulaLabel}>Fornecedor</Text>
                  <Text style={styles.celulaValor}>{fornecedor}</Text>
                </View>

                <View style={styles.linhaTabela}>
                  <Text style={styles.celulaLabel}>Categoria</Text>
                  <Text style={styles.celulaValor}>{categoria}</Text>
                </View>

                <View style={styles.linhaTabela}>
                  <Text style={styles.celulaLabel}>Data Cadastro</Text>
                  <Text style={styles.celulaValor}>{dataCadastro}</Text>
                </View>

                <View style={styles.linhaTabela}>
                  <Text style={styles.celulaLabel}>Data Prevista</Text>
                  <Text style={styles.celulaValor}>{dataPrevista}</Text>
                </View>

                <View style={styles.linhaTabela}>
                  <Text style={styles.celulaLabel}>Data Pagamento</Text>
                  <Text style={styles.celulaValor}>{dataPagamento || '-'}</Text>
                </View>

                <View style={styles.linhaTabela}>
                  <Text style={styles.celulaLabel}>Forma Pagamento</Text>
                  <Text style={styles.celulaValor}>{formaPagamento}</Text>
                </View>
              </View>

              {/* Linha divisória */}
              <View style={styles.divider} />

              {/* Botão de ação */}
              <TouchableOpacity
                style={[
                  styles.botaoAcao,
                  { backgroundColor: status === 'pago' ? '#4CAF50' : '#FF6B6B' }
                ]}
              >
                <Text style={styles.botaoAcaoText}>
                  {status === 'pago' ? 'Marcar como Pendente' : 'Marcar como Pago'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };
  // segunda parte

  return (
    <View style={styles.container}>
      {/* Header com botão voltar */}
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
          Débitos{"\n"}
          <Text style={styles.bold}>Fiado</Text>
        </Text>
      </TouchableOpacity>

      {/* Barra de pesquisa e filtro */}
      <View style={styles.searchFilterContainer}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={width * 0.05}
            color="#aaa"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Pesquisar..."
            style={styles.searchInput}
            placeholderTextColor="#999"
            value={pesquisa}
            onChangeText={setPesquisa}
          />
        </View>

        <TouchableOpacity style={styles.filtroButton}>
          <Ionicons
            name="filter"
            size={width * 0.05}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      {/* Texto informativo */}
      <Text style={styles.infoText}>
        Filtre por cliente para habilitar as opções de adicionar pagamento e gerar relatório
      </Text>

      {/* Lista de lançamentos */}
      <View style={styles.lancamentosSection}>
        <FlatList
          data={lancamentos}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Botões de ação fixos no bottom */}
      {!modalAberto && (
        <View style={styles.bottomButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.despesaButton]}
            onPress={() => abrirModal('despesa')}
          >
            <Text style={styles.actionButtonText}>Cadastrar Despesa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.entradaButton]}
            onPress={() => abrirModal('entrada')}
          >
            <Text style={styles.actionButtonText}>Cadastrar Entrada</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modais */}
      {renderModal('despesa')}
      {renderModal('entrada')}
      {/* Modal de Detalhes */}
      {renderModalDetalhes()}
      {/* Modal de Recorrência */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={recorrenciaModalVisible}
        onRequestClose={() => setRecorrenciaModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, styles.recorrenciaModal]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Recorrência</Text>
              <TouchableOpacity
                onPress={() => {
                  setRecorrenciaModalVisible(false);
                  setModalAberto(false);
                }}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={width * 0.06} color="#666" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={opcoesRecorrencia}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.recorrenciaItem,
                    formData.recorrencia === item && styles.recorrenciaItemSelected
                  ]}
                  onPress={() => {
                    handleInputChange('recorrencia', item);
                    setRecorrenciaModalVisible(false);
                  }}
                >
                  <Text style={[
                    styles.recorrenciaText,
                    formData.recorrencia === item && styles.recorrenciaTextSelected
                  ]}>
                    {item}
                  </Text>
                  {formData.recorrencia === item && (
                    <Ionicons name="checkmark" size={width * 0.05} color="#082C69" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Modal de Forma de Pagamento */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={formaPagamentoModalVisible}
        onRequestClose={() => setFormaPagamentoModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, styles.recorrenciaModal]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Forma de Pagamento</Text>
              <TouchableOpacity
                onPress={() => setFormaPagamentoModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={width * 0.06} color="#666" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={formasPagamento}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.recorrenciaItem,
                    formData.formaPagamento === item && styles.recorrenciaItemSelected
                  ]}
                  onPress={() => {
                    handleInputChange('formaPagamento', item);
                    setFormaPagamentoModalVisible(false);
                  }}
                >
                  <Text style={[
                    styles.recorrenciaText,
                    formData.formaPagamento === item && styles.recorrenciaTextSelected
                  ]}>
                    {item}
                  </Text>
                  {formData.formaPagamento === item && (
                    <Ionicons name="checkmark" size={width * 0.05} color="#082C69" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
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
  // Nova estrutura de pesquisa e filtro
  searchFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: width * 0.02,
    marginRight: width * 0.03,
    paddingHorizontal: width * 0.03,
    height: height * 0.06,
    backgroundColor: '#f9f9f9',
  },
  searchIcon: {
    marginRight: width * 0.02,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: width * 0.04,
  },
  filtroButton: {
    width: width * 0.12,
    height: height * 0.06,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: width * 0.02,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  infoText: {
    fontSize: width * 0.035,
    color: '#666',
    marginBottom: height * 0.03,
    lineHeight: height * 0.025,
    textAlign: 'center',
  },
  // Seção de lançamentos
  lancamentosSection: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: height * 0.02,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: width * 0.04,
    borderRadius: width * 0.02,
    marginBottom: height * 0.01,
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 1,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: width * 0.04,
    fontWeight: '500',
    color: '#333',
    marginBottom: height * 0.005,
  },
  cardValue: {
    fontSize: width * 0.035,
    fontWeight: '500',
  },
  despesaValue: {
    color: '#FF6B6B',
  },
  entradaValue: {
    color: '#4CAF50',
  },

  // Botões fixos no bottom
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: height * 0.02,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: "#fff"
  },
  actionButton: {
    flex: 1,
    paddingVertical: height * 0.02,
    marginBottom: height * 0.05,
    borderRadius: width * 0.02,
    alignItems: 'center',
    marginHorizontal: width * 0.01,
  },
  despesaButton: {
    backgroundColor: '#FF6B6B',
  },
  entradaButton: {
    backgroundColor: '#4CAF50',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: width * 0.035,
    fontWeight: 'bold',
  },
  // Estilos do Modal (mantidos iguais)
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
    borderBottomWidth: 2,
  },
  modalTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: width * 0.01,
  },
  formContainer: {
    padding: width * 0.05,
  },
  inputGroup: {
    marginBottom: height * 0.02,
  },
  label: {
    fontSize: width * 0.04,
    fontWeight: '500',
    color: '#333',
    marginBottom: height * 0.01,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: width * 0.02,
    padding: width * 0.04,
    fontSize: width * 0.04,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: height * 0.12,
    textAlignVertical: 'top',
  },
  statusContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: width * 0.02,
    overflow: 'hidden',
  },
  statusButton: {
    flex: 1,
    paddingVertical: height * 0.015,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  pagarButton: {
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  pagoButton: {
    borderLeftWidth: 1,
    borderLeftColor: '#ddd',
  },
  statusButtonText: {
    fontSize: width * 0.04,
    color: '#666',
    fontWeight: '500',
  },
  statusButtonTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: width * 0.02,
    padding: width * 0.04,
    backgroundColor: '#f9f9f9',
  },
  pickerText: {
    fontSize: width * 0.04,
    color: '#999',
  },
  pickerTextSelected: {
    fontSize: width * 0.04,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    padding: width * 0.03,
    borderTopWidth: 0.02,
    borderTopColor: '#eee',
  },
  modalButton: {
    flex: 1,
    paddingVertical: height * 0.02,
    borderRadius: width * 0.02,
    alignItems: 'center',
    marginHorizontal: width * 0.01,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  recorrenciaModal: {
    maxHeight: height * 0.6,
  },
  recorrenciaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: width * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  recorrenciaItemSelected: {
    backgroundColor: '#f0f7ff',
  },
  recorrenciaText: {
    fontSize: width * 0.04,
    color: '#333',
  },
  recorrenciaTextSelected: {
    color: '#082C69',
    fontWeight: '500',
  },
  // Estilos do Modal de Detalhes
  descricaoText: {
    fontSize: width * 0.035,
    color: '#666',
    lineHeight: height * 0.025,
    marginBottom: height * 0.03,
    textAlign: 'center',
  },
  detalheGroup: {
    marginBottom: height * 0.02,
  },
  detalheLabel: {
    fontSize: width * 0.04,
    color: '#666',
    marginBottom: height * 0.005,
  },
  detalheValorGrande: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: height * 0.03,
  },
  tabela: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: width * 0.02,
    overflow: 'hidden',
    marginBottom: height * 0.03,
  },
  linhaTabela: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
  celulaLabel: {
    flex: 1,
    padding: width * 0.04,
    fontSize: width * 0.035,
    fontWeight: '500',
    color: '#333',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  celulaValor: {
    flex: 1,
    padding: width * 0.04,
    fontSize: width * 0.035,
    color: '#666',
  },
  botaoAcao: {
    paddingVertical: height * 0.02,
    borderRadius: width * 0.02,
    alignItems: 'center',
  },
  botaoAcaoText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
});
// src/web/screens/FiadoWebTela.js
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    FlatList,
    Modal,
    Switch
} from 'react-native';

const FiadosWebScreen = () => {
    const [modoAtivo, setModoAtivo] = useState('entrada');
    const [modalVisivel, setModalVisivel] = useState(false);
    const [modalCriarVisivel, setModalCriarVisivel] = useState(false);
    const [itemSelecionado, setItemSelecionado] = useState(null);
    const [novoFiado, setNovoFiado] = useState({
        tipo: 'entrada',
        nome: '',
        produto: '',
        quantidade: '',
        valor: '',
        dataPagamento: '',
        formaPagamento: 'dinheiro',
        recorrencia: 'única',
        descricao: ''
    });

    // Dados de exemplo para fiados (entradas)
    const [fiados, setFiados] = useState([
        {
            id: 1,
            tipo: 'entrada',
            nome: 'João Silva',
            produto: 'COCA COLA 2L',
            quantidade: 5,
            valor: 42.50,
            dataPagamento: '2024-12-05',
            formaPagamento: 'dinheiro',
            recorrencia: 'mensal',
            descricao: 'Cliente fiel - pagamento sempre no dia 5',
            status: 'pendente'
        },
        {
            id: 2,
            tipo: 'entrada',
            nome: 'Maria Santos',
            produto: 'VIRGINIZIATO',
            quantidade: 2,
            valor: 25.80,
            dataPagamento: '2024-11-30',
            formaPagamento: 'pix',
            recorrencia: 'única',
            descricao: 'Primeira compra a prazo',
            status: 'pendente'
        }
    ]);

    // Dados de exemplo para despesas
    const [despesas, setDespesas] = useState([
        {
            id: 1,
            tipo: 'despesa',
            nome: 'Aluguel do Ponto',
            valor: 1500.00,
            dataPagamento: '2024-12-01',
            formaPagamento: 'transferência',
            recorrencia: 'mensal',
            descricao: 'Pagamento mensal do aluguel',
            status: 'pendente'
        },
        {
            id: 2,
            tipo: 'despesa',
            nome: 'Energia Elétrica',
            valor: 350.00,
            dataPagamento: '2024-11-25',
            formaPagamento: 'cartão',
            recorrencia: 'mensal',
            descricao: 'Conta de luz do mês',
            status: 'pendente'
        }
    ]);

    const abrirModal = (item) => {
        setItemSelecionado(item);
        setModalVisivel(true);
    };

    const fecharModal = () => {
        setModalVisivel(false);
        setItemSelecionado(null);
    };

    const abrirModalCriar = () => {
        setNovoFiado({
            tipo: modoAtivo,
            nome: '',
            produto: '',
            quantidade: '',
            valor: '',
            dataPagamento: '',
            formaPagamento: 'dinheiro',
            recorrencia: 'única',
            descricao: ''
        });
        setModalCriarVisivel(true);
    };

    const fecharModalCriar = () => {
        setModalCriarVisivel(false);
    };

    const handleCriarFiado = () => {
        // Validação básica
        if (!novoFiado.nome || !novoFiado.valor || !novoFiado.dataPagamento) {
            Alert.alert('Erro', 'Preencha os campos obrigatórios: Nome, Valor e Data de Pagamento');
            return;
        }

        const novoItem = {
            id: Date.now(),
            ...novoFiado,
            quantidade: novoFiado.quantidade || 1,
            status: 'pendente'
        };

        if (modoAtivo === 'entrada') {
            setFiados([...fiados, novoItem]);
        } else {
            setDespesas([...despesas, novoItem]);
        }

        Alert.alert('Sucesso', `${modoAtivo === 'entrada' ? 'Fiado' : 'Despesa'} criado com sucesso!`);
        fecharModalCriar();
    };

    const marcarComoPago = (id) => {
        if (modoAtivo === 'entrada') {
            setFiados(fiados.map(item =>
                item.id === id ? { ...item, status: 'pago' } : item
            ));
        } else {
            setDespesas(despesas.map(item =>
                item.id === id ? { ...item, status: 'pago' } : item
            ));
        }
        fecharModal();
        Alert.alert('Sucesso', 'Marcado como pago!');
    };

    const excluirItem = (id) => {
        Alert.alert(
            'Confirmar Exclusão',
            'Tem certeza que deseja excluir este item?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: () => {
                        if (modoAtivo === 'entrada') {
                            setFiados(fiados.filter(item => item.id !== id));
                        } else {
                            setDespesas(despesas.filter(item => item.id !== id));
                        }
                        fecharModal();
                        Alert.alert('Sucesso', 'Item excluído!');
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.cardItem,
                item.tipo === 'entrada' ? styles.cardEntrada : styles.cardDespesa,
                item.status === 'pago' && styles.itemPago
            ]}
            onPress={() => abrirModal(item)}
        >
            <View style={styles.itemHeader}>
                <Text style={styles.itemNome}>{item.nome}</Text>
                <View style={[
                    styles.statusBadge,
                    item.status === 'pago' ? styles.statusPago : styles.statusPendente
                ]}>
                    <Text style={styles.statusTexto}>
                        {item.status === 'pago' ? 'PAGO' : 'PENDENTE'}
                    </Text>
                </View>
            </View>

            <View style={styles.itemInfo}>
                {item.tipo === 'entrada' && (
                    <Text style={styles.itemProduto}>{item.produto} - {item.quantidade}x</Text>
                )}
                <Text style={styles.itemValor}>R$ {item.valor}</Text>
            </View>

            <View style={styles.itemFooter}>
                <Text style={styles.itemData}>Vence: {item.dataPagamento}</Text>
                <Text style={styles.itemRecorrencia}>{item.recorrencia}</Text>
            </View>
        </TouchableOpacity>
    );

    const dadosAtuais = modoAtivo === 'entrada' ? fiados : despesas;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>📝 Vendas a Prazo</Text>
                    <Text style={styles.subtitle}>Controle de fiados e despesas</Text>
                </View>
            </View>

            {/* Toggle de Modo */}
            <View style={styles.toggleContainer}>
                <TouchableOpacity
                    style={[
                        styles.toggleButton,
                        modoAtivo === 'entrada' && styles.toggleButtonAtivo
                    ]}
                    onPress={() => setModoAtivo('entrada')}
                >
                    <Text style={[
                        styles.toggleTexto,
                        modoAtivo === 'entrada' && styles.toggleTextoAtivo
                    ]}>
                        💰 Entradas (Fiados)
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.toggleButton,
                        modoAtivo === 'despesas' && styles.toggleButtonAtivoDespesas
                    ]}
                    onPress={() => setModoAtivo('despesas')}
                >
                    <Text style={[
                        styles.toggleTexto,
                        modoAtivo === 'despesas' && styles.toggleTextoAtivo
                    ]}>
                        💸 Despesas
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {/* Barra de Ações */}
                <View style={styles.barraAcoes}>
                    <Text style={styles.sectionTitle}>
                        {modoAtivo === 'entrada' ? 'Fiados Cadastrados' : 'Despesas Cadastradas'}
                        ({dadosAtuais.length})
                    </Text>
                    <TouchableOpacity
                        style={styles.botaoCriar}
                        onPress={abrirModalCriar}
                    >
                        <Text style={styles.botaoCriarTexto}>
                            + Criar {modoAtivo === 'entrada' ? 'Fiado' : 'Despesa'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Lista de Itens */}
                {dadosAtuais.length === 0 ? (
                    <View style={styles.vazioContainer}>
                        <Text style={styles.vazioTexto}>
                            Nenhum {modoAtivo === 'entrada' ? 'fiado' : 'despesa'} cadastrado
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={dadosAtuais}
                        renderItem={renderItem}
                        keyExtractor={item => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listaContainer}
                    />
                )}
            </View>

            {/* Modal de Detalhes */}
            <Modal
                visible={modalVisivel}
                animationType="slide"
                transparent={true}
                onRequestClose={fecharModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {itemSelecionado && (
                            <>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>
                                        {itemSelecionado.tipo === 'entrada' ? '📋 Detalhes do Fiado' : '📋 Detalhes da Despesa'}
                                    </Text>
                                    <TouchableOpacity onPress={fecharModal}>
                                        <Text style={styles.modalFechar}>✕</Text>
                                    </TouchableOpacity>
                                </View>

                                <ScrollView style={styles.modalBody}>
                                    <View style={styles.campoModal}>
                                        <Text style={styles.campoLabel}>Nome:</Text>
                                        <Text style={styles.campoValor}>{itemSelecionado.nome}</Text>
                                    </View>

                                    {itemSelecionado.tipo === 'entrada' && (
                                        <>
                                            <View style={styles.campoModal}>
                                                <Text style={styles.campoLabel}>Produto:</Text>
                                                <Text style={styles.campoValor}>{itemSelecionado.produto}</Text>
                                            </View>
                                            <View style={styles.campoModal}>
                                                <Text style={styles.campoLabel}>Quantidade:</Text>
                                                <Text style={styles.campoValor}>{itemSelecionado.quantidade}</Text>
                                            </View>
                                        </>
                                    )}

                                    <View style={styles.campoModal}>
                                        <Text style={styles.campoLabel}>Valor:</Text>
                                        <Text style={styles.campoValor}>R$ {itemSelecionado.valor}</Text>
                                    </View>

                                    <View style={styles.campoModal}>
                                        <Text style={styles.campoLabel}>Data de Pagamento:</Text>
                                        <Text style={styles.campoValor}>{itemSelecionado.dataPagamento}</Text>
                                    </View>

                                    <View style={styles.campoModal}>
                                        <Text style={styles.campoLabel}>Forma de Pagamento:</Text>
                                        <Text style={styles.campoValor}>{itemSelecionado.formaPagamento}</Text>
                                    </View>

                                    <View style={styles.campoModal}>
                                        <Text style={styles.campoLabel}>Recorrência:</Text>
                                        <Text style={styles.campoValor}>{itemSelecionado.recorrencia}</Text>
                                    </View>

                                    <View style={styles.campoModal}>
                                        <Text style={styles.campoLabel}>Descrição:</Text>
                                        <Text style={styles.campoValor}>{itemSelecionado.descricao}</Text>
                                    </View>

                                    <View style={styles.campoModal}>
                                        <Text style={styles.campoLabel}>Status:</Text>
                                        <Text style={[
                                            styles.campoValor,
                                            itemSelecionado.status === 'pago' ? styles.statusPagoTexto : styles.statusPendenteTexto
                                        ]}>
                                            {itemSelecionado.status === 'pago' ? 'PAGO' : 'PENDENTE'}
                                        </Text>
                                    </View>
                                </ScrollView>

                                <View style={styles.modalFooter}>
                                    {itemSelecionado.status === 'pendente' && (
                                        <TouchableOpacity
                                            style={styles.botaoPagar}
                                            onPress={() => marcarComoPago(itemSelecionado.id)}
                                        >
                                            <Text style={styles.botaoPagarTexto}>✅ Marcar como Pago</Text>
                                        </TouchableOpacity>
                                    )}
                                    <TouchableOpacity
                                        style={styles.botaoExcluir}
                                        onPress={() => excluirItem(itemSelecionado.id)}
                                    >
                                        <Text style={styles.botaoExcluirTexto}>🗑️ Excluir</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>

            {/* Modal de Criar */}
            <Modal
                visible={modalCriarVisivel}
                animationType="slide"
                transparent={true}
                onRequestClose={fecharModalCriar}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                + Criar {modoAtivo === 'entrada' ? 'Fiado' : 'Despesa'}
                            </Text>
                            <TouchableOpacity onPress={fecharModalCriar}>
                                <Text style={styles.modalFechar}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Nome *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder={modoAtivo === 'entrada' ? "Nome do cliente" : "Nome da despesa"}
                                    value={novoFiado.nome}
                                    onChangeText={(text) => setNovoFiado({ ...novoFiado, nome: text })}
                                />
                            </View>

                            {modoAtivo === 'entrada' && (
                                <>
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>Produto</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Nome do produto"
                                            value={novoFiado.produto}
                                            onChangeText={(text) => setNovoFiado({ ...novoFiado, produto: text })}
                                        />
                                    </View>
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>Quantidade</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="1"
                                            value={novoFiado.quantidade}
                                            onChangeText={(text) => setNovoFiado({ ...novoFiado, quantidade: text })}
                                            keyboardType="numeric"
                                        />
                                    </View>
                                </>
                            )}

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Valor *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="0.00"
                                    value={novoFiado.valor}
                                    onChangeText={(text) => setNovoFiado({ ...novoFiado, valor: text })}
                                    keyboardType="numeric"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Data de Pagamento *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="YYYY-MM-DD"
                                    value={novoFiado.dataPagamento}
                                    onChangeText={(text) => setNovoFiado({ ...novoFiado, dataPagamento: text })}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Forma de Pagamento</Text>
                                <View style={styles.opcoesContainer}>
                                    {['dinheiro', 'pix', 'cartão', 'transferência'].map((forma) => (
                                        <TouchableOpacity
                                            key={forma}
                                            style={[
                                                styles.opcaoBotao,
                                                novoFiado.formaPagamento === forma && styles.opcaoBotaoSelecionado
                                            ]}
                                            onPress={() => setNovoFiado({ ...novoFiado, formaPagamento: forma })}
                                        >
                                            <Text style={[
                                                styles.opcaoTexto,
                                                novoFiado.formaPagamento === forma && styles.opcaoTextoSelecionado
                                            ]}>
                                                {forma}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Recorrência</Text>
                                <View style={styles.opcoesContainer}>
                                    {['única', 'diária', 'semanal', 'quinzenal', 'mensal'].map((rec) => (
                                        <TouchableOpacity
                                            key={rec}
                                            style={[
                                                styles.opcaoBotao,
                                                novoFiado.recorrencia === rec && styles.opcaoBotaoSelecionado
                                            ]}
                                            onPress={() => setNovoFiado({ ...novoFiado, recorrencia: rec })}
                                        >
                                            <Text style={[
                                                styles.opcaoTexto,
                                                novoFiado.recorrencia === rec && styles.opcaoTextoSelecionado
                                            ]}>
                                                {rec}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Descrição</Text>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    placeholder="Descrição adicional..."
                                    value={novoFiado.descricao}
                                    onChangeText={(text) => setNovoFiado({ ...novoFiado, descricao: text })}
                                    multiline
                                    numberOfLines={3}
                                />
                            </View>
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={styles.botaoCancelar}
                                onPress={fecharModalCriar}
                            >
                                <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.botaoSalvar}
                                onPress={handleCriarFiado}
                            >
                                <Text style={styles.botaoSalvarTexto}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    header: {
        backgroundColor: '#fff',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#dee2e6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 4 },
    subtitle: { fontSize: 14, color: '#666' },
    content: { flex: 1, padding: 16 },

    // Toggle
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        margin: 16,
        borderRadius: 8,
        padding: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    toggleButton: {
        flex: 1,
        padding: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    toggleButtonAtivo: {
        backgroundColor: '#28a745',
    },
    toggleButtonAtivoDespesas: {
        backgroundColor: '#dc3545'
    },
    toggleTexto: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    toggleTextoAtivo: {
        color: '#fff',
    },

    // Barra de Ações
    barraAcoes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    botaoCriar: {
        backgroundColor: '#28a745',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 6,
    },
    botaoCriarTexto: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },

    // Lista
    listaContainer: {
        paddingBottom: 16,
    },
    cardItem: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    cardEntrada: {
        borderLeftWidth: 4,
        borderLeftColor: '#28a745',
    },
    cardDespesa: {
        borderLeftWidth: 4,
        borderLeftColor: '#dc3545',
    },
    itemPago: {
        opacity: 0.7,
        backgroundColor: '#f8f9fa',
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    itemNome: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusPago: {
        backgroundColor: '#d4edda',
    },
    statusPendente: {
        backgroundColor: '#fff3cd',
    },
    statusTexto: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#155724',
    },
    itemInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    itemProduto: {
        fontSize: 14,
        color: '#666',
        flex: 1,
    },
    itemValor: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#28a745',
    },
    itemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemData: {
        fontSize: 12,
        color: '#999',
    },
    itemRecorrencia: {
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic',
    },

    // Estados vazios
    vazioContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    vazioTexto: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
    },

    // Modais
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        width: '100%',
        maxWidth: 500,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#dee2e6',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    modalFechar: {
        fontSize: 20,
        color: '#999',
        fontWeight: 'bold',
    },
    modalBody: {
        padding: 20,
        maxHeight: 400,
    },
    modalFooter: {
        flexDirection: 'row',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#dee2e6',
        gap: 12,
    },

    // Campos do Modal
    campoModal: {
        marginBottom: 16,
    },
    campoLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    campoValor: {
        fontSize: 16,
        color: '#666',
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 6,
    },
    statusPagoTexto: {
        color: '#28a745',
        fontWeight: 'bold',
    },
    statusPendenteTexto: {
        color: '#dc3545',
        fontWeight: 'bold',
    },

    // Botões do Modal
    botaoPagar: {
        flex: 1,
        backgroundColor: '#28a745',
        padding: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    botaoPagarTexto: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    botaoExcluir: {
        flex: 1,
        backgroundColor: '#dc3545',
        padding: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    botaoExcluirTexto: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    botaoCancelar: {
        flex: 1,
        backgroundColor: '#6c757d',
        padding: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    botaoCancelarTexto: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    botaoSalvar: {
        flex: 1,
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    botaoSalvarTexto: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },

    // Formulário
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ced4da',
        borderRadius: 6,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    opcoesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    opcaoBotao: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#ced4da',
        backgroundColor: '#f8f9fa',
    },
    opcaoBotaoSelecionado: {
        backgroundColor: '#007bff',
        borderColor: '#007bff',
    },
    opcaoTexto: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    opcaoTextoSelecionado: {
        color: '#fff',
    },
});

export default FiadosWebScreen;
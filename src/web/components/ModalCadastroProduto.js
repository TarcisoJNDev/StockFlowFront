// src/web/components/ModalCadastroProduto.js
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native';

const ModalCadastroProduto = ({ visible, onClose, onSalvar }) => {
    const [formData, setFormData] = useState({
        nome: '',
        codigoBarras: '',
        descricao: '',
        categoria: '',
        fornecedor: '',
        custoCompra: '',
        precoVenda: '',
        quantidadeEstoque: '',
        estoqueMinimo: '',
        unidadeMedida: 'UN'
    });

    const calcularLucros = () => {
        const custo = parseFloat(formData.custoCompra) || 0;
        const venda = parseFloat(formData.precoVenda) || 0;

        if (custo > 0 && venda > 0) {
            const lucroDinheiro = venda - custo;
            const lucroPercentual = ((lucroDinheiro / custo) * 100);
            return {
                lucroDinheiro: lucroDinheiro.toFixed(2),
                lucroPercentual: lucroPercentual.toFixed(2)
            };
        }
        return { lucroDinheiro: '0.00', lucroPercentual: '0.00' };
    };

    const lucros = calcularLucros();

    const handleSalvar = () => {
        // Validações básicas
        if (!formData.nome.trim()) {
            Alert.alert('Erro', 'Por favor, informe o nome do produto');
            return;
        }

        if (!formData.custoCompra || !formData.precoVenda) {
            Alert.alert('Erro', 'Por favor, informe o custo e preço de venda');
            return;
        }

        const dadosCompletos = {
            ...formData,
            custoCompra: parseFloat(formData.custoCompra),
            precoVenda: parseFloat(formData.precoVenda),
            quantidadeEstoque: parseInt(formData.quantidadeEstoque) || 0,
            estoqueMinimo: parseInt(formData.estoqueMinimo) || 0,
            lucroDinheiro: parseFloat(lucros.lucroDinheiro),
            lucroPercentual: parseFloat(lucros.lucroPercentual)
        };

        onSalvar(dadosCompletos);
        setFormData({
            nome: '',
            codigoBarras: '',
            descricao: '',
            categoria: '',
            fornecedor: '',
            custoCompra: '',
            precoVenda: '',
            quantidadeEstoque: '',
            estoqueMinimo: '',
            unidadeMedida: 'UN'
        });
    };

    const handleCancelar = () => {
        setFormData({
            nome: '',
            codigoBarras: '',
            descricao: '',
            categoria: '',
            fornecedor: '',
            custoCompra: '',
            precoVenda: '',
            quantidadeEstoque: '',
            estoqueMinimo: '',
            unidadeMedida: 'UN'
        });
        onClose();
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={handleCancelar}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.modalOverlay}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {/* Header do Modal */}
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>📦 Cadastrar Novo Produto</Text>
                            <TouchableOpacity onPress={handleCancelar} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>×</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Formulário */}
                        <ScrollView style={styles.form}>
                            {/* Seção Foto do Produto */}
                            <View style={styles.secao}>
                                <Text style={styles.secaoTitulo}>Foto do Produto</Text>
                                <TouchableOpacity style={styles.botaoFoto}>
                                    <Text style={styles.textoBotaoFoto}>📷 Adicionar Foto</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Informações Básicas */}
                            <View style={styles.secao}>
                                <Text style={styles.secaoTitulo}>Informações Básicas</Text>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Código de Barras</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Digite o código de barras"
                                        value={formData.codigoBarras}
                                        onChangeText={(text) => setFormData({ ...formData, codigoBarras: text })}
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Nome do Produto *</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Ex: Chocolate em pó 500g"
                                        value={formData.nome}
                                        onChangeText={(text) => setFormData({ ...formData, nome: text })}
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Descrição</Text>
                                    <TextInput
                                        style={[styles.input, styles.textArea]}
                                        placeholder="Descrição detalhada do produto..."
                                        value={formData.descricao}
                                        onChangeText={(text) => setFormData({ ...formData, descricao: text })}
                                        multiline={true}
                                        numberOfLines={3}
                                        textAlignVertical="top"
                                    />
                                </View>
                            </View>

                            {/* Categoria e Fornecedor */}
                            <View style={styles.row}>
                                <View style={[styles.inputGroup, styles.halfInput]}>
                                    <Text style={styles.label}>Categoria</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Ex: Confeitaria"
                                        value={formData.categoria}
                                        onChangeText={(text) => setFormData({ ...formData, categoria: text })}
                                    />
                                </View>

                                <View style={[styles.inputGroup, styles.halfInput]}>
                                    <Text style={styles.label}>Fornecedor</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Ex: Nestlé"
                                        value={formData.fornecedor}
                                        onChangeText={(text) => setFormData({ ...formData, fornecedor: text })}
                                    />
                                </View>
                            </View>

                            {/* Preços e Lucros */}
                            <View style={styles.secao}>
                                <Text style={styles.secaoTitulo}>Preços e Lucros</Text>

                                <View style={styles.row}>
                                    <View style={[styles.inputGroup, styles.halfInput]}>
                                        <Text style={styles.label}>Custo da Compra (R$)</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="0.00"
                                            value={formData.custoCompra}
                                            onChangeText={(text) => setFormData({ ...formData, custoCompra: text })}
                                            keyboardType="decimal-pad"
                                        />
                                    </View>

                                    <View style={[styles.inputGroup, styles.halfInput]}>
                                        <Text style={styles.label}>Preço de Venda (R$)</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="0.00"
                                            value={formData.precoVenda}
                                            onChangeText={(text) => setFormData({ ...formData, precoVenda: text })}
                                            keyboardType="decimal-pad"
                                        />
                                    </View>
                                </View>

                                <View style={styles.row}>
                                    <View style={[styles.inputGroup, styles.halfInput]}>
                                        <Text style={styles.label}>Lucro (R$)</Text>
                                        <TextInput
                                            style={[styles.input, styles.inputCalculado]}
                                            value={lucros.lucroDinheiro}
                                            editable={false}
                                        />
                                    </View>

                                    <View style={[styles.inputGroup, styles.halfInput]}>
                                        <Text style={styles.label}>Lucro (%)</Text>
                                        <TextInput
                                            style={[styles.input, styles.inputCalculado]}
                                            value={lucros.lucroPercentual}
                                            editable={false}
                                        />
                                    </View>
                                </View>
                            </View>

                            {/* Estoque */}
                            <View style={styles.secao}>
                                <Text style={styles.secaoTitulo}>Controle de Estoque</Text>

                                <View style={styles.row}>
                                    <View style={[styles.inputGroup, styles.halfInput]}>
                                        <Text style={styles.label}>Quantidade em Estoque</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="0"
                                            value={formData.quantidadeEstoque}
                                            onChangeText={(text) => setFormData({ ...formData, quantidadeEstoque: text })}
                                            keyboardType="numeric"
                                        />
                                    </View>

                                    <View style={[styles.inputGroup, styles.halfInput]}>
                                        <Text style={styles.label}>Estoque Mínimo</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="0"
                                            value={formData.estoqueMinimo}
                                            onChangeText={(text) => setFormData({ ...formData, estoqueMinimo: text })}
                                            keyboardType="numeric"
                                        />
                                    </View>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Unidade de Medida</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Ex: UN, KG, LT"
                                        value={formData.unidadeMedida}
                                        onChangeText={(text) => setFormData({ ...formData, unidadeMedida: text })}
                                    />
                                </View>
                            </View>
                        </ScrollView>

                        {/* Footer do Modal */}
                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={[styles.botao, styles.botaoCancelar]}
                                onPress={handleCancelar}
                            >
                                <Text style={styles.textoBotaoCancelar}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.botao, styles.botaoSalvar]}
                                onPress={handleSalvar}
                            >
                                <Text style={styles.textoBotaoSalvar}>Salvar Produto</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        maxWidth: 700,
        maxHeight: '90%',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 12,
        overflow: 'hidden',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: 5,
    },
    closeButtonText: {
        fontSize: 24,
        color: '#6c757d',
        fontWeight: 'bold',
    },
    form: {
        maxHeight: 500,
        padding: 20,
    },
    secao: {
        marginBottom: 24,
    },
    secaoTitulo: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
        paddingBottom: 8,
    },
    inputGroup: {
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    halfInput: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#f8f9fa',
    },
    inputCalculado: {
        backgroundColor: '#e9ecef',
        color: '#666',
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    botaoFoto: {
        borderWidth: 2,
        borderColor: '#007AFF',
        borderStyle: 'dashed',
        borderRadius: 8,
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
    },
    textoBotaoFoto: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '600',
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
        gap: 12,
    },
    botao: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        minWidth: 120,
        alignItems: 'center',
    },
    botaoCancelar: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#6c757d',
    },
    botaoSalvar: {
        backgroundColor: '#28a745',
    },
    textoBotaoCancelar: {
        color: '#6c757d',
        fontSize: 16,
        fontWeight: '600',
    },
    textoBotaoSalvar: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ModalCadastroProduto;
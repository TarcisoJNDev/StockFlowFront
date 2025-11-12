// src/web/components/ModalFiltroEstoque.js
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TextInput,
    TouchableOpacity,
    ScrollView
} from 'react-native';

const ModalFiltroEstoque = ({
    visible,
    categorias,
    fornecedores,
    filtros,
    onFiltroChange,
    onClose,
    onLimpar,
    onAplicar
}) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {/* Header do Modal */}
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>🔍 Filtrar Produtos</Text>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>×</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.form}>
                            {/* Filtro por Nome */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Nome do Produto</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Digite o nome do produto"
                                    value={filtros.nome}
                                    onChangeText={onFiltroChange.setNome}
                                />
                            </View>

                            {/* Filtro Estoque Baixo */}
                            <TouchableOpacity
                                style={styles.filterSwitch}
                                onPress={() => onFiltroChange.setQuantidadeBaixa(!filtros.quantidadeBaixa)}
                            >
                                <Text style={styles.filterSwitchText}>Apenas produtos com estoque baixo (≤ 10)</Text>
                                <View style={[
                                    styles.switch,
                                    filtros.quantidadeBaixa ? styles.switchOn : styles.switchOff
                                ]}>
                                    <View style={[
                                        styles.switchKnob,
                                        filtros.quantidadeBaixa ? styles.switchKnobOn : styles.switchKnobOff
                                    ]} />
                                </View>
                            </TouchableOpacity>

                            {/* Filtro por Categoria */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Categoria</Text>
                                <View style={styles.chipsContainer}>
                                    <TouchableOpacity
                                        style={[
                                            styles.chip,
                                            !filtros.categoria && styles.chipSelected
                                        ]}
                                        onPress={() => onFiltroChange.setCategoria('')}
                                    >
                                        <Text style={[
                                            styles.chipText,
                                            !filtros.categoria && styles.chipTextSelected
                                        ]}>Todas</Text>
                                    </TouchableOpacity>
                                    {categorias.map(categoria => (
                                        <TouchableOpacity
                                            key={categoria.id}
                                            style={[
                                                styles.chip,
                                                filtros.categoria === categoria.id.toString() && styles.chipSelected
                                            ]}
                                            onPress={() => onFiltroChange.setCategoria(categoria.id.toString())}
                                        >
                                            <Text style={[
                                                styles.chipText,
                                                filtros.categoria === categoria.id.toString() && styles.chipTextSelected
                                            ]}>{categoria.nome}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Filtro por Fornecedor */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Fornecedor</Text>
                                <View style={styles.chipsContainer}>
                                    <TouchableOpacity
                                        style={[
                                            styles.chip,
                                            !filtros.fornecedor && styles.chipSelected
                                        ]}
                                        onPress={() => onFiltroChange.setFornecedor('')}
                                    >
                                        <Text style={[
                                            styles.chipText,
                                            !filtros.fornecedor && styles.chipTextSelected
                                        ]}>Todos</Text>
                                    </TouchableOpacity>
                                    {fornecedores.map(fornecedor => (
                                        <TouchableOpacity
                                            key={fornecedor.id}
                                            style={[
                                                styles.chip,
                                                filtros.fornecedor === fornecedor.id.toString() && styles.chipSelected
                                            ]}
                                            onPress={() => onFiltroChange.setFornecedor(fornecedor.id.toString())}
                                        >
                                            <Text style={[
                                                styles.chipText,
                                                filtros.fornecedor === fornecedor.id.toString() && styles.chipTextSelected
                                            ]}>{fornecedor.nome}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </ScrollView>

                        {/* Footer do Modal */}
                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={[styles.botao, styles.botaoLimpar]}
                                onPress={onLimpar}
                            >
                                <Text style={styles.textoBotaoLimpar}>Limpar Filtros</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.botao, styles.botaoAplicar]}
                                onPress={onAplicar}
                            >
                                <Text style={styles.textoBotaoAplicar}>Aplicar Filtros</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        width: '90%',
        maxWidth: 600,
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
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#f8f9fa',
    },
    filterSwitch: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    filterSwitchText: {
        fontSize: 14,
        color: '#333',
        flex: 1,
    },
    switch: {
        width: 50,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        paddingHorizontal: 2,
    },
    switchOn: {
        backgroundColor: '#28a745',
    },
    switchOff: {
        backgroundColor: '#6c757d',
    },
    switchKnob: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'white',
    },
    switchKnobOn: {
        alignSelf: 'flex-end',
    },
    switchKnobOff: {
        alignSelf: 'flex-start',
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#dee2e6',
    },
    chipSelected: {
        backgroundColor: '#007bff',
        borderColor: '#007bff',
    },
    chipText: {
        fontSize: 12,
        color: '#6c757d',
        fontWeight: '500',
    },
    chipTextSelected: {
        color: 'white',
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
    },
    botao: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        minWidth: 140,
        alignItems: 'center',
    },
    botaoLimpar: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#6c757d',
    },
    botaoAplicar: {
        backgroundColor: '#007bff',
    },
    textoBotaoLimpar: {
        color: '#6c757d',
        fontSize: 16,
        fontWeight: '600',
    },
    textoBotaoAplicar: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ModalFiltroEstoque;
// src/web/screens/CaixaWebScreen.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
    FlatList,
    Image,
    Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');

const CaixaWebScreen = () => {
    const [produtos, setProdutos] = useState([
        {
            id: 1,
            nome: 'COCA COLA 2L',
            preco: 8.50,
            codigo: '00696621470',
            estoque: 15,
            imagem: 'https://via.placeholder.com/120x120/FF0000/FFFFFF?text=COCA+COLA'
        },
        {
            id: 2,
            nome: 'ARROZ 5KG',
            preco: 23.50,
            codigo: '1001',
            estoque: 20,
            imagem: 'https://via.placeholder.com/120x120/8B4513/FFFFFF?text=ARROZ+5KG'
        },
        {
            id: 3,
            nome: 'FEIJÃO 1KG',
            preco: 9.50,
            codigo: '1002',
            estoque: 15,
            imagem: 'https://via.placeholder.com/120x120/8B0000/FFFFFF?text=FEIJÃO+1KG'
        },
        {
            id: 4,
            nome: 'AÇÚCAR 1KG',
            preco: 4.20,
            codigo: '1003',
            estoque: 18,
            imagem: 'https://via.placeholder.com/120x120/FFFFFF/000000?text=AÇÚCAR+1KG'
        },
        {
            id: 5,
            nome: 'CAFÉ 500G',
            preco: 12.90,
            codigo: '1004',
            estoque: 10,
            imagem: 'https://via.placeholder.com/120x120/8B4513/FFFFFF?text=CAFÉ+500G'
        },
        {
            id: 6,
            nome: 'ÓLEO 900ML',
            preco: 7.80,
            codigo: '1005',
            estoque: 12,
            imagem: 'https://via.placeholder.com/120x120/FFD700/000000?text=ÓLEO+900ML'
        },
        {
            id: 7,
            nome: 'LEITE 1L',
            preco: 5.50,
            codigo: '1006',
            estoque: 25,
            imagem: 'https://via.placeholder.com/120x120/FFFFFF/000000?text=LEITE+1L'
        },
    ]);

    const [carrinho, setCarrinho] = useState([]);
    const [codigoDigitado, setCodigoDigitado] = useState('');
    const [quantidade, setQuantidade] = useState('1');
    const [pagamento, setPagamento] = useState('dinheiro');
    const [troco, setTroco] = useState('');
    const [vendasHoje, setVendasHoje] = useState(15);
    const [valorTotalVendas, setValorTotalVendas] = useState(1250.80);

    const subtotal = carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    const total = subtotal;

    const adicionarAoCarrinho = (produto, qtd = 1) => {
        const quantidadeInt = parseInt(qtd) || 1;

        if (quantidadeInt > produto.estoque) {
            Alert.alert('Estoque Insuficiente', `Só temos ${produto.estoque} unidades em estoque de ${produto.nome}`);
            return;
        }

        const produtoExistente = carrinho.find(item => item.id === produto.id);

        if (produtoExistente) {
            const novaQuantidade = produtoExistente.quantidade + quantidadeInt;
            if (novaQuantidade > produto.estoque) {
                Alert.alert('Estoque Insuficiente', `Só temos ${produto.estoque} unidades em estoque de ${produto.nome}`);
                return;
            }

            setCarrinho(carrinho.map(item =>
                item.id === produto.id
                    ? { ...item, quantidade: novaQuantidade }
                    : item
            ));
        } else {
            setCarrinho([...carrinho, {
                ...produto,
                quantidade: quantidadeInt,
                dataHora: new Date().toLocaleTimeString()
            }]);
        }

        setCodigoDigitado('');
        setQuantidade('1');
    };

    const adicionarPorCodigo = () => {
        if (!codigoDigitado.trim()) {
            Alert.alert('Erro', 'Digite um código de produto');
            return;
        }

        const produto = produtos.find(p =>
            p.codigo.toLowerCase() === codigoDigitado.toLowerCase().trim() ||
            p.nome.toLowerCase().includes(codigoDigitado.toLowerCase().trim())
        );

        if (produto) {
            adicionarAoCarrinho(produto, parseInt(quantidade) || 1);
        } else {
            Alert.alert('Produto não encontrado', 'Verifique o código ou nome digitado');
        }
    };

    const removerDoCarrinho = (id) => {
        setCarrinho(carrinho.filter(item => item.id !== id));
    };

    const alterarQuantidade = (id, novaQuantidade) => {
        if (novaQuantidade <= 0) {
            removerDoCarrinho(id);
            return;
        }

        const produto = produtos.find(p => p.id === id);
        if (novaQuantidade > produto.estoque) {
            Alert.alert('Estoque Insuficiente', `Só temos ${produto.estoque} unidades em estoque`);
            return;
        }

        setCarrinho(carrinho.map(item =>
            item.id === id ? { ...item, quantidade: novaQuantidade } : item
        ));
    };

    const finalizarVenda = () => {
        if (carrinho.length === 0) {
            Alert.alert('Carrinho vazio', 'Adicione produtos ao carrinho antes de finalizar');
            return;
        }

        if (pagamento === 'dinheiro' && (!troco || parseFloat(troco) < total)) {
            Alert.alert('Troco insuficiente', 'O valor do troco deve ser maior ou igual ao total');
            return;
        }

        Alert.alert(
            'CONFIRMAR VENDA',
            `TOTAL: R$ ${total.toFixed(2)}\nItens: ${carrinho.length}`,
            [
                { text: 'CANCELAR', style: 'cancel' },
                {
                    text: 'CONFIRMAR VENDA',
                    onPress: () => {
                        const cupom = `
=== YZIDRC - CHECKOUT ===
${new Date().toLocaleString('pt-BR')}

${carrinho.map(item =>
                            `${item.nome.padEnd(25).substring(0, 25)} ${item.quantidade.toString().padStart(3)}x R$ ${item.preco.toFixed(2).padStart(6)} = R$ ${(item.preco * item.quantidade).toFixed(2).padStart(7)}`
                        ).join('\n')}

--------------------------------
SUBTOTAL: R$ ${subtotal.toFixed(2).padStart(10)}
TOTAL: R$ ${total.toFixed(2).padStart(13)}
FORMA PAGTO: ${pagamento.toUpperCase()}
${pagamento === 'dinheiro' ? `TROCO: R$ ${(parseFloat(troco) - total).toFixed(2).padStart(13)}` : ''}

*** OBRIGADO PELA PREFERÊNCIA ***
                        `;

                        console.log('🎫 CUPOM FISCAL:', cupom);

                        setVendasHoje(prev => prev + 1);
                        setValorTotalVendas(prev => prev + total);

                        setCarrinho([]);
                        setCodigoDigitado('');
                        setQuantidade('1');
                        setTroco('');

                        Alert.alert('✅ VENDA FINALIZADA!', `Cupom fiscal gerado com sucesso!\nTotal: R$ ${total.toFixed(2)}`);
                    }
                }
            ]
        );
    };

    const limparCarrinho = () => {
        if (carrinho.length === 0) return;

        Alert.alert(
            'LIMPAR CARRINHO',
            `Deseja remover todos os ${carrinho.length} itens do carrinho?`,
            [
                { text: 'MANTER ITENS', style: 'cancel' },
                {
                    text: 'LIMPAR TUDO',
                    style: 'destructive',
                    onPress: () => setCarrinho([])
                }
            ]
        );
    };

    const renderItemProduto = ({ item }) => (
        <TouchableOpacity
            style={styles.itemProduto}
            onPress={() => adicionarAoCarrinho(item)}
        >
            <Image
                source={{ uri: item.imagem }}
                style={styles.produtoImagem}
                defaultSource={{ uri: 'https://via.placeholder.com/120x120/CCCCCC/666666?text=PRODUTO' }}
            />
            <View style={styles.produtoInfo}>
                <Text style={styles.produtoNome}>{item.nome}</Text>
                <Text style={styles.produtoCodigo}>Cód: {item.codigo}</Text>
                <Text style={styles.produtoEstoque}>Estoque: {item.estoque}</Text>
                <Text style={styles.produtoPreco}>R$ {item.preco.toFixed(2)}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderItemCarrinho = ({ item }) => (
        <View style={styles.itemCarrinho}>
            <View style={styles.itemInfo}>
                <Text style={styles.itemNome}>{item.nome}</Text>
                <Text style={styles.itemCodigo}>Cód: {item.codigo}</Text>
                <Text style={styles.itemHora}>{item.dataHora}</Text>
            </View>
            <View style={styles.controlesQuantidade}>
                <TouchableOpacity
                    style={styles.botaoQuantidade}
                    onPress={() => alterarQuantidade(item.id, item.quantidade - 1)}
                >
                    <Text style={styles.botaoQuantidadeTexto}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantidadeTexto}>{item.quantidade}</Text>
                <TouchableOpacity
                    style={styles.botaoQuantidade}
                    onPress={() => alterarQuantidade(item.id, item.quantidade + 1)}
                >
                    <Text style={styles.botaoQuantidadeTexto}>+</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.itemTotal}>R$ {(item.preco * item.quantidade).toFixed(2)}</Text>
            <TouchableOpacity
                style={styles.botaoRemover}
                onPress={() => removerDoCarrinho(item.id)}
            >
                <Text style={styles.botaoRemoverTexto}>×</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>💰 CAIXA</Text>
                    <Text style={styles.subtitle}>Sistema de Caixa - StockFlow Market</Text>
                </View>
                <View style={styles.infoCaixa}>
                    <Text style={styles.infoTexto}>Vendas Hoje: <Text style={styles.infoDestaque}>{vendasHoje}</Text></Text>
                    <Text style={styles.infoTexto}>Total: <Text style={styles.infoDestaque}>R$ {valorTotalVendas.toFixed(2)}</Text></Text>
                    <Text style={styles.infoTexto}>Operador: <Text style={styles.infoDestaque}>VERANDO</Text></Text>
                </View>
            </View>

            <View style={styles.content}>
                {/* Coluna Esquerda - Visualização e Entrada */}
                <View style={styles.colunaEsquerda}>
                    {/* Visualização do Produto */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>VISUALIZAÇÃO DO PRODUTO</Text>
                        <View style={styles.areaImagem}>
                            <Image
                                source={{ uri: 'https://via.placeholder.com/200x200/4A90E2/FFFFFF?text=SELECIONE+UM+PRODUTO' }}
                                style={styles.imagemProduto}
                            />
                        </View>
                    </View>

                    {/* Entrada Rápida */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>ENTRADA RÁPIDA</Text>
                        <Text style={styles.label}>código do produto</Text>
                        <View style={styles.entradaContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Digite o código ou nome..."
                                value={codigoDigitado}
                                onChangeText={setCodigoDigitado}
                                onSubmitEditing={adicionarPorCodigo}
                            />
                            <View style={styles.linhaEntrada}>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>QTD</Text>
                                    <TextInput
                                        style={styles.inputPequeno}
                                        value={quantidade}
                                        onChangeText={setQuantidade}
                                        keyboardType="numeric"
                                    />
                                </View>
                                <TouchableOpacity
                                    style={styles.botaoAdicionar}
                                    onPress={adicionarPorCodigo}
                                >
                                    <Text style={styles.botaoTexto}>ADICIONAR</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Coluna Central - Carrinho */}
                <View style={styles.colunaCentral}>
                    <View style={styles.card}>
                        <View style={styles.carrinhoHeader}>
                            <Text style={styles.cardTitle}>CARRINHO DE COMPRAS</Text>
                            {carrinho.length > 0 && (
                                <TouchableOpacity onPress={limparCarrinho}>
                                    <Text style={styles.limparTexto}>LIMPAR</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {carrinho.length === 0 ? (
                            <Text style={styles.carrinhoVazio}>Carrinho vazio - Digite um código para começar</Text>
                        ) : (
                            <FlatList
                                data={carrinho}
                                renderItem={renderItemCarrinho}
                                keyExtractor={item => item.id.toString()}
                                style={styles.listaCarrinho}
                                showsVerticalScrollIndicator={false}
                            />
                        )}

                        {/* Totais e Pagamento */}
                        <View style={styles.totaisContainer}>
                            <View style={styles.linhaTotal}>
                                <Text style={styles.totalLabel}>SUBTOTAL:</Text>
                                <Text style={styles.totalValue}>R$ {subtotal.toFixed(2)}</Text>
                            </View>
                            <View style={styles.linhaTotal}>
                                <Text style={styles.totalLabel}>TOTAL:</Text>
                                <Text style={styles.totalGrande}>R$ {total.toFixed(2)}</Text>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>FORMA DE PAGAMENTO</Text>
                                <View style={styles.botoesPagamento}>
                                    {['dinheiro', 'cartão', 'pix'].map((forma) => (
                                        <TouchableOpacity
                                            key={forma}
                                            style={[
                                                styles.botaoPagamento,
                                                pagamento === forma && styles.botaoPagamentoSelecionado
                                            ]}
                                            onPress={() => setPagamento(forma)}
                                        >
                                            <Text style={[
                                                styles.botaoPagamentoTexto,
                                                pagamento === forma && styles.botaoPagamentoTextoSelecionado
                                            ]}>
                                                {forma.toUpperCase()}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {pagamento === 'dinheiro' && (
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>VALOR PARA TROCO</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="0.00"
                                        value={troco}
                                        onChangeText={setTroco}
                                        keyboardType="numeric"
                                    />
                                    {troco && parseFloat(troco) > 0 && (
                                        <Text style={styles.trocoTexto}>
                                            TROCO: R$ {(parseFloat(troco) - total).toFixed(2)}
                                        </Text>
                                    )}
                                </View>
                            )}

                            <TouchableOpacity
                                style={[
                                    styles.botaoFinalizar,
                                    carrinho.length === 0 && styles.botaoFinalizarDisabled
                                ]}
                                onPress={finalizarVenda}
                                disabled={carrinho.length === 0}
                            >
                                <Text style={styles.botaoFinalizarTexto}>
                                    FINALIZAR VENDA
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Coluna Direita - Produtos */}
                <View style={styles.colunaDireita}>
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>PRODUTOS DISPONÍVEIS</Text>
                            <Text style={styles.contadorProdutos}>{produtos.length} produtos</Text>
                        </View>
                        <FlatList
                            data={produtos}
                            renderItem={renderItemProduto}
                            keyExtractor={item => item.id.toString()}
                            style={styles.listaProdutos}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa'
    },
    header: {
        backgroundColor: '#fff',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#dee2e6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 2
    },
    subtitle: {
        fontSize: 12,
        color: '#6c757d',
        fontWeight: '500'
    },
    infoCaixa: {
        alignItems: 'flex-end',
    },
    infoTexto: {
        fontSize: 10,
        color: '#6c757d',
        marginBottom: 1,
    },
    infoDestaque: {
        fontWeight: 'bold',
        color: '#28a745',
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        padding: 12,
        gap: 12,
    },
    colunaEsquerda: {
        width: 280,
        gap: 12,
    },
    colunaCentral: {
        flex: 1,
        maxWidth: 500,
        gap: 12,
    },
    colunaDireita: {
        width: 320,
        gap: 12,
    },
    card: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#2c3e50'
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    contadorProdutos: {
        fontSize: 11,
        color: '#6c757d',
        fontWeight: '500',
    },
    areaImagem: {
        alignItems: 'center',
        padding: 10,
    },
    imagemProduto: {
        width: 200,
        height: 200,
        borderRadius: 8,
        backgroundColor: '#e9ecef',
    },
    entradaContainer: {
        gap: 10,
    },
    linhaEntrada: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'flex-end',
    },
    inputGroup: {
        marginBottom: 12,
    },
    label: {
        fontSize: 11,
        fontWeight: '600',
        color: '#495057',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ced4da',
        borderRadius: 6,
        padding: 10,
        fontSize: 14,
        backgroundColor: '#fff',
        fontWeight: '500',
    },
    inputPequeno: {
        borderWidth: 1,
        borderColor: '#ced4da',
        borderRadius: 6,
        padding: 10,
        fontSize: 14,
        backgroundColor: '#fff',
        fontWeight: '500',
        textAlign: 'center',
        width: 60,
    },
    botaoAdicionar: {
        backgroundColor: '#28a745',
        borderRadius: 6,
        padding: 12,
        alignItems: 'center',
        flex: 1,
    },
    botaoTexto: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    carrinhoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    limparTexto: {
        color: '#dc3545',
        fontSize: 11,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    carrinhoVazio: {
        textAlign: 'center',
        color: '#adb5bd',
        fontStyle: 'italic',
        padding: 30,
        fontSize: 13,
    },
    listaCarrinho: {
        maxHeight: 200,
        marginBottom: 16,
    },
    itemCarrinho: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
        backgroundColor: '#f8f9fa',
        borderRadius: 6,
        marginBottom: 5,
        gap: 10,
    },
    itemInfo: {
        flex: 1,
    },
    itemNome: {
        fontSize: 12,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 2,
    },
    itemCodigo: {
        fontSize: 9,
        color: '#6c757d',
        marginBottom: 1,
    },
    itemHora: {
        fontSize: 8,
        color: '#adb5bd',
    },
    controlesQuantidade: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    botaoQuantidade: {
        backgroundColor: '#e9ecef',
        width: 24,
        height: 24,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    botaoQuantidadeTexto: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#495057',
    },
    quantidadeTexto: {
        fontSize: 11,
        fontWeight: 'bold',
        minWidth: 18,
        textAlign: 'center',
        color: '#495057',
    },
    itemTotal: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#28a745',
        minWidth: 60,
        textAlign: 'right',
    },
    botaoRemover: {
        backgroundColor: '#f8d7da',
        width: 24,
        height: 24,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    botaoRemoverTexto: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#dc3545',
    },
    totaisContainer: {
        borderTopWidth: 1,
        borderTopColor: '#dee2e6',
        paddingTop: 16,
    },
    linhaTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    totalLabel: {
        fontSize: 13,
        color: '#6c757d',
        fontWeight: '600',
    },
    totalValue: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#495057',
    },
    totalGrande: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#28a745',
    },
    botoesPagamento: {
        flexDirection: 'row',
        gap: 6,
        marginBottom: 12,
    },
    botaoPagamento: {
        flex: 1,
        padding: 8,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#dee2e6',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    botaoPagamentoSelecionado: {
        backgroundColor: '#28a745',
        borderColor: '#28a745',
    },
    botaoPagamentoTexto: {
        fontSize: 10,
        fontWeight: '600',
        color: '#6c757d',
    },
    botaoPagamentoTextoSelecionado: {
        color: '#fff',
    },
    trocoTexto: {
        fontSize: 12,
        color: '#28a745',
        fontWeight: 'bold',
        marginTop: 6,
        textAlign: 'center',
    },
    botaoFinalizar: {
        backgroundColor: '#28a745',
        borderRadius: 6,
        padding: 12,
        alignItems: 'center',
        marginTop: 12,
    },
    botaoFinalizarDisabled: {
        backgroundColor: '#6c757d',
    },
    botaoFinalizarTexto: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    listaProdutos: {
        maxHeight: 500,
    },
    itemProduto: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
        backgroundColor: '#f8f9fa',
        borderRadius: 6,
        marginBottom: 6,
        gap: 10,
    },
    produtoImagem: {
        width: 50,
        height: 50,
        borderRadius: 6,
        backgroundColor: '#e9ecef',
    },
    produtoInfo: {
        flex: 1,
    },
    produtoNome: {
        fontSize: 12,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 2,
    },
    produtoCodigo: {
        fontSize: 10,
        color: '#6c757d',
        marginBottom: 1,
    },
    produtoEstoque: {
        fontSize: 9,
        color: '#868e96',
        fontStyle: 'italic',
        marginBottom: 2,
    },
    produtoPreco: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#28a745',
    },
});

export default CaixaWebScreen;
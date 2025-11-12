// src/web/AppWeb.js
import React, { useState } from 'react';
import { View } from 'react-native';
import WebLayout from './components/WebLayout';
import ProdutosWebScreen from './screens/ProdutosWebScreens';
import EstoqueWebScreen from './screens/EstoqueWebTela';
import ClientesWebScreen from './screens/ClienteWebTela';
import FiadosWebScreen from './screens/FiadoWebTela';
import CategoriasWebScreen from './screens/CategoriaWebTela';
import FornecedorWebScreen from './screens/FornecedorWebTela';
import CaixaWebScreen from './screens/CaixaWebTela';

const AppWeb = () => {
    const [activeSection, setActiveSection] = useState('produtos');

    const renderScreen = () => {
        switch (activeSection) {
            case 'produtos':
                return <ProdutosWebScreen />;
            case 'estoque':
                return <EstoqueWebScreen />;
            case 'clientes':
                return <ClientesWebScreen />;
            case 'fiados':
                return <FiadosWebScreen />;
            case 'categorias':
                return <CategoriasWebScreen />;
            case 'fornecedor':
                return <FornecedorWebScreen />;
            case 'caixa':
                return <CaixaWebScreen />;
            default:
                return <ProdutosWebScreen />;
        }
    };

    return (
        <WebLayout
            activeSection={activeSection}
            onSectionChange={setActiveSection}
        >
            {renderScreen()}
        </WebLayout>
    );
};

export default AppWeb;
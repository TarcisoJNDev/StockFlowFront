// src/web/AppWeb.js
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { AuthProvider, useAuth } from './components/AuthContext';
import LoginWebScreen from './screens/LoginWebScreen';
import RegisterWebScreen from './screens/RegisterWebScreen';
import WebLayout from './components/WebLayout';
import ProdutosWebScreen from './screens/ProdutosWebScreens';
import EstoqueWebScreen from './screens/EstoqueWebTela';
import ClientesWebScreen from './screens/ClienteWebTela';
import FiadosWebScreen from './screens/FiadoWebTela';
import CategoriasWebScreen from './screens/CategoriaWebTela';
import FornecedorWebScreen from './screens/FornecedorWebTela';
import CaixaWebScreen from './screens/CaixaWebTela';

// Componente principal do app (quando usuário está logado ou em demo)
const MainAppContent = () => {
    const [activeSection, setActiveSection] = useState('produtos');
    const { isDemoMode } = useAuth();

    console.log('🔍 MainAppContent - isDemoMode:', isDemoMode);

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

// Componente que decide se mostra login ou app
const AppContent = () => {
    const { user, isDemoMode, loading } = useAuth();
    const [currentScreen, setCurrentScreen] = useState('login');
    const [forceUpdate, setForceUpdate] = useState(0);

    // Effect para escutar mudanças no auth state
    useEffect(() => {
        const handleAuthChange = () => {
            console.log('🔄 Evento authStateChanged recebido - forçando atualização');
            setForceUpdate(prev => prev + 1);
        };

        window.addEventListener('authStateChanged', handleAuthChange);
        return () => window.removeEventListener('authStateChanged', handleAuthChange);
    }, []);

    console.log('🔍 AppContent - Estado atual:', {
        user: !!user,
        isDemoMode,
        loading,
        currentScreen,
        forceUpdate
    });

    if (loading) {
        console.log('⏳ Carregando...');
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#059669'
            }}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={{ color: '#fff', marginTop: 10 }}>Carregando...</Text>
            </View>
        );
    }

    // DEBUG: Log para verificar as condições
    console.log('🔍 Verificando condições:', {
        'user existe': !!user,
        'isDemoMode': isDemoMode,
        'user OU demo': !!(user || isDemoMode)
    });

    // Se tem usuário OU está em modo demo, mostra o app principal
    if (user || isDemoMode) {
        console.log('🚀 Indo para MainAppContent - user:', !!user, 'demo:', isDemoMode);
        return <MainAppContent />;
    }

    console.log('📱 Mostrando telas de autenticação');

    // Se não tem usuário nem está em demo, mostra telas de auth
    if (currentScreen === 'register') {
        return <RegisterWebScreen onShowLogin={() => setCurrentScreen('login')} />;
    }

    return <LoginWebScreen onShowRegister={() => setCurrentScreen('register')} />;
};

// AppWeb principal
const AppWeb = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default AppWeb;
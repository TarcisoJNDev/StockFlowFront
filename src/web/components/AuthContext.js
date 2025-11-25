// src/web/components/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDemoMode, setIsDemoMode] = useState(false);

    useEffect(() => {
        const loadStoredData = async () => {
            const token = localStorage.getItem('@StockFlow:token');
            const userData = localStorage.getItem('@StockFlow:user');
            const demoMode = localStorage.getItem('@StockFlow:demoMode');
            const devMode = localStorage.getItem('@StockFlow:devMode');

            console.log('🔍 Carregando dados:', {
                token: !!token,
                userData: !!userData,
                demoMode,
                devMode
            });

            if (devMode === 'true' && userData) {
                // MODO DESENVOLVEDOR - sempre prioridade
                const fakeUser = JSON.parse(userData);
                setUser(fakeUser);
                console.log('🔧 Modo desenvolvedor carregado:', fakeUser);
            } else if (token && userData) {
                // Usuário normal logado
                api.defaults.headers.Authorization = `Bearer ${token}`;
                setUser(JSON.parse(userData));
                console.log('✅ Usuário logado carregado');
            } else if (demoMode === 'true') {
                // Modo demo
                setIsDemoMode(true);
                console.log('🎮 Modo demo ativado');
            }
            setLoading(false);
        };

        loadStoredData();
    }, []);

    const signIn = async (email, password) => {
        try {
            const response = await api.get('/usuario/');
            const users = response.data;

            const userFound = users.find(user =>
                user.email === email && user.senha === password
            );

            if (userFound) {
                setUser(userFound);
                setIsDemoMode(false);

                const token = btoa(JSON.stringify({
                    id: userFound.id,
                    email: userFound.email
                }));

                api.defaults.headers.Authorization = `Bearer ${token}`;
                localStorage.setItem('@StockFlow:user', JSON.stringify(userFound));
                localStorage.setItem('@StockFlow:token', token);
                localStorage.removeItem('@StockFlow:demoMode');
                localStorage.removeItem('@StockFlow:devMode');

                return { success: true };
            } else {
                return {
                    success: false,
                    error: 'Email ou senha incorretos.'
                };
            }
        } catch (error) {
            console.error('Erro no login:', error);
            return {
                success: false,
                error: 'Erro de conexão. Verifique se o servidor está rodando.'
            };
        }
    };

    const enterDemoMode = () => {
        console.log('🎮 Ativando modo demo...');
        setIsDemoMode(true);
        setUser(null);
        localStorage.setItem('@StockFlow:demoMode', 'true');
        localStorage.removeItem('@StockFlow:user');
        localStorage.removeItem('@StockFlow:token');
        localStorage.removeItem('@StockFlow:devMode');
        console.log('✅ Modo demo ativado');

        // Forçar atualização
        setTimeout(() => window.location.reload(), 100);
    };

    const enterDeveloperMode = () => {
        console.log('🔧 Ativando modo desenvolvedor...');

        // Criar usuário fake bem simples
        const fakeUser = {
            id: 999,
            nome: 'Usuário Demonstração',
            email: 'demo@stockflow.com',
            celular: '(11) 99999-9999',
            permissao: 'Administrador'
        };

        setUser(fakeUser);
        setIsDemoMode(false);

        // Salvar no localStorage
        localStorage.setItem('@StockFlow:user', JSON.stringify(fakeUser));
        localStorage.setItem('@StockFlow:token', 'dev-mode-token');
        localStorage.setItem('@StockFlow:devMode', 'true');
        localStorage.removeItem('@StockFlow:demoMode');

        console.log('✅ Modo desenvolvedor ativado');

        // Forçar atualização da página
        setTimeout(() => window.location.reload(), 100);
    };

    const signOut = () => {
        console.log('🚪 Saindo...');
        localStorage.removeItem('@StockFlow:user');
        localStorage.removeItem('@StockFlow:token');
        localStorage.removeItem('@StockFlow:demoMode');
        localStorage.removeItem('@StockFlow:devMode');
        setUser(null);
        setIsDemoMode(false);
        delete api.defaults.headers.Authorization;

        // Forçar atualização
        setTimeout(() => window.location.reload(), 100);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isDemoMode,
            signIn,
            enterDemoMode,
            enterDeveloperMode,
            signOut,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    return context;
};
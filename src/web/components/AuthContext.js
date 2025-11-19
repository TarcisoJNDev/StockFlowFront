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

            if (token && userData) {
                api.defaults.headers.Authorization = `Bearer ${token}`;
                setUser(JSON.parse(userData));
            } else if (demoMode === 'true') {
                setIsDemoMode(true);
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

                return { success: true };
            } else {
                return {
                    success: false,
                    error: 'Email ou senha incorretos. Verifique suas credenciais.'
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

    const signUp = async (userData) => {
        try {
            // Verificar se o email já existe
            const response = await api.get('/usuario/');
            const users = response.data;

            const emailExists = users.find(user => user.email === userData.email);
            if (emailExists) {
                return {
                    success: false,
                    error: 'Este email já está cadastrado.'
                };
            }

            // Criar novo usuário
            const newUser = {
                nome: userData.nome,
                email: userData.email,
                senha: userData.senha,
                celular: userData.telefone,
                permissao: "Administrador"
            };

            const createResponse = await api.post('/usuario/', newUser);
            const createdUser = createResponse.data;

            // Fazer login automaticamente após o cadastro
            return await signIn(userData.email, userData.senha);

        } catch (error) {
            console.error('Erro no cadastro:', error);
            return {
                success: false,
                error: 'Erro ao criar conta. Tente novamente.'
            };
        }
    };

    const enterDemoMode = () => {
        setIsDemoMode(true);
        localStorage.setItem('@StockFlow:demoMode', 'true');
    };

    const signOut = () => {
        localStorage.removeItem('@StockFlow:user');
        localStorage.removeItem('@StockFlow:token');
        localStorage.removeItem('@StockFlow:demoMode');
        setUser(null);
        setIsDemoMode(false);
        delete api.defaults.headers.Authorization;
    };

    return (
        <AuthContext.Provider value={{
            user,
            isDemoMode,
            signIn,
            signUp,
            enterDemoMode,
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
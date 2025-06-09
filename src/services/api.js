import axios from "axios";

const api = axios.create({
    baseURL: 'http://192.168.0.102:8080/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 10000,
});

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            console.error('Erro de resposta:', error.response.status, error.response.data);
            return Promise.reject(error.response.data);
        } else if (error.request) {
            console.error('Sem resposta do servidor:', error.request);
            return Promise.reject({ message: 'Sem resposta do servidor' });
        } else {
            console.error('Erro ao configurar requisição:', error.message);
            return Promise.reject({ message: error.message });
        }
    }
);

export default api;
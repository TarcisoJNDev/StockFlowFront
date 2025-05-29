import axios from "axios";

// https://meusite.com.br/ws/blblblba/json/

const api = axios.create({
    baseURL:'http://192.168.0.102:8080/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api
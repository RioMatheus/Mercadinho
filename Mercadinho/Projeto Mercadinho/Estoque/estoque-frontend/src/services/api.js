import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080"
});

api.interceptors.response.use(
    response => response,
    error => {
        console.log("ERRO COMPLETO:", error);
        console.log("RESPONSE:", error.response);
        console.log("REQUEST:", error.request);
        return Promise.reject(error);
    }
);

export default api;
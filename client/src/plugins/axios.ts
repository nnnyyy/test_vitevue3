import axios from 'axios'

const instance = axios.create({
    baseURL: import.meta.env.VITE_TEST,
    headers: { "Content-Type": "application/json" }
});

instance.interceptors.request.use(
    (config) => {
        return config;
    },
    (err) => Promise.reject(err)
);

instance.interceptors.response.use(
    (res) => {
        return res;
    },
    (err) => Promise.reject(err)
);

export default instance;
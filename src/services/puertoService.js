// src/services/puertoService.js
import api from './api';

const puertoService = {
    // 1. LISTADO SIN PARAMETRIZAR
    getAll: async () => {
        const response = await api.get('/puertos');
        return response.data;
    },

    // 2. LISTADO PARAMETRIZADO (Filtros, paginación, orden)
    getFiltered: async (params) => {
        const response = await api.get('/puertos', { params });
        return response.data;
    },

    // 3. BUSCAR POR ID
    getById: async (id) => {
        const response = await api.get(`/puertos/${id}`);
        return response.data;
    },

    // 4. ALTA REGISTRO CON VALIDACIÓN
    create: async (puertoData) => {
        const response = await api.post('/puertos', puertoData);
        return response.data;
    },

    // 5. MODIFICACIÓN
    update: async (id, puertoData) => {
        const response = await api.put(`/puertos/${id}`, puertoData);
        if (response.data === 0) throw new Error("No se realizaron cambios en el registro");
        return response.data;
    },

    // 6. BORRADO
    delete: async (id) => {
        await api.delete(`/puertos/${id}`);
        return true;
    }
};

export default puertoService;
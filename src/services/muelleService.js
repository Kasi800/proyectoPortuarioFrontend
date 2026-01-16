// src/services/muelleService.js
import api from './api';

const muelleService = {
    // 1. LISTADO SIN PARAMETRIZAR
    getAll: async () => {
        const response = await api.get('/muelles');
        return response.data;
    },

    // 2. LISTADO PARAMETRIZADO (Filtros, paginación, orden)
    getFiltered: async (params) => {
        const response = await api.get('/muelles', { params });
        return response.data;
    },

    // 3. BUSCAR POR ID
    getById: async (id) => {
        const response = await api.get(`/muelles/${id}`);
        return response.data;
    },

    // 4. ALTA REGISTRO CON VALIDACIÓN
    create: async (muelleData) => {
        const response = await api.post('/muelles', muelleData);
        return response.data;
    },

    // 5. MODIFICACIÓN
    update: async (id, muelleData) => {
        const response = await api.put(`/muelles/${id}`, muelleData);
        if (response.data === 0) throw new Error("No se realizaron cambios en el registro");
        return response.data;
    },

    // 6. BORRADO
    delete: async (id) => {
        await api.delete(`/muelles/${id}`);
        return true;
    }
};

export default muelleService;
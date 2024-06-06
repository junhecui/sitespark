import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

export const createWidget = (widget) => axios.post(`${API_URL}/widget`, widget);

export const getWidgets = () => axios.get(`${API_URL}/widgets`);

export const updateWidget = (id, widget) => axios.put(`${API_URL}/widget/${id}`, widget);

export const deleteWidget = (id) => axios.delete(`${API_URL}/widget/${id}`);
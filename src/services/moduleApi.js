import api from "../utils/api";

export async function listItems(endpoint) {
  const res = await api.get(endpoint);
  return res.data;
}

export async function getItem(endpoint, id) {
  const res = await api.get(`${endpoint}/${id}`);
  return res.data;
}

export async function createItem(endpoint, data) {
  const res = await api.post(endpoint, data);
  return res.data;
}

export async function updateItem(endpoint, id, data) {
  const res = await api.put(`${endpoint}/${id}`, data);
  return res.data;
}

export async function deleteItem(endpoint, id) {
  await api.delete(`${endpoint}/${id}`);
}

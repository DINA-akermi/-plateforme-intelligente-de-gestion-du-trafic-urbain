import axios from 'axios';

const createService = (port) => {
  const instance = axios.create({
    baseURL: `http://localhost:${port}/api`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return instance;
};

export const authApi = createService(4001);
export const trafficApi = createService(4006);
export const incidentApi = createService(4004);
export const vehicleApi = createService(4003); // Assuming default
export const notificationApi = createService(4005);

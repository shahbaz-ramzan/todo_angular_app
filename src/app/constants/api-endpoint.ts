const BASE_URL = 'http://localhost:6001/api/v1';

export const AUTH_ENDPOINTS = {
  LOGIN: `${BASE_URL}/auth/login`,
  REGISTER: `${BASE_URL}/auth/register`,
};

export const TASK_ENDPOINTS = {
  CREATE: `${BASE_URL}/task/create`,
  GET_ALL: `${BASE_URL}/task/list`,
  GET_BY_ID: (id: string) => `${BASE_URL}/task/edit/${id}`,
  UPDATE: (id: string) => `${BASE_URL}/task/update/${id}`,
  DELETE: (id: string) => `${BASE_URL}/task/remove/${id}`,
};

export const SUBTASK_ENDPOINTS = {
  CREATE: (taskId: string) => `${BASE_URL}/task/${taskId}/subtask/create`,
  UPDATE: (taskId: string, subtaskId: string) =>
    `${BASE_URL}/task/${taskId}/subtask/edit/${subtaskId}`,
  DELETE: (taskId: string, subtaskId: string) =>
    `${BASE_URL}/task/${taskId}/subtask/remove/${subtaskId}`,
};

export const CATEGORY_ENDPOINTS = {
  GET_ALL: `${BASE_URL}/category/get-all`,
  CREATE: `${BASE_URL}/category/post`,
  DELETE: (id: string) => `${BASE_URL}/category/delete/${id}`,
};

import axios from 'axios';

// 백엔드 URL 관리 (마이그레이션 시 이 부분만 수정하면 됩니다)
export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 향후 회원관리 시스템 추가 시 토큰 처리를 위한 인터셉터 자리
apiClient.interceptors.request.use(
    (config) => {
        // const token = localStorage.getItem('token');
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;

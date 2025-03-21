import axios from 'axios';

export const refreshAccessToken = async (refreshToken) => {
    try {
        const response = await axios.post('http://localhost:8080/unlimitedmarketplace/auth/refresh-token', { refreshToken });
        if (response.status === 200) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            return response.data.accessToken;
        }
    } catch (error) {
        console.error("Failed to refresh tokens:", error);
        throw error;
    }
};

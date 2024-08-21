import {jwtDecode} from 'jwt-decode';

interface TokenPayload {
  id: string; 
}
export const getUserIdFromToken = (token: string): string | null => {
  try {
    const decodedToken = jwtDecode<TokenPayload>(token);
    return decodedToken.id || null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

const token = localStorage.getItem('access_token');
if (token) {
  const userId = getUserIdFromToken(token);
} else {
  console.error('Token is null or undefined');
}

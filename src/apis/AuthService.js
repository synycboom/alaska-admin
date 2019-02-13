import BaseService from './BaseService';
import { getCookie } from '../utils/cookie';

class AuthService extends BaseService {
  isAuthenticated() {
    return getCookie('logged_in') === 'true';
    // return !!localStorage.getItem('token');
  }

  authenticate(username, password) {
    return this.client
      .post('/api/v1.0/login/', { username, password })
      .then(({ data: { token } }) => {
        // localStorage.setItem('token', token);
      })
      .catch(this.handleError);
  }

  signout() {
    return this.client
      .post('/api/v1.0/logout/')
      .then(data => {
        // localStorage.removeItem('token');
        return data;
      })
      .catch(this.handleError);
  }
}

export default AuthService;

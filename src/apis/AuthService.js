import BaseService from './BaseService';

class AuthService extends BaseService {
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  authenticate(username, password) {
    return this.client.post('/admin-api/v1.0/get-token/', { username, password })
      .then(({data: { token }}) => {
        localStorage.setItem('token', token);
      })
      .catch(this.handleError)
  }
  
  signout() {
    localStorage.removeItem('token');
    return Promise.resolve();
  }
}

export default AuthService;
import BaseService from './BaseService';

class UserService extends BaseService {
  listInstructors = (currentPage, pageSize) => {
    return this.client.get('/admin-api/v1.0/users/instructor/', { 
      params: { page: currentPage, page_size: pageSize }
    })
      .then(res => res.data)
      .catch(this.handleError);
  };

  getInstructor = (id) => {
    return this.client.get(`/admin-api/v1.0/users/${id}/instructor/`)
      .then(res => res.data)
      .catch(this.handleError);
  };

  updateInstructor = (id, formData) => {
    return this.client.put(`/admin-api/v1.0/users/${id}/instructor/`, formData, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    })
      .then(res => res.data)
      .catch(this.handleError);
  };

  deleteInstructor = (id) => {
    return this.client.delete(`/admin-api/v1.0/users/${id}/instructor/`)
      .then(res => res.data)
      .catch(this.handleError);
  };

  createInstructor = (formData) => {
    return this.client.post('/admin-api/v1.0/users/instructor/', formData, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    })
      .then(res => res.data)
      .catch(this.handleError);
  };
}

export default UserService;
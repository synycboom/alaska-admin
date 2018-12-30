import BaseService from './BaseService';

class UploadedFileService extends BaseService {
  listUploadedFiles = (currentPage, pageSize) => {
    return this.client.get('/admin-api/v1.0/uploaded-files/', { 
      params: { page: currentPage, page_size: pageSize }
    })
      .then(res => res.data)
      .catch(this.handleError);
  };

  getUploadedFile = (id) => {
    return this.client.get(`/admin-api/v1.0/uploaded-files/${id}/`)
      .then(res => res.data)
      .catch(this.handleError);
  };

  updateUploadedFile = (id, data) => {
    return this.client.put(`/admin-api/v1.0/uploaded-files/${id}/`, data)
      .then(res => res.data)
      .catch(this.handleError);
  };

  deleteUploadedFile = (id) => {
    return this.client.delete(`/admin-api/v1.0/uploaded-files/${id}/`)
      .then(res => res.data)
      .catch(this.handleError);
  };

  createUploadedFile = (data) => {
    return this.client.post('/admin-api/v1.0/uploaded-files/', data)
      .then(res => res.data)
      .catch(this.handleError);
  };
}

export default UploadedFileService;
import BaseService from './BaseService';

class UploadedImageService extends BaseService {
  listUploadedImages = (currentPage, pageSize) => {
    return this.client.get('/admin-api/v1.0/uploaded-images/', { 
      params: { page: currentPage, page_size: pageSize }
    })
      .then(res => res.data)
      .catch(this.handleError);
  };

  getUploadedImage = (id) => {
    return this.client.get(`/admin-api/v1.0/uploaded-images/${id}/`)
      .then(res => res.data)
      .catch(this.handleError);
  };

  updateUploadedImage = (id, data) => {
    return this.client.put(`/admin-api/v1.0/uploaded-images/${id}/`, data)
      .then(res => res.data)
      .catch(this.handleError);
  };

  deleteUploadedImage = (id) => {
    return this.client.delete(`/admin-api/v1.0/uploaded-images/${id}/`)
      .then(res => res.data)
      .catch(this.handleError);
  };

  createUploadedImage = (data) => {
    return this.client.post('/admin-api/v1.0/uploaded-images/', data)
      .then(res => res.data)
      .catch(this.handleError);
  };
}

export default UploadedImageService;
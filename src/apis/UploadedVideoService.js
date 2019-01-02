import BaseService from './BaseService';

class UploadedVideoService extends BaseService {
  listUploadedVideos = (currentPage, pageSize) => {
    return this.client.get('/admin-api/v1.0/uploaded-videos/', { 
      params: { page: currentPage, page_size: pageSize }
    })
      .then(res => res.data)
      .catch(this.handleError);
  };

  getUploadedVideo = (id) => {
    return this.client.get(`/admin-api/v1.0/uploaded-videos/${id}/`)
      .then(res => res.data)
      .catch(this.handleError);
  };

  updateUploadedVideo = (id, data) => {
    return this.client.put(`/admin-api/v1.0/uploaded-videos/${id}/`, data)
      .then(res => res.data)
      .catch(this.handleError);
  };

  deleteUploadedVideo = (id) => {
    return this.client.delete(`/admin-api/v1.0/uploaded-videos/${id}/`)
      .then(res => res.data)
      .catch(this.handleError);
  };

  createUploadedVideo = (data) => {
    return this.client.post('/admin-api/v1.0/uploaded-videos/', data)
      .then(res => res.data)
      .catch(this.handleError);
  };
}

export default UploadedVideoService;
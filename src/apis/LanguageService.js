import BaseService from './BaseService';

class LanguageService extends BaseService {
  listLanguages = (currentPage, pageSize) => {
    return this.client.get('/admin-api/v1.0/languages/', { 
      params: { page: currentPage, page_size: pageSize }
    })
      .then(res => res.data)
      .catch(this.handleError);
  };

  getLangauge = (id) => {
    return this.client.get(`/admin-api/v1.0/languages/${id}/`)
      .then(res => res.data)
      .catch(this.handleError);
  };

  updateLangauge = (id, data) => {
    return this.client.put(`/admin-api/v1.0/languages/${id}/`, data)
      .then(res => res.data)
      .catch(this.handleError);
  };

  deleteLangauge = (id) => {
    return this.client.delete(`/admin-api/v1.0/languages/${id}/`)
      .then(res => res.data)
      .catch(this.handleError);
  };

  createLangauge = (data) => {
    return this.client.post('/admin-api/v1.0/languages/', data)
      .then(res => res.data)
      .catch(this.handleError);
  };
}

export default LanguageService;
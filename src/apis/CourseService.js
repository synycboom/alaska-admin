import BaseService from './BaseService';

class CourseService extends BaseService {
  listCoursesLanding = (currentPage, pageSize) => {
    return this.client.get('/admin-api/v1.0/courses-landing/', { 
      params: { page: currentPage, page_size: pageSize }
    })
      .then(res => res.data)
      .catch(this.handleError);
  };

  getCourseLanding = (id) => {
    return this.client.get(`/admin-api/v1.0/courses-landing/${id}/`)
      .then(res => res.data)
      .catch(this.handleError);
  };

  updateCourseLanding = (id, data) => {
    return this.client.put(`/admin-api/v1.0/courses-landing/${id}/`, data)
      .then(res => res.data)
      .catch(this.handleError);
  };

  deleteCourseLanding = (id) => {
    return this.client.delete(`/admin-api/v1.0/courses-landing/${id}/`)
      .then(res => res.data)
      .catch(this.handleError);
  };

  createCourseLanding = (data) => {
    return this.client.post('/admin-api/v1.0/courses-landing/', data)
      .then(res => res.data)
      .catch(this.handleError);
  };
}

export default CourseService;
import axios, { AxiosResponse } from 'axios';
import { makeAutoObservable } from 'mobx';
import SimDoc from 'src/models/simDoc';
class SimDocRepository {
  url = 'v1/simDocs';

  constructor() {
    makeAutoObservable(this);
  }

  async create(body: any): Promise<AxiosResponse<SimDoc>> {
    return axios.post(this.url, body);
  }

  async find(params: any): Promise<AxiosResponse<SimDoc[]>> {
    return axios.get(this.url, { params });
  }

  async findOne(params: any): Promise<AxiosResponse<SimDoc>> {
    return axios.get(this.url, {
      params,
    });
  }

  async update(body: any): Promise<AxiosResponse<SimDoc[]>> {
    return axios.patch(this.url, body);
  }

  async delete(params: any): Promise<AxiosResponse<SimDoc[]>> {
    return axios.delete(this.url, {
      params,
    });
  }
}
export default SimDocRepository;

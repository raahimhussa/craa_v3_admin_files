import axios, { AxiosResponse } from 'axios';
import { makeAutoObservable } from 'mobx';
import Log from 'src/models/log';
class LogRepository {
  url = 'v2/logs';
  constructor() {
    makeAutoObservable(this);
  }

  async create(body: any): Promise<AxiosResponse<Log>> {
    return axios.post(this.url, body);
  }

  async find(params: any): Promise<AxiosResponse<Log[]>> {
    return axios.get(this.url, { params });
  }

  async findOne(params: any): Promise<AxiosResponse<Log>> {
    return axios.get(this.url + '/custom', {
      params,
    });
  }

  async update(body: any): Promise<AxiosResponse<Log[]>> {
    return axios.patch(this.url, body);
  }

  async delete(params: any): Promise<AxiosResponse<Log[]>> {
    return axios.delete(this.url, {
      params,
    });
  }
}
export default LogRepository;

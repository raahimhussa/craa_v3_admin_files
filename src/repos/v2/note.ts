import axios, { AxiosResponse } from 'axios';
import { makeAutoObservable } from 'mobx';
import Note from 'src/models/note';
class NoteRepository {
  url = 'v2/notes';

  constructor() {
    makeAutoObservable(this);
  }

  *create(body: any): any {
    const res: AxiosResponse<Note> = yield axios.post(this.url, body);
    return res.data;
  }

  *find(params: any): any {
    const res: AxiosResponse<Note[]> = yield axios.get(this.url, { params });
    return res.data;
  }

  *findOne(params: any): any {
    const res: AxiosResponse<Note> = yield axios.get(this.url + '/custom', {
      params,
    });
    return res.data;
  }

  *update(body: any): any {
    const res: AxiosResponse<Note[]> = yield axios.patch(this.url, body);
    return res.data;
  }

  *delete(params: any) {
    const res: AxiosResponse<Note[]> = yield axios.delete(this.url, {
      params,
    });
    return res.data;
  }
}
export default NoteRepository;

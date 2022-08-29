import {IRepo} from './../model/repo.model';
export interface repoDto {
  q: string;
  sort?: keyof IRepo;
  order?: 'desc' | 'asc' | string;
  per_page?: number;
  page: number;
}

import { repoDto } from '@src/dto/repo.dto';
import { ILanguage, IRepoResponse } from '@src/model/repo.model';
import axios, { AxiosResponse } from 'axios';
import { request } from './interceptor';

const searchReposService = ( params: repoDto): Promise<AxiosResponse<IRepoResponse>> => {
  return request.get('/search/repositories', {params});
};

const getRepoLanguagesService = ( url: string): Promise<AxiosResponse<ILanguage>> => {
  return axios.get(url);
};

export const githubServices = {
  searchReposService,
  getRepoLanguagesService,
};

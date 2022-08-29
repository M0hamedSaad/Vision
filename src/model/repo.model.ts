export interface IRepoResponse {
  total_count: number;
  incomplete_results: boolean;
  items: IRepo[];
}

interface IOwner {
  login: string;
  id: number;
  avatar_url: string;
}

export interface ILanguage {
  [key: string]: number;
}

export interface IRepo {
  id: number;
  name: string;
  full_name: string;
  owner: IOwner;
  description: string;
  languages_url: string;
  isLiked?: boolean;
  isArchived?: boolean;
  languages: ILanguage;
}

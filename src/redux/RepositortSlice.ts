import {createAsyncThunk, createSlice, current} from '@reduxjs/toolkit';
import {repoDto} from '@src/dto/repo.dto';
import {IRepo} from '@src/model/repo.model';
import {githubServices} from '@src/services/githubServices';

interface IInitialState {
  repos: IRepo[];
  likedRepos: IRepo[];
  disLikedRepos: IRepo[];
  archivedRepos: IRepo[];

  searchHistory: {
    [key: string]: {
      data: IRepo[];
      lastPage: number;
      total_count: number;
    };
  };
  loading: boolean;
  error?: string;
  total_count: number;
  item?: IRepo;
  currentPage: number;
  q: string;
  order: string;
  archivedIndex: number;
}
const initialState = {
  repos: [],
  likedRepos: [],
  disLikedRepos: [],
  archivedRepos: [],
  searchHistory: {},
  loading: false,
  error: '',
  total_count: 0,
  item: undefined,
  currentPage: 1,
  q: '',
  order: 'asc',
  archivedIndex: 0,
} as IInitialState;

export const getRepos = createAsyncThunk(
  'repos/search',
  async (params: repoDto, thunkAPI) => {
    try {
      params.per_page = 20;
      params.sort = 'full_name';
      params.order = params.order ? params.order : undefined;
      console.log(params);

      const res = await githubServices.searchReposService(params);
      const results = customResponse(res.data.items);
      thunkAPI.dispatch(
        getLanguages({
          data: results,
          q: params.q,
          page: params.page,
          total_count: res.data.total_count,
        }),
      );
      return {
        order: params.order,
        results,
        q: params.q,
        total_count: res.data.total_count,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  },
);

export const getLanguages = createAsyncThunk(
  'repos/languages',
  async (
    {
      data,
      q,
      page,
      total_count,
    }: {data: IRepo[]; q: string; page: number; total_count: number},
    thunkAPI,
  ) => {
    try {
      const promises = data.map(async item => {
        try {
          const languages = await githubServices.getRepoLanguagesService(
            item.languages_url,
          );
          return languages.data;
        } catch (error) {
          return {};
        }
      });
      const allLanguages = await Promise.all(promises);
      const updatedRepo = data.map((i, index) => ({
        ...i,
        languages: allLanguages[index],
      }));
      return {
        updatedRepo,
        currentPage: page,
        q,
        searchHistory: {
          [q]: {
            data: updatedRepo,
            lastPage: page,
            total_count,
          },
        },
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  },
);

const customResponse = (data: Array<IRepo>) =>
  data.map(i => ({
    description: i.description,
    full_name: i.full_name,
    id: i.id,
    isArchived: i.isArchived,
    isLiked: i.isLiked,
    languages: i.languages,
    languages_url: i.languages_url,
    name: i.name,
    owner: i.owner,
  }));

// Then, handle actions in your reducers:
const repoSlice = createSlice({
  name: 'repos',
  initialState,
  reducers: {
    updateRepos: (state, action) => {
      state.repos = [...action.payload];
    },
    sorting: (state, action) => {
      state.repos = state.repos.sort((current, next) =>
        action.payload == 'asc'
          ? current.full_name.localeCompare(next.full_name)
          : next.full_name.localeCompare(current.full_name),
      );
    },
    archive: (state, action) => {
      state.archivedIndex = state.repos.findIndex(
        i => i.id == action.payload.item.id,
      );
      const updateRepos = state.repos.filter(
        i => i.id != action.payload.item.id,
      );
      state.repos = updateRepos;
      state.item = action.payload.item;
      const newData = [action.payload.item, ...state.archivedRepos];
      state.archivedRepos = newData;
      // action.payload.animateList();
      action.payload.showToastBtn('Undo');
    },
    undo: (state, action) => {
      console.log(
        action.payload.item.id,
        action.payload.item.owner.login,
        state.archivedIndex,
      );
      const updateArchiveRepos = state.archivedRepos.filter(
        i => i.id != action.payload.item.id,
      );
      state.archivedRepos = updateArchiveRepos;

      const data = [...state.repos];
      const deletedArray = data.splice(
        state.archivedIndex,
        0,
        action.payload.item,
      );
      state.repos = data;
      // action.payload.animateList();
    },
    like: (state, action) => {
      const isLikedBefore = state.likedRepos.find(
        i => i.id == action.payload.item.id,
      );

      if (!isLikedBefore) {
        const newResults = [action.payload.item, ...state.likedRepos];
        state.likedRepos = newResults;
        action.payload.showToast('Add to liked Repos successfully');
      }

      const isDislikedBefore = state.disLikedRepos?.findIndex(
        i => i.id == action.payload.item.id,
      );
      if (isDislikedBefore != -1) {
        const newResults = state.disLikedRepos.filter(
          i => i.id !== action.payload.item.id,
        );
        state.disLikedRepos = newResults;
      }
    },
    disLike: (state, action) => {
      const isLikedBefore = state.likedRepos.find(
        i => i.id == action.payload.item.id,
      );

      if (isLikedBefore) {
        const newResults = state.likedRepos.filter(
          i => i.id !== action.payload.item.id,
        );
        state.likedRepos = newResults;
      }

      const isDislikedBefore = state.disLikedRepos?.findIndex(
        i => i.id == action.payload.item.id,
      );
      if (isDislikedBefore == -1) {
        const newResults = [action.payload.item, ...state.disLikedRepos];
        state.disLikedRepos = newResults;
        action.payload.showToast('Add to disliked Repos successfully');
      }
    },
    selectItem: (state, action) => {
      state.item = action.payload.item;
    },
  },
  extraReducers: builder => {
    builder.addCase(getLanguages.fulfilled, (state, action) => {
      const payload = action.payload;

      state.loading = false;
      state.q = payload.q;
      state.currentPage = payload.currentPage;

      const inSearchHistory = Object.keys(state.searchHistory).includes(
        payload.q,
      );

      // update search history when pagination ...
      if (inSearchHistory && payload.currentPage > 1) {
        state.searchHistory[payload.q].lastPage = payload.currentPage;

        state.searchHistory[payload.q].data = [
          ...state.searchHistory[payload.q].data,
          ...payload.updatedRepo,
        ];
      } else {
        state.searchHistory = {
          ...state.searchHistory,
          ...payload.searchHistory,
        };
      }
      // state.searchHistory={}
      state.repos =
        payload.currentPage == 1
          ? payload.updatedRepo
          : [...state.repos, ...payload.updatedRepo];
    });

    builder.addCase(getLanguages.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(getRepos.fulfilled, (state, action) => {
      state.loading = true;
      state.order = action.payload.order ?? '';
      state.total_count = action.payload.total_count;
    });

    builder.addCase(getRepos.pending, (state, action) => {
      state.repos = [...state.repos];
      state.loading = true;
      state.currentPage = action.meta.arg.page;
    });

    builder.addCase(getRepos.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export default repoSlice.reducer;
export const {updateRepos, sorting, like, disLike, archive, undo, selectItem} =
  repoSlice.actions;

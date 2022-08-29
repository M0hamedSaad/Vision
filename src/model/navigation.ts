import {IRepo} from './repo.model';

export type RootStackParamList = {
  splashScreen: undefined;
  homeScreen: undefined;
  archiveScreen: undefined;
  favoriteScreen: undefined;
  bottomTabs: undefined;
  DetailsScreen: {
    item: IRepo;
  };
};

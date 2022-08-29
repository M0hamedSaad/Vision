import {IMAGES} from '@src/assets';
import {ScreenTemplate} from '@src/assets/templates';
import {getRepos, sorting, updateRepos} from '@src/redux/RepositortSlice';
import {AppDispatch, RootState} from '@src/redux/store';
import React, {useCallback, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

const tabs = [
  {
    activeIcon: IMAGES.ASCENDING_ACTIVE,
    inActiveIcon: IMAGES.ASCENDING,
    name: 'Ascending',
    value: 'asc',
  },
  {
    activeIcon: IMAGES.DESCENDING_ACTIVE,
    inActiveIcon: IMAGES.DESCENDING,
    name: 'Descending',
    value: 'desc',
  },
];

export const HomeScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    repos,
    searchHistory,
    total_count,
    currentPage,
    q,
    order,
    disLikedRepos,
  } = useSelector((state: RootState) => state.repoState);
  const [search, setSearch] = useState(q);
  const [timerId, setTimerId] = useState<NodeJS.Timeout>();
  const [selectedTab, setSelectedTab] = useState(order);

  // console.log({repos, disLikedRepos});

  const onSelectedTab = useCallback((tab: string) => {
    dispatch(sorting(tab));
  }, []);

  // searching when user stopped typing after 500ms
  const onChangeText = (text: string) => {
    setSearch(text.trim());
    if (timerId) clearTimeout(timerId);
    setTimerId(
      setTimeout(() => {
        if (text) searching(text);
        else dispatch(updateRepos([]));
      }, 500),
    );
  };

  // dispatch searching action
  const searching = (text: string) => {
    const keysHistory = Object.keys(searchHistory); // check if search key is searched before
    if (keysHistory.includes(text)) {
      dispatch(updateRepos(searchHistory[text].data));
    } else dispatch(getRepos({q: text, page: 1, order: selectedTab}));
  };

  // infinite scrolling , when reach the end of the page call the next page.
  const onEndReach = () => {
    let nextPage: number = 1;
    let total_count_check = 0;

    // check if search key is searched before to get last page and total counts items
    const keysHistory = Object.keys(searchHistory);

    if (keysHistory.includes(q)) {
      nextPage = searchHistory[q].lastPage + 1;
      total_count_check = searchHistory[q].total_count;
    } else {
      nextPage = currentPage + 1;
      total_count_check = total_count;
    }

    // console.log({total_count, nextPage, currentPage});
    if (nextPage != currentPage)
      if (repos.length < total_count_check) {
        dispatch(getRepos({q: search, page: nextPage, order: selectedTab}));
      }
  };

  // refreshing page get first page with default ordering
  const onRefresh = useCallback(() => {
    setSelectedTab(tabs[0].value);
    dispatch(getRepos({q: search, page: 1, order: tabs[0].value}));
  }, []);

  return (
    <ScreenTemplate
      data={repos}
      title={'Available Repos'}
      isSearch
      onChangeText={onChangeText}
      onEndReach={onEndReach}
      onRefresh={onRefresh}
      searching={searching}
      tabs={tabs}
      selectedTab={selectedTab}
      setSelectedTab={setSelectedTab}
      onSelectedTab={onSelectedTab}
      emptyMessage="No results found"
      defaultValue={q}
    />
  );
};

export default HomeScreen;

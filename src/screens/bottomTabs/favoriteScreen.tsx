import {IMAGES} from '@src/assets';
import {ScreenTemplate} from '@src/assets/templates';
import {IRepo} from '@src/model/repo.model';
import {RootState} from '@src/redux/store';
import React, {useCallback, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

const tabs = [
  {
    activeIcon: IMAGES.LIKE,
    inActiveIcon: IMAGES.LIKE,
    name: 'Like',
    value: 'Like',
  },
  {
    activeIcon: IMAGES.DISLIKE,
    inActiveIcon: IMAGES.DISLIKE,
    name: 'Dislike',
    value: 'Dislike',
  },
];

export const FavoriteScreen = () => {
  const {likedRepos, disLikedRepos} = useSelector(
    (state: RootState) => state.repoState,
  );

  // console.log({disLikedRepos, likedRepos});

  const [data, setData] = useState<Array<IRepo>>([]);
  const [selectedTab, setSelectedTab] = useState(tabs[0].value);

  const onSelectedTab = (tab: string) => {
    setData(tab == 'Like' ? likedRepos : disLikedRepos);
  };

  useEffect(() => {
    setData(selectedTab == 'Like' ? likedRepos : disLikedRepos);
  }, [disLikedRepos, likedRepos]);

  // searching when user stopped typing after 500ms
  const onChangeText = (text: string) => {
    if (text) searching(text);
    else {
      setData(selectedTab == 'Like' ? likedRepos : disLikedRepos);
    }
  };

  // dispatch searching action
  const searching = useCallback(
    (text: string) => {

      if (selectedTab == 'Like') {
        setData(
          likedRepos.filter(
            i =>
              i.owner.login.toLowerCase().match(text.toLowerCase().trim()) ||
              i.name.toLowerCase().match(text),
          ),
        );
      } else {
        setData(
          disLikedRepos.filter(
            i =>
              i.owner.login.toLowerCase().match(text.toLowerCase().trim()) ||
              i.name.toLowerCase().match(text),
          ),
        );
      }
    },
    [selectedTab],
  );

  return (
    <ScreenTemplate
      data={data}
      title={'Favorite Repos'}
      isSearch
      onChangeText={onChangeText}
      searching={searching}
      tabs={tabs}
      selectedTab={selectedTab}
      setSelectedTab={setSelectedTab}
      onSelectedTab={onSelectedTab}
      emptyMessage="No Data Found"
      isSuggestion={false}
    />
  );
};

export default FavoriteScreen;

import {IMAGES} from '@src/assets';
import {ScreenTemplate} from '@src/assets/templates';
import {IRepo} from '@src/model/repo.model';
import {AppDispatch, RootState} from '@src/redux/store';
import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

export const ArchiveScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {archivedRepos, item} = useSelector(
    (state: RootState) => state.repoState,
  );

  // console.log({archivedRepos});

  const [data, setData] = useState<Array<IRepo>>(archivedRepos);

  useEffect(() => {
    setData(archivedRepos);
  }, [archivedRepos]);

  // searching when user stopped typing after 500ms
  const onChangeText = (text: string) => {
    if (text) searching(text);
    else {
      setData(archivedRepos);
    }
  };

  // dispatch searching action
  const searching = useCallback((text: string) => {
    setData(
      archivedRepos.filter(
        i =>
          i.owner.login.toLowerCase().match(text.toLowerCase().trim()) ||
          i.name.toLowerCase().match(text),
      ),
    );
  }, []);

  return (
    <ScreenTemplate
      data={data}
      title={'Archive Repos'}
      isSearch
      onChangeText={onChangeText}
      searching={searching}
      emptyMessage="No Archived Found"
      isSuggestion={false}
    />
  );
};

export default ArchiveScreen;

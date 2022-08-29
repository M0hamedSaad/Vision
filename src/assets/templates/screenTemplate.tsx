import {
  DetailsCard,
  RepoCard,
  SearchInput,
  tabBtn,
  Tabs,
  Toast,
} from '@src/components';
import {IRepo} from '@src/model/repo.model';
import {
  archive,
  disLike,
  like,
  selectItem,
  undo,
} from '@src/redux/RepositortSlice';
import {AppDispatch, RootState} from '@src/redux/store';
import {COLORS, normalize, styleGuide} from '@src/utils';
import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  LayoutAnimation,
  Modal,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';

interface props {
  data: IRepo[];
  tabs?: tabBtn[];
  title: string;
  isSearch?: boolean;
  onChangeText?: (text: string) => void;
  searching?: (text: string) => void;
  onEndReach?: () => void;
  onRefresh?: () => void;
  setSelectedTab?: (type: string) => void;
  selectedTab?: string;
  onSelectedTab?: (type: string) => void;
  emptyMessage: string;
  isSuggestion?: boolean;
  defaultValue?: string;
  // archiveFn?:(item:IRepo)=>void
}

export const ScreenTemplate = memo(
  ({
    data,
    tabs,
    title,
    isSearch,
    onChangeText,
    searching,
    onEndReach,
    onRefresh,
    selectedTab,
    setSelectedTab,
    onSelectedTab,
    emptyMessage,
    isSuggestion = true,
    defaultValue,
  }: // archiveFn
  props) => {
    const dispatch = useDispatch<AppDispatch>();
    const {searchHistory, loading, item} = useSelector(
      (state: RootState) => state.repoState,
    );

    const [visible, setVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<IRepo>();
    const toastRef = useRef<any>();
    const simpleToastRef = useRef<any>();
    const flatListRef = useRef<FlatList>(null);

    // for animated flatlist layout
    const layoutAnimConfig = {
      duration: 300,
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
      delete: {
        duration: 100,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    };

    useEffect(() => {
      animateList();
    }, [data]);

    // onSelected tabs
    useEffect(() => {
      if (onSelectedTab && selectedTab) {
        onSelectedTab(selectedTab);
        data?.length > 0 &&
          flatListRef.current?.scrollToIndex({index: 0, animated: true});
      }
    }, [selectedTab]);

    const likeFn = (item: IRepo) => {
      dispatch(like({item, showToast}));
    };

    const disLikeFn = (item: IRepo) => {
      dispatch(disLike({item, showToast}));
    };

    const showToast = (message: string) => {
      simpleToastRef?.current?.showToast(message);
    };

    const showToastBtn = (message: string) => {
      toastRef?.current?.showToast(message);
    };

    const archiveFn = useCallback((item: IRepo) => {
      dispatch(archive({item, showToastBtn, animateList}));
    }, []);

    const animateList = () => {
      LayoutAnimation.configureNext(layoutAnimConfig);
    };

    const toastAction = useCallback(() => {
      dispatch(undo({item, showToast, animateList}));
    }, [item]);

    const onPress = (item: IRepo) => {
      setSelectedItem(item);
      dispatch(selectItem(item));
      setVisible(true);
    };

    const closeModal = useCallback(() => {
      setVisible(false);
    }, []);

    return (
      <View style={[styleGuide.screenContainer]}>
        {/**inset top for ios statusbar */}
        <SafeAreaView />
        {/**header */}
        <Text style={[styleGuide.Bold, styles.title]}>{title}</Text>
        <View style={styles.line} />

        {/**search bar */}
        {isSearch && onChangeText && searching && (
          <SearchInput
            setValue={onChangeText}
            defaultValue={defaultValue}
            placeholder="Search for a repo .."
            style={{marginVertical: normalize(23)}}
            searching={searching}
            isLoading={loading}
            suggestions={isSuggestion ? Object.keys(searchHistory) : []}
          />
        )}

        {/**tabs */}
        {tabs && setSelectedTab && selectedTab && (
          <Tabs
            tabs={tabs}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        )}

        {/**list */}
        <FlatList<IRepo>
          ref={flatListRef}
          refreshing={false}
          onRefresh={onRefresh}
          onEndReachedThreshold={0.5}
          onEndReached={onEndReach}
          data={data}
          contentContainerStyle={{
            paddingBottom: normalize(120),
          }}
          scrollEventThrottle={16}
          keyExtractor={(item, index) => item.id.toString() + index}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={[styleGuide.Medium, styles.notFound]}>
              {emptyMessage}
            </Text>
          }
          renderItem={({item}) => (
            <RepoCard
              item={item}
              likeFn={likeFn}
              disLikeFn={disLikeFn}
              archiveFn={archiveFn}
              onPress={onPress}
              isArchive={title == 'Available Repos'}
            />
          )}
        />
        {/**open pop up */}
        <Modal
          onRequestClose={closeModal}
          visible={visible}
          transparent
          animationType="fade">
          <DetailsCard closeModal={closeModal} item={selectedItem} />
        </Modal>
        {/**toast */}
        <Toast ref={toastRef} onPress={toastAction} />
        <Toast ref={simpleToastRef}/>

      </View>
    );
  },
);

const styles = StyleSheet.create({
  title: {
    fontSize: normalize(20),
    color: COLORS.PRIMARY,
    marginTop: normalize(40),
  },
  line: {
    width: normalize(50),
    height: 0.5,
    backgroundColor: COLORS.WHITE,
    marginTop: normalize(10),
  },
  notFound: {
    textAlign: 'center',
    color: COLORS.WHITE,
  },
});

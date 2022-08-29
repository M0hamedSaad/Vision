import {FONTS} from '@src/assets';
import {COLORS, normalize, styleGuide} from '@src/utils';
import React, {FC, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
interface InputProps extends TextInputProps {
  value?: string;
  setValue: (value: string) => void;
  style?: StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;
  placeholder?: string;
  suggestions?: string[];
  searching: (value: string) => void;
  isLoading: boolean;
}

export const SearchInput: FC<InputProps> = ({
  value,
  setValue,
  style,
  placeholder,
  suggestions,
  searching,
  isLoading,
  ...rest
}) => {
  const [top, setTop] = useState(0);
  const [isFocus, setIsFocus] = useState(false);
  const [valueText, setValueText] = useState('');

  const onLayout = (event: LayoutChangeEvent) => {
    var {y} = event.nativeEvent.layout;
    setTop(y);
  };

  const onFocus = () => {
    setIsFocus(true);
  };

  return (
    <View style={style}>
      <View style={[styles.inputContainer]}>
        <TextInput
          accessible
          onChangeText={text => {
            if (text) setIsFocus(true);
            else setIsFocus(false);
            setValue(text.trim());
            setValueText(text.trim());
          }}
          value={valueText}
          selectionColor={COLORS.PRIMARY}
          style={[styles.input]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.PLACE_HOLDER}
          autoCorrect={false}
          onFocus={onFocus}
          returnKeyType={'search'}
          onSubmitEditing={() => {
            searching(valueText);
            setIsFocus(false);
          }}
          {...rest}
        />
        {isLoading && (
          <ActivityIndicator color={'#fff'} style={{marginEnd: 'auto'}} />
        )}
      </View>

      <View onLayout={onLayout} />

      {isFocus && suggestions && suggestions?.length > 0 && (
        <View style={[styles.suggestionsContainer, {top}]}>
          <TouchableOpacity
            style={styles.close}
            onPress={() => setIsFocus(false)}>
            <Icon
              name="close-circle"
              size={normalize(20)}
              color={COLORS.THIRD}
            />
          </TouchableOpacity>

          <FlatList
            keyboardShouldPersistTaps="handled"
            data={suggestions}
            keyExtractor={(item, index) => index.toString()}
            persistentScrollbar
            renderItem={({item}) => {
              return (
                <Text
                  onPress={() => {
                    setValueText(item);
                    setValue(item);
                    searching(item);
                    setIsFocus(false);
                    // clearTimeout(timerId);
                    Keyboard.dismiss();
                  }}
                  style={[
                    styleGuide.Medium,
                    {color: COLORS.WHITE, marginBottom: 10, flex: 1},
                  ]}>
                  <Icon name="arrow-top-right" color={COLORS.THIRD} size={20} />
                  {'    ' + item}
                </Text>
              );
            }}
          />
        </View>
      )}
    </View>
  );
};

export default SearchInput;

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    borderWidth: 0.5,
    borderColor: COLORS.PRIMARY,
    borderRadius: normalize(12),

    paddingHorizontal: normalize(16),
    fontSize: normalize(16),
    height: normalize(52),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    color: '#fff',
    textAlign: 'left',
    fontFamily: FONTS.MEDIUM,
    flex: 1,
  },
  suggestionsContainer: {
    position: 'absolute',
    backgroundColor: COLORS.SECONDARY,
    maxHeight: normalize(200),
    width: '100%',
    alignSelf: 'center',
    borderRadius: normalize(12),
    padding: normalize(16),
    zIndex: 1,
  },
  close: {
    position: 'absolute',
    top: normalize(16),
    right: normalize(16),
    zIndex: 1,
  },
});

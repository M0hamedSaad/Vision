import {FONTS} from '@src/assets';
import {StyleSheet} from 'react-native';
import {normalize} from './normalize';

export const styleGuide = StyleSheet.create({
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  simpleRow: {
    flexDirection: 'row',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: normalize(16),
  },
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
  },
  Regular: {
    textAlign: 'left',
    color: '#000',
    fontFamily: FONTS.REGULAR,
    fontSize: 14,
  },
  Medium: {
    textAlign: 'left',
    color: '#000',
    fontSize: normalize(16),
    fontFamily: FONTS.MEDIUM,
  },

  Bold: {
    textAlign: 'left',
    color: '#000',
    fontSize: normalize(16),
    fontFamily: FONTS.BOLD,
  },

  semiBold: {
    textAlign: 'left',
    color: '#000',
    fontSize: normalize(16),
    fontFamily: FONTS.SEMI_BOLD,
  },
});

import {Platform} from 'react-native';

export const FONTS = {
  BOLD: Platform.OS == 'ios' ? 'Montserrat Bold' : 'Montserrat-Bold',
  MEDIUM: Platform.OS == 'ios' ? 'Montserrat Medium' : 'Montserrat-Medium',
  REGULAR: Platform.OS == 'ios' ? 'Montserrat Regular' : 'Montserrat-Regular',
  SEMI_BOLD:
    Platform.OS == 'ios' ? 'Montserrat SemiBold' : 'Montserrat-SemiBold',
};

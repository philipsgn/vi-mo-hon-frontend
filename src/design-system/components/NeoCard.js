import React from 'react';
import { StyleSheet, View } from 'react-native';
import { neoColors, neoBorders, neoRadii, neoShadows } from '../tokens';

/**
 * NeoCard - Thẻ nội dung viền đen dày, bóng cứng không mờ
 * @param {object} props
 * @param {string} [props.bg='white'] - Màu nền hoặc mã màu
 * @param {number} [props.borderWidth=2] - Độ dày viền
 * @param {React.ReactNode} props.children
 * @param {object} [props.style]
 */
export function NeoCard({
  bg = 'white',
  borderWidth = neoBorders.default,
  children,
  style,
  ...rest
}) {
  const getBgColor = () => {
    switch (bg) {
      case 'yellow': return neoColors.yellow;
      case 'mint': return neoColors.mint;
      case 'coral': return neoColors.coral;
      case 'purple': return neoColors.purple;
      case 'lime': return neoColors.lime;
      case 'gray': return neoColors.grayLight;
      case 'white': return neoColors.white;
      default: return bg;
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: getBgColor(),
          borderWidth,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderColor: neoColors.black,
    borderRadius: neoRadii.lg,
    padding: 16,
    shadowColor: neoShadows.card.shadowColor,
    shadowOffset: neoShadows.card.shadowOffset,
    shadowOpacity: neoShadows.card.shadowOpacity,
    shadowRadius: neoShadows.card.shadowRadius,
    elevation: neoShadows.card.elevation,
  },
});

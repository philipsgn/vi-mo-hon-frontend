import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { neoColors, neoBorders, neoRadii } from '../tokens';

/**
 * NeoBadge - Huy hiệu / Thẻ phân loại viền đen
 * @param {object} props
 * @param {string} [props.bg='yellow'] - 'yellow' | 'mint' | 'coral' | 'purple' | 'lime' | 'black' | 'white'
 * @param {string|React.ReactNode} props.children
 * @param {object} [props.style]
 * @param {object} [props.textStyle]
 */
export function NeoBadge({
  bg = 'yellow',
  children,
  style,
  textStyle,
  ...rest
}) {
  const getBgColor = () => {
    switch (bg) {
      case 'mint': return neoColors.mint;
      case 'coral': return neoColors.coral;
      case 'purple': return neoColors.purple;
      case 'lime': return neoColors.lime;
      case 'black': return neoColors.black;
      case 'white': return neoColors.white;
      case 'yellow':
      default:
        return neoColors.yellow;
    }
  };

  const getTextColor = () => {
    if (bg === 'black') return neoColors.white;
    return neoColors.black;
  };

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: getBgColor(),
        },
        style,
      ]}
      {...rest}
    >
      {typeof children === 'string' ? (
        <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderColor: neoColors.black,
    borderWidth: neoBorders.default,
    borderRadius: neoRadii.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});

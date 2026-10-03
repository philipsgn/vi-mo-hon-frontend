import React from 'react';
import { StyleSheet, View } from 'react-native';
import { neoColors, neoBorders, neoRadii } from '../tokens';

/**
 * NeoProgressBar - Thanh máu Boss / Tiến trình EXP phong cách Game RPG
 * @param {object} props
 * @param {number} props.progress - Giá trị từ 0 đến 1 (ví dụ 0.65 = 65%)
 * @param {string} [props.fillColor='coral'] - 'coral' | 'yellow' | 'mint' | 'lime' | 'purple'
 * @param {number} [props.height=14]
 * @param {object} [props.style]
 */
export function NeoProgressBar({
  progress = 0,
  fillColor = 'coral',
  height = 14,
  style,
  ...rest
}) {
  const clampedProgress = Math.max(0, Math.min(1, Number(progress) || 0));
  const percentage = `${Math.round(clampedProgress * 100)}%`;

  const getBarColor = () => {
    switch (fillColor) {
      case 'yellow': return neoColors.yellow;
      case 'mint': return neoColors.mint;
      case 'lime': return neoColors.lime;
      case 'purple': return neoColors.purple;
      case 'coral':
      default:
        return neoColors.coral;
    }
  };

  return (
    <View
      style={[
        styles.track,
        {
          height,
        },
        style,
      ]}
      {...rest}
    >
      <View
        style={[
          styles.fill,
          {
            backgroundColor: getBarColor(),
            width: percentage,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: neoColors.grayLight,
    borderColor: neoColors.black,
    borderWidth: neoBorders.default,
    borderRadius: neoRadii.sm,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
  },
});

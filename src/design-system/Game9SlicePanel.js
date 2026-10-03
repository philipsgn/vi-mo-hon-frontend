import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

// Import default ancient wood 9-slice pieces
const DEFAULT_SLICES = {
  tl: require('../../assets/game-ui/panels/panel_wood_9slice/slice_tl.webp'),
  t: require('../../assets/game-ui/panels/panel_wood_9slice/slice_t.webp'),
  tr: require('../../assets/game-ui/panels/panel_wood_9slice/slice_tr.webp'),
  l: require('../../assets/game-ui/panels/panel_wood_9slice/slice_l.webp'),
  c: require('../../assets/game-ui/panels/panel_wood_9slice/slice_c.webp'),
  r: require('../../assets/game-ui/panels/panel_wood_9slice/slice_r.webp'),
  bl: require('../../assets/game-ui/panels/panel_wood_9slice/slice_bl.webp'),
  b: require('../../assets/game-ui/panels/panel_wood_9slice/slice_b.webp'),
  br: require('../../assets/game-ui/panels/panel_wood_9slice/slice_br.webp'),
};

/**
 * Game9SlicePanel - Cross-platform 9-slice scaling panel for Expo / React Native.
 * Compatible with iOS, Android, and Web without native dependencies or Android capInsets bugs.
 */
export function Game9SlicePanel({
  children,
  style,
  contentStyle,
  slices = DEFAULT_SLICES,
  cornerLeft = 50,
  cornerRight = 50,
  cornerTop = 115,
  cornerBottom = 40,
}) {
  return (
    <View style={[styles.container, style]}>
      {/* Absolute 9-Slice Background Grid */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {/* Top Row */}
        <View style={[styles.row, { height: cornerTop }]}>
          <Image source={slices.tl} style={{ width: cornerLeft, height: cornerTop }} resizeMode="stretch" />
          <Image source={slices.t} style={[styles.flex1, { height: cornerTop }]} resizeMode="stretch" />
          <Image source={slices.tr} style={{ width: cornerRight, height: cornerTop }} resizeMode="stretch" />
        </View>

        {/* Center Row */}
        <View style={[styles.row, styles.flex1]}>
          <Image source={slices.l} style={{ width: cornerLeft, height: '100%' }} resizeMode="stretch" />
          <Image source={slices.c} style={[styles.flex1, { height: '100%' }]} resizeMode="stretch" />
          <Image source={slices.r} style={{ width: cornerRight, height: '100%' }} resizeMode="stretch" />
        </View>

        {/* Bottom Row */}
        <View style={[styles.row, { height: cornerBottom }]}>
          <Image source={slices.bl} style={{ width: cornerLeft, height: cornerBottom }} resizeMode="stretch" />
          <Image source={slices.b} style={[styles.flex1, { height: cornerBottom }]} resizeMode="stretch" />
          <Image source={slices.br} style={{ width: cornerRight, height: cornerBottom }} resizeMode="stretch" />
        </View>
      </View>

      {/* Foreground Content */}
      <View style={[styles.content, { paddingTop: cornerTop * 0.4, paddingBottom: cornerBottom * 0.6, paddingHorizontal: cornerLeft * 0.5 }, contentStyle]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    minWidth: 160,
    minHeight: 180,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
  },
  flex1: {
    flex: 1,
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
});

export default Game9SlicePanel;

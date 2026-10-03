import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { retroColors, retroRadii, retroSpacing, retroTypography } from '../../theme/retroTokens.js';

export function RetroProgressBar({
  current = 0,
  max = 100,
  color = retroColors.accentBrick,
  height = 12,
  label = null,
  showValue = false,
  style,
}) {
  const percentage = Math.max(0, Math.min(100, max > 0 ? (current / max) * 100 : 0));

  return (
    <View style={[styles.container, style]}>
      {label || showValue ? (
        <View style={styles.labelRow}>
          {label ? <Text style={styles.labelText}>{label}</Text> : <View />}
          {showValue ? (
            <Text style={styles.valueText}>
              {current} / {max}
            </Text>
          ) : null}
        </View>
      ) : null}

      <View style={[styles.track, { height, borderRadius: height / 2 }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${percentage}%`,
              backgroundColor: color,
              borderRadius: height / 2,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: retroSpacing.xs,
  },
  labelText: {
    fontSize: retroTypography.fontSizes.caption,
    fontWeight: retroTypography.fontWeights.bold,
    color: retroColors.textSecondary,
  },
  valueText: {
    fontSize: retroTypography.fontSizes.caption,
    fontWeight: retroTypography.fontWeights.heavy,
    color: retroColors.textPrimary,
  },
  track: {
    backgroundColor: retroColors.surfaceSubtle,
    borderColor: retroColors.borderSubtle,
    borderWidth: 1.2,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
  },
});

export default RetroProgressBar;

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * GameEnergyBar - Arcade RPG energy bar for HP, Daily Budget, and Mana.
 */
export function GameEnergyBar({
  label,
  valueText,
  current = 0,
  max = 100,
  fillColor,
  icon,
  height = 14,
  style,
}) {
  const safeMax = max <= 0 ? 1 : max;
  const ratio = Math.max(0, Math.min(1, current / safeMax));
  const percent = Math.round(ratio * 100);

  // Default color if not specified
  const effectiveColor = fillColor || (ratio > 0.8 ? '#FF5C5C' : ratio > 0.5 ? '#FBBF24' : '#22C55E');

  return (
    <View style={[styles.container, style]}>
      {label || valueText ? (
        <View style={styles.headerRow}>
          <View style={styles.labelWrap}>
            {icon ? (
              <Ionicons
                name={icon}
                size={14}
                color={effectiveColor}
                style={styles.icon}
              />
            ) : null}
            <Text style={styles.label} numberOfLines={1}>
              {label}
            </Text>
          </View>
          <Text style={styles.valueText} numberOfLines={1}>
            {valueText || `${current}/${max} (${percent}%)`}
          </Text>
        </View>
      ) : null}

      <View style={[styles.track, { height }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${percent}%`,
              backgroundColor: effectiveColor,
            },
          ]}
        />
        <View style={styles.shine} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  labelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 4,
  },
  label: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  valueText: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  track: {
    width: '100%',
    backgroundColor: '#0F172A',
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#334155',
    position: 'relative',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
});

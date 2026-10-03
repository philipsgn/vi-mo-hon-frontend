import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * GameRailIcon - Circular HUD action icon flanking the left/right screen rails.
 * Complies with Apple HIG minimum 48x48pt touch targets.
 */
export function GameRailIcon({
  icon,
  label,
  badge,
  badgeColor = '#E11D48',
  accentColor = '#38BDF8',
  onPress,
  style,
  side = 'left', // 'left' | 'right'
  disabled = false,
  testID,
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      style={[
        styles.railButton,
        side === 'right' ? styles.railButtonRight : styles.railButtonLeft,
        { borderColor: accentColor },
        disabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.iconContainer}>
        {typeof icon === 'string' ? (
          <Ionicons name={icon} size={24} color={accentColor} />
        ) : (
          icon
        )}
        {badge !== undefined && badge !== null && badge !== '' ? (
          <View style={[styles.badge, { backgroundColor: badgeColor }]}>
            <Text style={styles.badgeText} numberOfLines={1}>
              {badge}
            </Text>
          </View>
        ) : null}
      </View>
      {label ? (
        <Text
          style={[styles.label, { color: '#F8FAFC' }]}
          numberOfLines={1}
        >
          {label}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  railButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 6,
  },
  railButtonLeft: {
    marginLeft: 12,
  },
  railButtonRight: {
    marginRight: 12,
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -12,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  label: {
    position: 'absolute',
    bottom: -15,
    fontSize: 9,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    textAlign: 'center',
    width: 72,
  },
  disabled: {
    opacity: 0.5,
  },
});

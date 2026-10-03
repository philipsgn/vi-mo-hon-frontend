import React from 'react';
import { View, StyleSheet } from 'react-native';
import { retroColors, retroRadii, retroSpacing, retroShadows } from '../../theme/retroTokens.js';

export function RetroCard({
  children,
  style,
  variant = 'default', // 'default' | 'subtle' | 'highlight'
  ...props
}) {
  return (
    <View
      style={[
        styles.card,
        variant === 'subtle' && styles.subtleCard,
        variant === 'highlight' && styles.highlightCard,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: retroColors.surface,
    borderColor: retroColors.border,
    borderWidth: 1.5,
    borderRadius: retroRadii.lg,
    padding: retroSpacing.lg,
    ...retroShadows.card,
  },
  subtleCard: {
    backgroundColor: retroColors.surfaceSubtle,
    borderColor: retroColors.borderSubtle,
    borderWidth: 1,
    ...retroShadows.subtle,
  },
  highlightCard: {
    backgroundColor: retroColors.surface,
    borderColor: retroColors.accentAmber,
    borderWidth: 2,
    borderBottomWidth: 3.5,
    borderBottomColor: retroColors.accentAmberPressed,
  },
});

export default RetroCard;

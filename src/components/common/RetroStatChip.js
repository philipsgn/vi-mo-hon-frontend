import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { retroColors, retroRadii, retroSpacing, retroTypography } from '../../theme/retroTokens.js';

export function RetroStatChip({
  iconName = 'star',
  iconColor = retroColors.accentAmber,
  label = '',
  value = '',
  onPress,
  style,
  ...props
}) {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.chip, style]}
      {...props}
    >
      <View style={[styles.iconWrap, { backgroundColor: iconColor + '20' }]}>
        <Ionicons name={iconName} size={15} color={iconColor} />
      </View>
      <View style={styles.textWrap}>
        <Text numberOfLines={1} style={styles.valueText}>
          {value}
        </Text>
        {label ? (
          <Text numberOfLines={1} style={styles.labelText}>
            {label}
          </Text>
        ) : null}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: retroColors.surface,
    borderColor: retroColors.borderSubtle,
    borderWidth: 1.2,
    borderRadius: retroRadii.md,
    paddingVertical: 6,
    paddingHorizontal: retroSpacing.sm,
    minHeight: 40,
    flex: 1,
    marginHorizontal: 3,
  },
  iconWrap: {
    width: 26,
    height: 26,
    borderRadius: retroRadii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: retroSpacing.xs,
  },
  textWrap: {
    flex: 1,
  },
  valueText: {
    fontSize: retroTypography.fontSizes.caption,
    fontWeight: retroTypography.fontWeights.heavy,
    color: retroColors.textPrimary,
  },
  labelText: {
    fontSize: retroTypography.fontSizes.tiny,
    fontWeight: retroTypography.fontWeights.medium,
    color: retroColors.textSecondary,
    marginTop: -1,
  },
});

export default RetroStatChip;

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { retroColors, retroRadii, retroSpacing, retroTypography } from '../../theme/retroTokens.js';
import { RetroButton } from './RetroButton.js';

export function RetroEmptyState({
  iconName = 'receipt-outline',
  iconColor = retroColors.textSecondary,
  title = 'Chưa có dữ liệu',
  description = '',
  actionTitle = null,
  onActionPress = null,
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconCircle}>
        <Ionicons name={iconName} size={36} color={iconColor} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {actionTitle && onActionPress ? (
        <RetroButton
          title={actionTitle}
          onPress={onActionPress}
          variant="primary"
          size="sm"
          style={styles.actionBtn}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: retroSpacing.xl,
    backgroundColor: retroColors.surfaceSubtle,
    borderRadius: retroRadii.lg,
    borderWidth: 1.2,
    borderStyle: 'dashed',
    borderColor: retroColors.borderSubtle,
    marginVertical: retroSpacing.md,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: retroColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: retroSpacing.md,
    borderWidth: 1,
    borderColor: retroColors.borderSubtle,
  },
  title: {
    fontSize: retroTypography.fontSizes.titleMd,
    fontWeight: retroTypography.fontWeights.heavy,
    color: retroColors.textPrimary,
    textAlign: 'center',
    marginBottom: retroSpacing.xs,
  },
  description: {
    fontSize: retroTypography.fontSizes.body,
    color: retroColors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: retroSpacing.md,
  },
  actionBtn: {
    marginTop: retroSpacing.xs,
  },
});

export default RetroEmptyState;

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { retroColors, retroRadii, retroSpacing, retroTypography } from '../../theme/retroTokens.js';

export function RetroButton({
  title,
  label,
  children,
  onPress,
  variant = 'primary', // 'primary' | 'brick' | 'moss' | 'outline' | 'ghost'
  size = 'md',        // 'sm' | 'md' | 'lg'
  disabled = false,
  loading = false,
  icon = null,
  style,
  textStyle,
  ...props
}) {
  const displayText = title || label || (typeof children === 'string' ? children : null);

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.buttonBase,
        styles[variant] || styles.primary,
        styles[`size_${size}`] || styles.size_md,
        disabled && styles.disabledBtn,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? retroColors.textPrimary : '#FFFFFF'} />
      ) : (
        <View style={styles.contentRow}>
          {icon ? <View style={styles.iconWrap}>{icon}</View> : null}
          {displayText ? (
            <Text
              style={[
                styles.textBase,
                styles[`text_${variant}`] || styles.text_primary,
                styles[`textSize_${size}`] || styles.textSize_md,
                disabled && styles.disabledText,
                textStyle,
              ]}
            >
              {displayText}
            </Text>
          ) : (
            children
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonBase: {
    borderRadius: retroRadii.md,
    borderWidth: 1.5,
    borderColor: retroColors.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    minHeight: 44, // Chuẩn Apple HIG touch target
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    marginRight: retroSpacing.xs,
  },
  textBase: {
    fontWeight: retroTypography.fontWeights.heavy,
    textAlign: 'center',
  },

  // Variants
  primary: {
    backgroundColor: retroColors.accentAmber,
    borderColor: retroColors.border,
    borderBottomWidth: 3.5,
    borderBottomColor: retroColors.accentAmberPressed,
  },
  text_primary: {
    color: '#FFFFFF',
  },

  brick: {
    backgroundColor: retroColors.accentBrick,
    borderColor: retroColors.border,
    borderBottomWidth: 3.5,
    borderBottomColor: retroColors.accentBrickPressed,
  },
  text_brick: {
    color: '#FFFFFF',
  },

  moss: {
    backgroundColor: retroColors.accentMoss,
    borderColor: retroColors.border,
    borderBottomWidth: 3.5,
    borderBottomColor: retroColors.accentMossPressed,
  },
  text_moss: {
    color: '#FFFFFF',
  },

  outline: {
    backgroundColor: retroColors.surface,
    borderColor: retroColors.border,
    borderBottomWidth: 2.5,
    borderBottomColor: retroColors.borderSubtle,
  },
  text_outline: {
    color: retroColors.textPrimary,
  },

  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    minHeight: 36,
  },
  text_ghost: {
    color: retroColors.textSecondary,
  },

  // Sizes
  size_sm: {
    paddingVertical: 6,
    paddingHorizontal: retroSpacing.sm,
    minHeight: 36,
  },
  textSize_sm: {
    fontSize: retroTypography.fontSizes.caption,
  },

  size_md: {
    paddingVertical: 10,
    paddingHorizontal: retroSpacing.lg,
    minHeight: 44,
  },
  textSize_md: {
    fontSize: retroTypography.fontSizes.body,
  },

  size_lg: {
    paddingVertical: 14,
    paddingHorizontal: retroSpacing.xl,
    minHeight: 52,
  },
  textSize_lg: {
    fontSize: retroTypography.fontSizes.titleMd,
  },

  // Disabled
  disabledBtn: {
    backgroundColor: retroColors.surfaceSubtle,
    borderColor: retroColors.borderSubtle,
    borderBottomWidth: 1.5,
    borderBottomColor: retroColors.borderSubtle,
    opacity: 0.6,
  },
  disabledText: {
    color: retroColors.textMuted,
  },
});

export default RetroButton;

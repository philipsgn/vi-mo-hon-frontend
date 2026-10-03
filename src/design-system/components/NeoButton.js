import React, { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { neoColors, neoBorders, neoRadii, neoShadows } from '../tokens';

/**
 * NeoButton - Nút bấm Neo-Brutalism với hiệu ứng nhấn lún bóng cứng
 * @param {object} props
 * @param {string} [props.variant='yellow'] - 'yellow' | 'mint' | 'coral' | 'white' | 'purple' | 'black'
 * @param {string} [props.size='md'] - 'sm' | 'md' | 'lg'
 * @param {boolean} [props.disabled=false]
 * @param {function} props.onPress
 * @param {string|React.ReactNode} props.children
 * @param {object} [props.style]
 * @param {object} [props.textStyle]
 */
export function NeoButton({
  variant = 'yellow',
  size = 'md',
  disabled = false,
  onPress,
  children,
  style,
  textStyle,
  ...rest
}) {
  const [isPressed, setIsPressed] = useState(false);

  const getBgColor = () => {
    if (disabled) return neoColors.grayLight;
    switch (variant) {
      case 'mint': return neoColors.mint;
      case 'coral': return neoColors.coral;
      case 'white': return neoColors.white;
      case 'purple': return neoColors.purple;
      case 'black': return neoColors.black;
      case 'yellow':
      default:
        return neoColors.yellow;
    }
  };

  const getTextColor = () => {
    if (disabled) return neoColors.grayMuted;
    if (variant === 'black') return neoColors.white;
    return neoColors.black;
  };

  const paddingVertical = size === 'sm' ? 8 : size === 'lg' ? 16 : 12;
  const paddingHorizontal = size === 'sm' ? 12 : size === 'lg' ? 24 : 16;
  const fontSize = size === 'sm' ? 12 : size === 'lg' ? 16 : 14;

  return (
    <Pressable
      onPress={disabled ? null : onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={[
        styles.button,
        {
          backgroundColor: getBgColor(),
          paddingVertical,
          paddingHorizontal,
          transform: isPressed ? [{ translateX: 2 }, { translateY: 2 }] : [{ translateX: 0 }, { translateY: 0 }],
          shadowOffset: isPressed ? { width: 0, height: 0 } : neoShadows.default.shadowOffset,
          elevation: isPressed ? 0 : neoShadows.default.elevation,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
      {...rest}
    >
      {typeof children === 'string' ? (
        <Text style={[styles.text, { color: getTextColor(), fontSize }, textStyle]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderColor: neoColors.black,
    borderWidth: neoBorders.default,
    borderRadius: neoRadii.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: neoShadows.default.shadowColor,
    shadowOpacity: neoShadows.default.shadowOpacity,
    shadowRadius: neoShadows.default.shadowRadius,
  },
  text: {
    fontWeight: '900',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});

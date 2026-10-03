import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { neoColors, neoBorders, neoRadii, neoShadows } from '../tokens';

/**
 * NeoInput - Ô nhập liệu viền đen dứt khoát
 * @param {object} props
 * @param {string} [props.label]
 * @param {string} [props.error]
 * @param {string} [props.hint]
 * @param {object} [props.containerStyle]
 * @param {object} [props.inputStyle]
 */
export function NeoInput({
  label,
  error,
  hint,
  containerStyle,
  inputStyle,
  ...inputProps
}) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <TextInput
        placeholderTextColor={neoColors.grayMuted}
        style={[
          styles.input,
          error ? styles.inputError : null,
          inputStyle,
        ]}
        {...inputProps}
      />

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : hint ? (
        <Text style={styles.hintText}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
    width: '100%',
  },
  label: {
    color: neoColors.black,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: neoColors.white,
    borderColor: neoColors.black,
    borderWidth: neoBorders.default,
    borderRadius: neoRadii.md,
    color: neoColors.black,
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: neoShadows.default.shadowColor,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  inputError: {
    borderColor: neoColors.coral,
    backgroundColor: '#FFF0F0',
  },
  errorText: {
    color: neoColors.coral,
    fontSize: 11,
    fontWeight: '700',
  },
  hintText: {
    color: neoColors.grayMuted,
    fontSize: 11,
    fontWeight: '500',
  },
});

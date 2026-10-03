import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Pressable } from 'react-native';
import { BUILD_INFO } from '../config/buildInfo.cjs';
import { FEATURE_FLAGS } from '../config/features.cjs';

export class DevErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[DEV ERROR BOUNDARY CAUGHT ERROR]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>🚨 REACT NATIVE RENDER ERROR</Text>
          <Text style={styles.errorMessage}>{this.state.error?.toString()}</Text>
          <Text style={styles.errorStack}>
            {this.state.errorInfo?.componentStack || this.state.error?.stack}
          </Text>
          <Pressable
            style={styles.retryBtn}
            onPress={() => this.setState({ hasError: false, error: null, errorInfo: null })}
          >
            <Text style={styles.retryText}>THỬ LẠI (RESET ERROR)</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}

export function DevDebugOverlay({
  activeTab = 'home',
  userId = null,
  hasDashboard = false,
  lastError = '',
  layoutMetrics = {},
}) {
  if (typeof __DEV__ === 'undefined' || !__DEV__) {
    return null;
  }

  return (
    <View style={styles.overlayContainer} pointerEvents="none">
      <View style={styles.badge}>
        <Text style={styles.badgeTitle}>🛠️ DEV DEBUG ({BUILD_INFO.BUILD_ID})</Text>
        <Text style={styles.badgeLine}>
          KIT: {FEATURE_FLAGS.USE_GAME_KIT ? 'ON' : 'OFF'} | DOCK: {FEATURE_FLAGS.USE_GAME_NAV_DOCK ? 'ON' : 'OFF'} | TAB: {activeTab}
        </Text>
        <Text style={styles.badgeLine}>
          User: {userId ? 'OK' : 'NULL'} | Dash: {hasDashboard ? 'OK' : 'NULL'} | Err: {lastError || 'None'}
        </Text>
        {Object.entries(layoutMetrics).map(([key, val]) => (
          <Text key={key} style={[styles.metricLine, val?.h === 0 && styles.warningMetric]}>
            {key}: {val ? `${Math.round(val.w)}x${Math.round(val.h)}` : 'Wait'}
            {val?.h === 0 ? ' ⚠️ [HEIGHT=0]' : ''}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 44 : 24,
    left: 8,
    right: 8,
    zIndex: 99999,
    elevation: 99999,
  },
  badge: {
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    borderColor: '#38BDF8',
    borderWidth: 1.5,
    borderRadius: 8,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  badgeTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FBBF24',
    marginBottom: 2,
  },
  badgeLine: {
    fontSize: 9,
    fontWeight: '700',
    color: '#F8FAFC',
    lineHeight: 12,
  },
  metricLine: {
    fontSize: 8.5,
    fontWeight: '600',
    color: '#A5F3FC',
    lineHeight: 11,
  },
  warningMetric: {
    color: '#F43F5E',
    fontWeight: '900',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#450A0A',
    padding: 24,
    justifyContent: 'center',
    zIndex: 999999,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FECACA',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 12,
  },
  errorStack: {
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#FCA5A5',
    marginBottom: 16,
    maxHeight: 250,
  },
  retryBtn: {
    backgroundColor: '#DC2626',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  retryText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 13,
  },
});

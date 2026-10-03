/**
 * VI-MO-HON Feature Flags (ES Module)
 */
import featuresCjs from './features.cjs';

export const FEATURE_FLAGS = featuresCjs.FEATURE_FLAGS;
export const isFeatureEnabled = featuresCjs.isFeatureEnabled;

export default FEATURE_FLAGS;

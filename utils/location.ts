import * as Location from 'expo-location';

export interface LocationResult {
  latitude: number;
  longitude: number;
  accuracy: number | null;
}

export class LocationServicesDisabledError extends Error {}
export class LocationPermissionDeniedError extends Error {}
export class LocationUnavailableError extends Error {}

/**
 * Requests foreground location permission (if not already granted) and
 * returns a single current fix. Used for geo-fenced clock-in/out — the
 * backend's attendance policy decides what to do with the coordinates
 * (hard-block outside the fence in strict mode, flag as suspicious
 * otherwise); this just gets an honest reading or fails clearly.
 *
 * Checks OS-level location services separately from app permission —
 * "permission required" and "GPS/location is turned off on the device"
 * are different problems with different fixes, and collapsing them into
 * one message makes both harder to diagnose.
 */
export async function getCurrentLocation(): Promise<LocationResult> {
  const servicesEnabled = await Location.hasServicesEnabledAsync();
  if (!servicesEnabled) {
    throw new LocationServicesDisabledError(
      'Location services are turned off on this device. Enable them in system settings, then try again.'
    );
  }

  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new LocationPermissionDeniedError(
      'Arcana needs location access to clock in/out. Enable it for this app in your device settings.'
    );
  }

  try {
    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
    };
  } catch (error) {
    throw new LocationUnavailableError(
      `Could not determine your location. Make sure location services are enabled and try again. (${
        error instanceof Error ? error.message : 'unknown error'
      })`
    );
  }
}

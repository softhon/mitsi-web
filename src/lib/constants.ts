import type { MediaDeviceType } from '@/types';
import { MediaPermissionsErrorType } from 'mic-check';

export const APP_NAME = 'Mitsi';

export const DEVICE_ERRORS = {
  DeviceNotFound: (device: MediaDeviceType) => ({
    title: `Cannot use your ${device}`,
    body: `${APP_NAME} did not find a ${device} to use`,
  }),
  [MediaPermissionsErrorType.SystemPermissionDenied]: (
    device: MediaDeviceType
  ) => ({
    title: `Cannot use your ${device}`,
    body: `Your browser does not have permission to access ${device}. Check your system settings`,
  }), // macOs
  [MediaPermissionsErrorType.UserPermissionDenied]: (
    device: MediaDeviceType
  ) => ({
    title: `Access to your ${device} was denied`,
    body: `From your browser allow access ${device}.`,
  }),
  [MediaPermissionsErrorType.CouldNotStartVideoSource]: (
    device: MediaDeviceType
  ) => ({
    title: `Cannot use your ${device}`,
    body: `Another application or browser tab might be using it`,
  }),
  [MediaPermissionsErrorType.Generic]: (device: MediaDeviceType) => ({
    title: `Cannot use your ${device}`,
    body: `Something went wrong`,
  }),
};

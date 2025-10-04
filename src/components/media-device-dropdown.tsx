'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import { useCameraActions, useMicActions } from '@/store/conf/hooks';

const MediaDeviceDropdown = ({
  devices,
  selectedDeviceId,
  source,
}: {
  devices: MediaDeviceInfo[];
  selectedDeviceId: string | null;
  source: 'mic' | 'camera';
}) => {
  const micActions = useMicActions();
  const cameraActions = useCameraActions();
  const handleValueChange = React.useCallback(
    (value: string) => {
      if (source === 'mic') {
        micActions.setDeviceId(value);
      } else {
        cameraActions.setDeviceId(value);
      }
    },
    [micActions, cameraActions, source]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400"
        >
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>
          Select {source === 'camera' ? source : 'microphone'}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={selectedDeviceId?.toString()}
          onValueChange={handleValueChange}
        >
          {devices.map(device => (
            <DropdownMenuRadioItem
              key={device.deviceId}
              value={device.deviceId}
            >
              {device.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MediaDeviceDropdown;

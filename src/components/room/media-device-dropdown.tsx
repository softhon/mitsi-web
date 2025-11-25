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
import { useMedia } from '@/hooks/use-media';

const MediaDeviceDropdown = ({
  devices,
  selectedDeviceId,
  source,
}: {
  devices: MediaDeviceInfo[];
  selectedDeviceId: string | null;
  source: 'mic' | 'camera';
}) => {
  const { switchDevice } = useMedia();

  const handleValueChange = React.useCallback(
    (value: string) => {
      switchDevice(source, value);
    },
    [switchDevice, source]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 hidden md:flex  rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 cursor-pointer"
        >
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className=" w-56 bg-linear-to-bl from-slate-900 to-slate-800 ">
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
              className="focus:bg-white/8"
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

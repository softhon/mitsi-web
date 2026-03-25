import React, { useEffect, useRef, useState } from 'react';
import type { FC } from 'react';
import {
  Settings,
  Bell,
  Video,
  Mic,
  Volume2,
  Users,
  LogOut,
  MessageSquare,
  Hand,
  AlertCircle,
  CircleOff,
  Sparkles,
} from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  useCameraDeviceId,
  useCameraDevices,
  useMicDeviceId,
  useMicDevices,
  useSettingsActions,
  useSettingsNotification,
  useSettingsNoiseSuppression,
  useSettingsBackgroundMode,
  useSettingsBackgroundImage,
  useSettingsOpen,
} from '@/store/conf/hooks';
import type { BackgroundMode } from '@/services/background-service';
import { getBackgroundService } from '@/services/background-service';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useMedia } from '@/hooks/use-media';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

type TabType = 'device' | 'notifications' | 'background';

const PRESET_BACKGROUNDS = [
  {
    section: 'For You',
    items: [
      { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80', label: 'Beach' },
      { url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=80', label: 'Mountains' },
      { url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80', label: 'City' },
    ],
  },
  {
    section: 'Defaults',
    items: [
      { url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&q=80', label: 'Forest road' },
      { url: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=400&q=80', label: 'Mountains fog' },
      { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80', label: 'Living room' },
      { url: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=400&q=80', label: 'Night road' },
      { url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&q=80', label: 'Urban' },
      { url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=400&q=80', label: 'Sunset' },
    ],
  },
];

interface EffectButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const EffectButton: FC<EffectButtonProps> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={cn(
      'flex flex-col items-center gap-2 flex-1 py-3 px-2 rounded-xl border transition-all cursor-pointer',
      active
        ? 'bg-blue-600/20 border-blue-500 text-blue-400'
        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
    )}
  >
    <div className="w-8 h-8 flex items-center justify-center">{icon}</div>
    <span className="text-xs font-medium">{label}</span>
  </button>
);

interface NotificationItemProps {
  label: string;
  icon: React.ReactNode;
  isEnabled: boolean;
  onChange: () => void;
}

const NotificationToggle: FC<NotificationItemProps> = ({ label, icon, isEnabled, onChange }) => (
  <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors">
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-white text-sm md:text-base">{label}</span>
    </div>
    <button
      onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-colors ${
        isEnabled ? 'bg-blue-600' : 'bg-slate-700'
      }`}
    >
      <div
        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
          isEnabled ? 'translate-x-6' : ''
        }`}
      />
    </button>
  </div>
);

const BackgroundSettings: FC<{ isActive: boolean }> = ({ isActive }) => {
  const backgroundMode = useSettingsBackgroundMode();
  const backgroundImage = useSettingsBackgroundImage();
  const settingsActions = useSettingsActions();
  const { getTrack } = useMedia();
  const previewRef = useRef<HTMLVideoElement>(null);
  const [blurAmount, setBlurAmount] = useState(14);

  useEffect(() => {
    if (!isActive || !previewRef.current) return;
    const track = getTrack('camera');
    if (!track) return;
    previewRef.current.srcObject = new MediaStream([track]);
  }, [isActive, getTrack]);

  const selectMode = (mode: BackgroundMode) => {
    settingsActions.setBackgroundMode(mode);
    if (mode !== 'image') settingsActions.setBackgroundImage(null);
  };

  const selectImage = (url: string) => {
    settingsActions.setBackgroundMode('image');
    settingsActions.setBackgroundImage(url);
  };

  return (
    <div>
      <h3 className="text-white md:text-xl font-semibold mb-6">Virtual Background</h3>

      {/* Camera preview */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-900 mb-6">
        <video
          ref={previewRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        {!getTrack('camera') && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm">
            Camera off
          </div>
        )}
      </div>

      {/* Effects */}
      <div className="mb-6">
        <p className="text-slate-300 text-sm font-medium mb-3">Effects</p>
        <div className="flex gap-2">
          <EffectButton
            active={backgroundMode === 'none'}
            onClick={() => selectMode('none')}
            icon={<CircleOff size={22} />}
            label="No effect"
          />
          <EffectButton
            active={backgroundMode === 'blur'}
            onClick={() => selectMode('blur')}
            icon={
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                <circle cx="12" cy="12" r="4" opacity="0.9" />
                <circle cx="12" cy="12" r="7" opacity="0.4" />
                <circle cx="12" cy="12" r="10" opacity="0.15" />
              </svg>
            }
            label="Blur"
          />
          <EffectButton
            active={false}
            onClick={() => {}}
            icon={<Sparkles size={22} />}
            label="Touch-up"
          />
        </div>

        {backgroundMode === 'blur' && (
          <div className="mt-3 flex items-center gap-3">
            <span className="text-slate-500 text-xs">Low</span>
            <input
              type="range"
              min={4}
              max={24}
              value={blurAmount}
              onChange={e => {
                const v = Number(e.target.value);
                setBlurAmount(v);
                getBackgroundService().setBlurAmount(v);
              }}
              className="flex-1 accent-blue-500 cursor-pointer"
            />
            <span className="text-slate-500 text-xs">High</span>
          </div>
        )}
      </div>

      {/* Preset sections */}
      {PRESET_BACKGROUNDS.map(({ section, items }) => (
        <div key={section} className="mb-6">
          <p className="text-slate-300 text-sm font-medium mb-3">{section}</p>
          <div className="grid grid-cols-3 gap-2">
            {items.map(({ url, label }) => (
              <button
                key={url}
                onClick={() => selectImage(url)}
                title={label}
                className={cn(
                  'relative aspect-video rounded-xl overflow-hidden border-2 transition-all cursor-pointer',
                  backgroundMode === 'image' && backgroundImage === url
                    ? 'border-blue-500'
                    : 'border-transparent hover:border-white/30'
                )}
              >
                <img src={url} alt={label} className="w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const DeviceSettings: FC<{
  micVolume: number;
  onMicVolumeChange: (volume: number) => void;
}> = ({ micVolume, onMicVolumeChange }) => {
  const cameraDeviceId = useCameraDeviceId();
  const cameraDevices = useCameraDevices();
  const micDeviceId = useMicDeviceId();
  const micDevices = useMicDevices();
  const noiseSuppression = useSettingsNoiseSuppression();
  const settingsActions = useSettingsActions();
  const { getTrack } = useMedia();

  React.useEffect(() => {
    const track = getTrack('mic');
    if (!track) return;
    track.applyConstraints({ noiseSuppression }).catch(() => {});
  }, [noiseSuppression, getTrack]);

  const [speakerDevices, setSpeakerDevices] = React.useState<MediaDeviceInfo[]>([]);
  const [speakerDeviceId, setSpeakerDeviceId] = React.useState<string>('default');
  const [sinkIdSupported] = React.useState(() => 'setSinkId' in HTMLMediaElement.prototype);

  React.useEffect(() => {
    if (!sinkIdSupported) return;
    navigator.mediaDevices.enumerateDevices().then(devices => {
      setSpeakerDevices(devices.filter(d => d.kind === 'audiooutput'));
    });
  }, [sinkIdSupported]);

  const handleSpeakerChange = React.useCallback((deviceId: string) => {
    setSpeakerDeviceId(deviceId);
    document.querySelectorAll('audio, video').forEach(el => {
      const media = el as HTMLMediaElement & { setSinkId?: (id: string) => Promise<void> };
      media.setSinkId?.(deviceId);
    });
  }, []);

  return (
    <div>
      <h3 className="text-white md:text-xl font-semibold mb-8">Device Settings</h3>

      {/* Video */}
      <div className="mb-8">
        <label className="block text-slate-300 text-sm font-medium mb-3">Video</label>
        <MediaDeviceDropdown
          devices={cameraDevices}
          selectedDeviceId={cameraDeviceId}
          source="camera"
        />
      </div>

      {/* Microphone */}
      <div className="mb-8">
        <label className="block text-slate-300 text-sm font-medium mb-3">Microphone</label>
        <MediaDeviceDropdown
          devices={micDevices}
          selectedDeviceId={micDeviceId}
          source="mic"
        />

        <div className="items-center gap-3 hidden">
          <Mic size={18} className="text-slate-400" />
          <input
            type="range"
            min="0"
            max="100"
            value={micVolume}
            onChange={e => onMicVolumeChange(parseInt(e.target.value))}
            className="flex-1 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        <div className="flex items-center justify-between mt-3">
          <span className="text-slate-400 text-sm">Noise suppression</span>
          <button
            onClick={settingsActions.toggleNoiseSuppression}
            className={`relative w-10 h-5 rounded-full transition-colors ${
              noiseSuppression ? 'bg-blue-600' : 'bg-slate-700'
            }`}
          >
            <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
              noiseSuppression ? 'translate-x-5' : ''
            }`} />
          </button>
        </div>
      </div>

      {/* Speakers */}
      {sinkIdSupported && speakerDevices.length > 0 && (
        <div className="mb-8">
          <label className="block text-slate-300 text-sm font-medium mb-3">Speakers</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-full h-12 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center justify-between transition-colors">
                <div className="flex items-center gap-3">
                  <Volume2 size={18} />
                  <span className="text-xs sm:text-sm md:text-base">
                    {speakerDevices.find(d => d.deviceId === speakerDeviceId)?.label || 'Default'}
                  </span>
                </div>
                <span className="text-slate-400">›</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full bg-linear-to-bl from-slate-900 to-slate-800">
              <DropdownMenuRadioGroup value={speakerDeviceId} onValueChange={handleSpeakerChange}>
                {speakerDevices.map(device => (
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
        </div>
      )}
    </div>
  );
};

const NotificationsSettings = () => {
  const settingsNotification = useSettingsNotification();
  const settingsActions = useSettingsActions();
  return (
    <div>
      <h3 className="text-white md:text-xl font-semibold mb-8">Notifications</h3>
      <div className="space-y-4">
        <NotificationToggle
          label="Peer Joined"
          icon={<Users size={20} className="text-slate-400" />}
          isEnabled={settingsNotification.peerJoined}
          onChange={() => settingsActions.toggleNotification('peerJoined')}
        />
        <NotificationToggle
          label="Peer Leave"
          icon={<LogOut size={20} className="text-slate-400" />}
          isEnabled={settingsNotification.peerLeave}
          onChange={() => settingsActions.toggleNotification('peerLeave')}
        />
        <NotificationToggle
          label="New Message"
          icon={<MessageSquare size={20} className="text-slate-400" />}
          isEnabled={settingsNotification.newMessage}
          onChange={() => settingsActions.toggleNotification('newMessage')}
        />
        <NotificationToggle
          label="Hand Raise"
          icon={<Hand size={20} className="text-slate-400" />}
          isEnabled={settingsNotification.handRaise}
          onChange={() => settingsActions.toggleNotification('handRaise')}
        />
        <NotificationToggle
          label="Error"
          icon={<AlertCircle size={20} className="text-slate-400" />}
          isEnabled={settingsNotification.error}
          onChange={() => settingsActions.toggleNotification('error')}
        />
      </div>
    </div>
  );
};

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const TabButton: FC<TabButtonProps> = ({ isActive, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-center md:justify-start gap-3 md:px-4 py-2 rounded-lg transition-colors ${
      isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-300'
    }`}
  >
    {icon}
    <span className="hidden md:inline">{label}</span>
  </button>
);

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
    (value: string) => switchDevice(source, value),
    [switchDevice, source]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="w-full h-12 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center justify-between transition-colors">
          <div className="flex items-center gap-3">
            {source === 'camera' ? (
              <Video size={18} />
            ) : (
              <Mic size={18} className="text-slate-400" />
            )}
            <span className="text-xs sm:text-sm md:text-base">
              {devices.find(device => device.deviceId === selectedDeviceId)?.label.toString()}
            </span>
          </div>
          <span className="text-slate-400">›</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full bg-linear-to-bl from-slate-900 to-slate-800">
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

const SettingsModal: FC = () => {
  const settingsOpen = useSettingsOpen();
  const settingsAction = useSettingsActions();
  const [activeTab, setActiveTab] = useState<TabType>('device');
  const [micVolume, setMicVolume] = useState<number>(65);

  return (
    <Dialog open={settingsOpen} onOpenChange={settingsAction.toggle}>
      <DialogContent className="w-full overflow-y-auto md:max-w-3xl p-0 gap-0 border-slate-800 max-h-[90%] h-[600px] bg-linear-to-br from-slate-950 via-slate-900 to-black">
        <div className="flex h-full">
          {/* Left Sidebar */}
          <div className="w-16 md:w-64 border-r border-slate-800 p-3 md:p-6 flex flex-col">
            <h2 className="text-white text-2xl font-semibold mb-8">
              <span className="hidden md:flex">Settings</span>
            </h2>

            <nav className="space-y-3 flex-1">
              <TabButton
                isActive={activeTab === 'device'}
                onClick={() => setActiveTab('device')}
                icon={<Settings size={20} />}
                label="Device Settings"
              />
              <TabButton
                isActive={activeTab === 'background'}
                onClick={() => setActiveTab('background')}
                icon={<Video size={20} />}
                label="Virtual Background"
              />
              <TabButton
                isActive={activeTab === 'notifications'}
                onClick={() => setActiveTab('notifications')}
                icon={<Bell size={20} />}
                label="Notifications"
              />
            </nav>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 px-4 py-8 md:p-8 overflow-y-auto relative">
            {activeTab === 'device' && (
              <DeviceSettings micVolume={micVolume} onMicVolumeChange={setMicVolume} />
            )}
            {activeTab === 'background' && (
              <BackgroundSettings isActive={activeTab === 'background'} />
            )}
            {activeTab === 'notifications' && <NotificationsSettings />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;

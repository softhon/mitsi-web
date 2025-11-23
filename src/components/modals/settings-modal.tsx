import React, { useState } from 'react';
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
} from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useSettingsActions, useSettingsOpen } from '@/store/conf/hooks';

interface NotificationSettings {
  peerJoined: boolean;
  peerLeave: boolean;
  newMessage: boolean;
  handRaise: boolean;
  error: boolean;
}

type TabType = 'device' | 'notifications';

interface NotificationItemProps {
  label: string;
  icon: React.ReactNode;
  isEnabled: boolean;
  onChange: () => void;
}

const NotificationToggle: FC<NotificationItemProps> = ({
  label,
  icon,
  isEnabled,
  onChange,
}) => (
  <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors">
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-white">{label}</span>
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

const DeviceSettings: FC<{
  micVolume: number;
  onMicVolumeChange: (volume: number) => void;
}> = ({ micVolume, onMicVolumeChange }) => (
  <div>
    <h3 className="text-white text-xl font-semibold mb-8">Device Settings</h3>

    {/* Video */}
    <div className="mb-8">
      <label className="block text-slate-300 text-sm font-medium mb-3">
        Video
      </label>
      <button className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-lg px-4 py-3 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-3">
          <Video size={18} />
          <span>Facetime HD Camera</span>
        </div>
        <span className="text-slate-400">›</span>
      </button>
    </div>

    {/* Microphone */}
    <div className="mb-8">
      <label className="block text-slate-300 text-sm font-medium mb-3">
        Microphone
      </label>
      <button className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-lg px-4 py-3 flex items-center justify-between mb-4 transition-colors">
        <div className="flex items-center gap-3">
          <Mic size={18} />
          <span>Default - Macbook Pro Mic (Built-in)</span>
        </div>
        <span className="text-slate-400">›</span>
      </button>

      <div className="flex items-center gap-3">
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
    </div>

    {/* Speakers */}
    <div>
      <label className="block text-slate-300 text-sm font-medium mb-3">
        Speakers
      </label>
      <div className="flex gap-3">
        <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg px-4 py-3 flex items-center justify-between transition-colors">
          <div className="flex items-center gap-3">
            <Volume2 size={18} />
            <span>Default - Macbook Pro...</span>
          </div>
          <span className="text-slate-400">›</span>
        </button>
        <button className="bg-slate-800 hover:bg-slate-700 text-white rounded-lg px-6 py-3 transition-colors">
          Test
        </button>
      </div>
    </div>
  </div>
);

const NotificationsSettings: FC<{
  notifications: NotificationSettings;
  onNotificationToggle: (key: keyof NotificationSettings) => void;
}> = ({ notifications, onNotificationToggle }) => (
  <div>
    <h3 className="text-white text-xl font-semibold mb-8">Notifications</h3>

    <div className="space-y-4">
      <NotificationToggle
        label="Peer Joined"
        icon={<Users size={20} className="text-slate-400" />}
        isEnabled={notifications.peerJoined}
        onChange={() => onNotificationToggle('peerJoined')}
      />

      <NotificationToggle
        label="Peer Leave"
        icon={<LogOut size={20} className="text-slate-400" />}
        isEnabled={notifications.peerLeave}
        onChange={() => onNotificationToggle('peerLeave')}
      />

      <NotificationToggle
        label="New Message"
        icon={<MessageSquare size={20} className="text-slate-400" />}
        isEnabled={notifications.newMessage}
        onChange={() => onNotificationToggle('newMessage')}
      />

      <NotificationToggle
        label="Hand Raise"
        icon={<Hand size={20} className="text-slate-400" />}
        isEnabled={notifications.handRaise}
        onChange={() => onNotificationToggle('handRaise')}
      />

      <NotificationToggle
        label="Error"
        icon={<AlertCircle size={20} className="text-slate-400" />}
        isEnabled={notifications.error}
        onChange={() => onNotificationToggle('error')}
      />
    </div>
  </div>
);

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const TabButton: FC<TabButtonProps> = ({ isActive, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
      isActive
        ? 'bg-slate-800 text-white'
        : 'text-slate-400 hover:text-slate-300'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const SettingsModal: FC = () => {
  const settingsOpen = useSettingsOpen();
  const settingsAction = useSettingsActions();
  const [activeTab, setActiveTab] = useState<TabType>('device');
  const [micVolume, setMicVolume] = useState<number>(65);
  const [notifications, setNotifications] = useState<NotificationSettings>({
    peerJoined: false,
    peerLeave: false,
    newMessage: true,
    handRaise: true,
    error: true,
  });

  const handleNotificationToggle = (key: keyof NotificationSettings): void => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleMicVolumeChange = (volume: number): void => {
    setMicVolume(volume);
  };

  return (
    <Dialog open={settingsOpen} onOpenChange={settingsAction.toggle}>
      <DialogContent className="md:max-w-2xl lg:max-w-3xl p-0 gap-0 bg-slate-950 border-slate-800 max-h-[700px]">
        <div className="flex h-full">
          {/* Left Sidebar */}
          <div className="w-64 border-r border-slate-800 p-6 flex flex-col">
            <h2 className="text-white text-2xl font-semibold mb-8">Settings</h2>

            <nav className="space-y-3 flex-1">
              <TabButton
                isActive={activeTab === 'device'}
                onClick={() => setActiveTab('device')}
                icon={<Settings size={20} />}
                label="Device Settings"
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
          <div className="flex-1 p-8 overflow-y-auto relative">
            {activeTab === 'device' && (
              <DeviceSettings
                micVolume={micVolume}
                onMicVolumeChange={handleMicVolumeChange}
              />
            )}

            {activeTab === 'notifications' && (
              <NotificationsSettings
                notifications={notifications}
                onNotificationToggle={handleNotificationToggle}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;

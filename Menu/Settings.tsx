import React, { useState } from 'react';

// Component Toggle Switch
const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: (val: boolean) => void }) => (
  <button
    type="button"
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
      enabled ? 'bg-black' : 'bg-gray-200'
    }`}
  >
    <span
      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
        enabled ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

export default function Settings() {
  // State giả lập cho settings
  const [settings, setSettings] = useState({
    emailNotif: true,
    pushNotif: true,
    invitations: true,
    updates: true,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <div className="max-w-[1200px] mx-auto px-8 py-10">
        
        {/* Header */}
        <div className="mb-10 text-left">
          <div className="text-sm font-bold text-gray-900 mb-1">HCMUT Tutor Program <span className="bg-black text-white px-2 py-0.5 rounded-full text-xs ml-2">Tutor</span></div>
          <h1 className="text-[64px] font-black italic leading-none tracking-tighter text-gray-900 mb-2"
              style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
            Settings
          </h1>
        </div>

        <div className="max-w-4xl space-y-6">
            
            {/* Notifications Section */}
            <div className="border border-gray-200 rounded-2xl p-8 bg-white">
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
                    <p className="text-gray-500 text-sm">Configure which notifications you want to receive</p>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-bold text-gray-900">Email Notifications</div>
                            <div className="text-xs text-gray-500">Receive notifications via email</div>
                        </div>
                        <ToggleSwitch enabled={settings.emailNotif} onChange={() => handleToggle('emailNotif')} />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-bold text-gray-900">Push Notifications</div>
                            <div className="text-xs text-gray-500">Receive browser push notifications</div>
                        </div>
                        <ToggleSwitch enabled={settings.pushNotif} onChange={() => handleToggle('pushNotif')} />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-bold text-gray-900">Group Invitations</div>
                            <div className="text-xs text-gray-500">Notify when invited to groups</div>
                        </div>
                        <ToggleSwitch enabled={settings.invitations} onChange={() => handleToggle('invitations')} />
                    </div>

                    <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                        <div>
                            <div className="text-sm font-bold text-gray-900">Tutor Updates</div>
                            <div className="text-xs text-gray-500">Notifications about schedules and new materials</div>
                        </div>
                        <ToggleSwitch enabled={settings.updates} onChange={() => handleToggle('updates')} />
                    </div>

                    <button className="bg-black text-white text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors">
                        Save Settings
                    </button>
                </div>
            </div>

            {/* Privacy & Security Section */}
            <div className="border border-gray-200 rounded-2xl p-8 bg-white">
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900">Privacy & Security</h2>
                    <p className="text-gray-500 text-sm">Manage your account security settings</p>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                        <div>
                            <div className="text-sm font-bold text-gray-900">Password</div>
                            <div className="text-xs text-gray-500">Managed via HCMUT SSO</div>
                        </div>
                        <button className="text-sm font-medium text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50">
                            Change Password
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-bold text-gray-900">Two-Factor Authentication</div>
                            <div className="text-xs text-gray-500">Managed via HCMUT SSO</div>
                        </div>
                        <button className="text-sm font-medium text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50">
                            Configure
                        </button>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}
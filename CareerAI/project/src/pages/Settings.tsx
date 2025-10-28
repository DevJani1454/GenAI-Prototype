import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Settings as SettingsIcon, User, Bell, Globe, Eye, Save } from 'lucide-react';

interface UserSettings {
  theme: string;
  language: string;
  notifications_enabled: boolean;
  email_notifications: boolean;
  sms_notifications: boolean;
}

interface UserProfile {
  full_name: string;
  email: string;
  phone: string;
}

export function Settings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>({
    theme: 'light',
    language: 'en',
    notifications_enabled: true,
    email_notifications: true,
    sms_notifications: false,
  });
  const [profile, setProfile] = useState<UserProfile>({
    full_name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchProfile();
  }, [user]);

  async function fetchSettings() {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      if (data) setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchProfile() {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('full_name, email, phone')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      if (data) setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }

  async function handleSaveSettings() {
    if (!user) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from('user_settings')
        .update(settings)
        .eq('user_id', user.id);

      if (error) throw error;
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveProfile() {
    if (!user) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(profile)
        .eq('user_id', user.id);

      if (error) throw error;
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
          <SettingsIcon className="h-8 w-8" />
          <span>Settings</span>
        </h1>
        <p className="text-gray-600 mt-1">Manage your account preferences and settings</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <User className="h-6 w-6" />
            <span>Profile Information</span>
          </h2>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={profile.full_name}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={profile.phone || ''}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+91 98765 43210"
            />
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
          >
            <Save className="h-5 w-5" />
            <span>Save Profile</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <Eye className="h-6 w-6" />
            <span>Appearance</span>
          </h2>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theme
            </label>
            <select
              value={settings.theme}
              onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto (System)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <Globe className="h-6 w-6" />
            <span>Language & Region</span>
          </h2>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="ta">Tamil</option>
              <option value="te">Telugu</option>
              <option value="bn">Bengali</option>
              <option value="mr">Marathi</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <Bell className="h-6 w-6" />
            <span>Notifications</span>
          </h2>
        </div>

        <div className="p-6 space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">Enable Notifications</p>
              <p className="text-sm text-gray-600">Receive updates about your progress and goals</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications_enabled}
              onChange={(e) => setSettings({ ...settings, notifications_enabled: e.target.checked })}
              className="w-6 h-6 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-600">Get important updates via email</p>
            </div>
            <input
              type="checkbox"
              checked={settings.email_notifications}
              onChange={(e) => setSettings({ ...settings, email_notifications: e.target.checked })}
              className="w-6 h-6 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">SMS Notifications</p>
              <p className="text-sm text-gray-600">Receive text message reminders</p>
            </div>
            <input
              type="checkbox"
              checked={settings.sms_notifications}
              onChange={(e) => setSettings({ ...settings, sms_notifications: e.target.checked })}
              className="w-6 h-6 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 mt-6"
          >
            <Save className="h-5 w-5" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}

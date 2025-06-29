import React, { useState } from 'react';
import Card from '../../components/ui/card';
import Button from '../../components/ui/button';
import Input from '../../components/ui/input';

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  jobAlerts: boolean;
  paymentAlerts: boolean;
  marketingEmails: boolean;
}

interface PrivacySettings {
  profileVisibility: 'public' | 'private';
  showContactInfo: boolean;
  showLocation: boolean;
  allowDirectContact: boolean;
}

interface PaymentSettings {
  preferredMethod: 'bank_transfer' | 'paypal' | 'direct_deposit';
  autoWithdraw: boolean;
  minimumBalance: number;
}

const PartnerSettings: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    jobAlerts: true,
    paymentAlerts: true,
    marketingEmails: false,
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: 'public',
    showContactInfo: false,
    showLocation: true,
    allowDirectContact: true,
  });

  const [payment, setPayment] = useState<PaymentSettings>({
    preferredMethod: 'bank_transfer',
    autoWithdraw: false,
    minimumBalance: 100,
  });

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handlePrivacyChange = (key: keyof PrivacySettings, value: any) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
  };

  const handlePaymentChange = (key: keyof PaymentSettings, value: any) => {
    setPayment(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // In real app, this would make API calls to save settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Show success message
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const ToggleSwitch: React.FC<{
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    disabled?: boolean;
  }> = ({ enabled, onChange, disabled = false }) => (
    <button
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
        enabled ? 'bg-primary-600' : 'bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your account preferences and configurations
            </p>
          </div>
          <Button variant="primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Notification Settings */}
        <Card title="Notification Preferences">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                <p className="text-sm text-gray-500">Receive notifications via email</p>
              </div>
              <ToggleSwitch
                enabled={notifications.emailNotifications}
                onChange={(value) => handleNotificationChange('emailNotifications', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">SMS Notifications</h4>
                <p className="text-sm text-gray-500">Receive notifications via text message</p>
              </div>
              <ToggleSwitch
                enabled={notifications.smsNotifications}
                onChange={(value) => handleNotificationChange('smsNotifications', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Push Notifications</h4>
                <p className="text-sm text-gray-500">Receive browser push notifications</p>
              </div>
              <ToggleSwitch
                enabled={notifications.pushNotifications}
                onChange={(value) => handleNotificationChange('pushNotifications', value)}
              />
            </div>

            <hr className="border-gray-200" />

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Job Alerts</h4>
                <p className="text-sm text-gray-500">Get notified about new job opportunities</p>
              </div>
              <ToggleSwitch
                enabled={notifications.jobAlerts}
                onChange={(value) => handleNotificationChange('jobAlerts', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Payment Alerts</h4>
                <p className="text-sm text-gray-500">Get notified about payments and earnings</p>
              </div>
              <ToggleSwitch
                enabled={notifications.paymentAlerts}
                onChange={(value) => handleNotificationChange('paymentAlerts', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Marketing Emails</h4>
                <p className="text-sm text-gray-500">Receive promotional and marketing content</p>
              </div>
              <ToggleSwitch
                enabled={notifications.marketingEmails}
                onChange={(value) => handleNotificationChange('marketingEmails', value)}
              />
            </div>
          </div>
        </Card>

        {/* Privacy Settings */}
        <Card title="Privacy & Visibility">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Visibility
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={privacy.profileVisibility}
                onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
              >
                <option value="public">Public - Visible to all businesses</option>
                <option value="private">Private - Only visible when you apply</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Show Contact Information</h4>
                <p className="text-sm text-gray-500">Display your email and phone on your profile</p>
              </div>
              <ToggleSwitch
                enabled={privacy.showContactInfo}
                onChange={(value) => handlePrivacyChange('showContactInfo', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Show Location</h4>
                <p className="text-sm text-gray-500">Display your city and state on your profile</p>
              </div>
              <ToggleSwitch
                enabled={privacy.showLocation}
                onChange={(value) => handlePrivacyChange('showLocation', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Allow Direct Contact</h4>
                <p className="text-sm text-gray-500">Let businesses contact you directly</p>
              </div>
              <ToggleSwitch
                enabled={privacy.allowDirectContact}
                onChange={(value) => handlePrivacyChange('allowDirectContact', value)}
              />
            </div>
          </div>
        </Card>

        {/* Payment Settings */}
        <Card title="Payment Preferences">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Payment Method
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={payment.preferredMethod}
                onChange={(e) => handlePaymentChange('preferredMethod', e.target.value)}
              >
                <option value="bank_transfer">Bank Transfer</option>
                <option value="paypal">PayPal</option>
                <option value="direct_deposit">Direct Deposit</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Auto Withdraw</h4>
                <p className="text-sm text-gray-500">Automatically withdraw earnings when minimum is reached</p>
              </div>
              <ToggleSwitch
                enabled={payment.autoWithdraw}
                onChange={(value) => handlePaymentChange('autoWithdraw', value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Balance for Auto Withdraw ($)
              </label>
              <Input
                type="number"
                value={payment.minimumBalance.toString()}
                onChange={(e) => handlePaymentChange('minimumBalance', parseInt(e.target.value) || 0)}
                disabled={!payment.autoWithdraw}
              />
            </div>
          </div>
        </Card>

        {/* Security Settings */}
        <Card title="Security">
          <div className="space-y-4">
            <Button variant="outline" className="w-full justify-center">
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-center">
              Enable Two-Factor Authentication
            </Button>
            <Button variant="outline" className="w-full justify-center">
              Download Security Report
            </Button>
          </div>
        </Card>

        {/* Account Management */}
        <Card title="Account Management">
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-yellow-400">⚠️</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Danger Zone
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>These actions are permanent and cannot be undone.</p>
                  </div>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full justify-center text-red-600 border-red-300 hover:bg-red-50"
            >
              Delete Account
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PartnerSettings; 
import React, { useState } from 'react';
import Card from '../../components/ui/card';
import Button from '../../components/ui/button';
import Input from '../../components/ui/input';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  skills: string[];
  experience: number;
  location: {
    city: string;
    state: string;
  };
  bio: string;
  availability: boolean;
}

const PartnerProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Mock data - in real app, this would come from Redux store/API
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    skills: ['Delivery', 'Installation', 'Tech Support'],
    experience: 3,
    location: {
      city: 'San Francisco',
      state: 'CA',
    },
    bio: 'Experienced partner with 3+ years in various service categories. Specializing in technical installations and customer support.',
    availability: true,
  });

  const [editData, setEditData] = useState<ProfileData>(profileData);

  const handleEdit = () => {
    setEditData(profileData);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // In real app, this would make an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProfileData(editData);
      setIsEditing(false);
      // Show success message
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: any) => {
    setEditData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLocationChange = (field: 'city' | 'state', value: string) => {
    setEditData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value,
      },
    }));
  };

  const handleSkillAdd = (skill: string) => {
    if (skill && !editData.skills.includes(skill)) {
      setEditData(prev => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
    }
  };

  const handleSkillRemove = (skill: string) => {
    setEditData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill),
    }));
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your profile information and preferences
            </p>
          </div>
          {!isEditing ? (
            <Button variant="primary" onClick={handleEdit}>
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Personal Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                {isEditing ? (
                  <Input
                    value={editData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                  />
                ) : (
                  <p className="text-gray-900">{profileData.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                {isEditing ? (
                  <Input
                    value={editData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                  />
                ) : (
                  <p className="text-gray-900">{profileData.lastName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={editData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                ) : (
                  <p className="text-gray-900">{profileData.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                {isEditing ? (
                  <Input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                ) : (
                  <p className="text-gray-900">{profileData.phone}</p>
                )}
              </div>
            </div>
          </Card>

          <Card title="Location">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                {isEditing ? (
                  <Input
                    value={editData.location.city}
                    onChange={(e) => handleLocationChange('city', e.target.value)}
                  />
                ) : (
                  <p className="text-gray-900">{profileData.location.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                {isEditing ? (
                  <Input
                    value={editData.location.state}
                    onChange={(e) => handleLocationChange('state', e.target.value)}
                  />
                ) : (
                  <p className="text-gray-900">{profileData.location.state}</p>
                )}
              </div>
            </div>
          </Card>

          <Card title="Professional Information">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Years of Experience
                </label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editData.experience.toString()}
                    onChange={(e) => handleInputChange('experience', parseInt(e.target.value) || 0)}
                  />
                ) : (
                  <p className="text-gray-900">{profileData.experience} years</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    rows={4}
                    value={editData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                  />
                ) : (
                  <p className="text-gray-900">{profileData.bio}</p>
                )}
              </div>
            </div>
          </Card>

          <Card title="Skills">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {(isEditing ? editData.skills : profileData.skills).map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {skill}
                    {isEditing && (
                      <button
                        onClick={() => handleSkillRemove(skill)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>

              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        handleSkillAdd(input.value);
                        input.value = '';
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      const input = (e.target as HTMLElement).parentElement?.querySelector('input');
                      if (input) {
                        handleSkillAdd(input.value);
                        input.value = '';
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Profile Stats */}
        <div className="space-y-6">
          <Card title="Profile Stats">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Rating</span>
                <div className="flex items-center">
                  <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
                  <span className="ml-1 text-sm font-medium">4.8</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Jobs Completed</span>
                <span className="text-sm font-medium">127</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Success Rate</span>
                <span className="text-sm font-medium text-green-600">98%</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Response Time</span>
                <span className="text-sm font-medium">{'< 2 hours'}</span>
              </div>
            </div>
          </Card>

          <Card title="Availability">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Available for Jobs
                </span>
                {isEditing ? (
                  <button
                    onClick={() => handleInputChange('availability', !editData.availability)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                      editData.availability ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        editData.availability ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                ) : (
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      profileData.availability
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {profileData.availability ? 'Available' : 'Unavailable'}
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-500">
                Turn off availability to pause receiving new job requests.
              </p>
            </div>
          </Card>

          <Card title="Account Actions">
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-center">
                Download Data
              </Button>
              <Button variant="outline" className="w-full justify-center">
                Deactivate Account
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PartnerProfile; 
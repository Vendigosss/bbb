import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileService, Profile } from '../services/profile';
import { Camera, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: ''
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    const profileData = await profileService.getProfile(user.id);
    if (profileData) {
      setProfile(profileData);
      setFormData({
        name: profileData.name || '',
        bio: profileData.bio || '',
        location: profileData.location || ''
      });
    }
    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      const updatedProfile = await profileService.updateProfile(user.id, formData);
      if (updatedProfile) {
        setProfile(updatedProfile);
        toast.success('Профиль успешно обновлен');
      }
    } catch (error) {
      toast.error('Не удалось обновить профиль');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    try {
      const avatarUrl = await profileService.uploadAvatar(user.id, file);
      if (avatarUrl) {
        const updatedProfile = await profileService.updateProfile(user.id, {
          avatar_url: avatarUrl
        });
        if (updatedProfile) {
          setProfile(updatedProfile);
          toast.success('Аватар успешно обновлен');
        }
      }
    } catch (error) {
      toast.error('Не удалось обновить аватар');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative h-32 bg-gradient-to-r from-teal-500 to-teal-600">
          <div className="absolute -bottom-16 left-8">
            <div className="relative">
              <img
                src={profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white object-cover bg-white"
              />
              <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-50">
                <Camera size={20} className="text-gray-600" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="pt-20 px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Имя
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                placeholder="Введите ваше имя"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                О себе
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                placeholder="Расскажите о себе"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Местоположение
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                placeholder="Город, страна"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-75"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Сохранение...
                  </>
                ) : (
                  'Сохранить изменения'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
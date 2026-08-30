import React, { useState, useMemo } from 'react';
import { useInkorium } from '../context/InkoriumContext';
import { UserActivity, UserActivityType } from '../types';
import { 
  Clock, UserPlus, Image as ImageIcon, MessageSquare, 
  FolderPlus, UserCheck, Trash2, Filter, 
  Camera, MessageCircle, Edit3, Info, Heart
} from 'lucide-react';

interface ActivityLogProps {
  userId: string;
  userName: string;
  isOwnProfile: boolean;
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ userId, userName, isOwnProfile }) => {
  const { 
    activities, 
    deleteUserActivity, 
    viewUserProfile, 
    viewPhoto, 
    viewAlbum,
    openChatWith
  } = useInkorium();

  const [activeFilter, setActiveFilter] = useState<'all' | 'friends' | 'photos' | 'status'>('all');
  const [maxDisplay, setMaxDisplay] = useState<number>(6);

  // Filter activities for this user
  const userActivities = useMemo(() => {
    const list = activities.filter(a => a.userId === userId);
    return list.sort((a, b) => b.timestamp - a.timestamp);
  }, [activities, userId]);

  const filteredActivities = useMemo(() => {
    if (activeFilter === 'all') return userActivities;
    if (activeFilter === 'friends') {
      return userActivities.filter(a => a.type === 'friend_added');
    }
    if (activeFilter === 'photos') {
      return userActivities.filter(a => 
        a.type === 'photo_upload' || a.type === 'photo_comment' || a.type === 'avatar_change' || a.type === 'album_created'
      );
    }
    if (activeFilter === 'status') {
      return userActivities.filter(a => 
        a.type === 'status_update' || a.type === 'wall_post' || a.type === 'info_update'
      );
    }
    return userActivities;
  }, [userActivities, activeFilter]);

  const displayedActivities = filteredActivities.slice(0, maxDisplay);

  const getActivityIcon = (type: UserActivityType) => {
    switch (type) {
      case 'avatar_change':
        return <Camera className="w-3.5 h-3.5 text-amber-600" />;
      case 'friend_added':
        return <UserCheck className="w-3.5 h-3.5 text-emerald-600" />;
      case 'photo_upload':
        return <ImageIcon className="w-3.5 h-3.5 text-blue-600" />;
      case 'photo_comment':
        return <MessageCircle className="w-3.5 h-3.5 text-indigo-600" />;
      case 'album_created':
        return <FolderPlus className="w-3.5 h-3.5 text-teal-600" />;
      case 'status_update':
        return <Edit3 className="w-3.5 h-3.5 text-purple-600" />;
      case 'wall_post':
        return <MessageSquare className="w-3.5 h-3.5 text-[#3869A0]" />;
      case 'info_update':
        return <Info className="w-3.5 h-3.5 text-cyan-600" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-gray-500" />;
    }
  };

  const getActivityBadgeBg = (type: UserActivityType) => {
    switch (type) {
      case 'avatar_change':
        return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'friend_added':
        return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      case 'photo_upload':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'photo_comment':
        return 'bg-indigo-50 border-indigo-200 text-indigo-700';
      case 'album_created':
        return 'bg-teal-50 border-teal-200 text-teal-700';
      case 'status_update':
        return 'bg-purple-50 border-purple-200 text-purple-700';
      case 'wall_post':
        return 'bg-sky-50 border-sky-200 text-[#3869A0]';
      case 'info_update':
        return 'bg-cyan-50 border-cyan-200 text-cyan-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded border border-[#ccd5df] p-3 text-xs shadow-xs space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-gray-200 gap-2">
        <div className="font-bold text-gray-800 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#3869A0]" />
          <span>Actividad reciente de {isOwnProfile ? 'tu perfil' : userName}</span>
          <span className="text-[10px] font-normal text-gray-400">({userActivities.length})</span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 sm:pb-0">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition ${
              activeFilter === 'all'
                ? 'bg-[#3869A0] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Todo
          </button>
          <button
            onClick={() => setActiveFilter('friends')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition flex items-center gap-1 ${
              activeFilter === 'friends'
                ? 'bg-[#3869A0] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <UserPlus className="w-2.5 h-2.5" />
            <span>Amigos</span>
          </button>
          <button
            onClick={() => setActiveFilter('photos')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition flex items-center gap-1 ${
              activeFilter === 'photos'
                ? 'bg-[#3869A0] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <ImageIcon className="w-2.5 h-2.5" />
            <span>Fotos</span>
          </button>
          <button
            onClick={() => setActiveFilter('status')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition flex items-center gap-1 ${
              activeFilter === 'status'
                ? 'bg-[#3869A0] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Edit3 className="w-2.5 h-2.5" />
            <span>Estados</span>
          </button>
        </div>
      </div>

      {/* Activity Timeline List */}
      {displayedActivities.length === 0 ? (
        <div className="py-6 text-center text-gray-400 text-xs">
          <Clock className="w-6 h-6 mx-auto mb-1.5 opacity-40 text-gray-400" />
          <p>No hay actividades registradas en esta sección.</p>
        </div>
      ) : (
        <div className="relative pl-6 space-y-3 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
          {displayedActivities.map(activity => (
            <div 
              key={activity.id} 
              className="relative group bg-[#fbfcff] hover:bg-white border border-gray-100 hover:border-gray-200 rounded p-2.5 transition shadow-2xs"
            >
              {/* Timeline Bullet Icon */}
              <div className={`absolute -left-6 top-2.5 w-5 h-5 rounded-full flex items-center justify-center border shadow-xs ${getActivityBadgeBg(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>

              {/* Main Content */}
              <div className="space-y-1.5">
                {/* Header line: Title and Date */}
                <div className="flex items-start justify-between gap-2">
                  <div className="text-xs text-gray-700 leading-snug">
                    <span 
                      onClick={() => viewUserProfile(activity.userId)}
                      className="font-bold text-[#3869A0] hover:underline cursor-pointer"
                    >
                      {activity.userName}
                    </span>{' '}
                    <span>{activity.title}</span>
                    {activity.targetUserName && (
                      <>
                        {' '}
                        <span 
                          onClick={() => activity.targetUserId && viewUserProfile(activity.targetUserId)}
                          className="font-bold text-[#3869A0] hover:underline cursor-pointer"
                        >
                          {activity.targetUserName}
                        </span>
                      </>
                    )}
                    {activity.targetAlbumName && (
                      <>
                        {' '}
                        <span 
                          onClick={() => activity.targetAlbumId && viewAlbum(activity.targetAlbumId)}
                          className="font-bold text-[#3869A0] hover:underline cursor-pointer"
                        >
                          «{activity.targetAlbumName}»
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-[10px] text-gray-400 whitespace-nowrap">{activity.date}</span>
                    {isOwnProfile && (
                      <button
                        onClick={() => deleteUserActivity(activity.id)}
                        className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition cursor-pointer p-0.5"
                        title="Eliminar de mi registro de actividad"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Optional Detail / Sub-Content based on type */}
                {activity.type === 'avatar_change' && activity.targetPhotoUrl && (
                  <div className="pt-1 flex items-center gap-2">
                    <img 
                      src={activity.targetPhotoUrl} 
                      alt="Nueva foto de perfil"
                      className="w-14 h-14 rounded object-cover border border-amber-200 shadow-2xs cursor-pointer hover:opacity-90"
                      onClick={() => activity.targetPhotoId ? viewPhoto(activity.targetPhotoId) : null}
                    />
                    <div className="text-[11px] text-gray-500">
                      <span className="font-semibold text-amber-700 block">Nueva imagen de avatar</span>
                      <span className="text-[10px] text-gray-400">Actualizada en el perfil</span>
                    </div>
                  </div>
                )}

                {activity.type === 'photo_upload' && activity.targetPhotoUrl && (
                  <div className="pt-1 flex items-start gap-2.5 bg-blue-50/30 p-1.5 rounded border border-blue-100">
                    <img 
                      src={activity.targetPhotoUrl} 
                      alt={activity.detail || 'Foto subida'}
                      className="w-16 h-16 rounded object-cover border border-blue-200 shadow-2xs cursor-pointer hover:opacity-90 transition"
                      onClick={() => activity.targetPhotoId && viewPhoto(activity.targetPhotoId)}
                    />
                    <div className="space-y-0.5">
                      {activity.detail && (
                        <p className="font-medium text-gray-800 text-[11px]">"{activity.detail}"</p>
                      )}
                      {activity.targetAlbumName && (
                        <p className="text-[10px] text-gray-500">
                          Álbum: <span className="font-semibold text-[#3869A0]">{activity.targetAlbumName}</span>
                        </p>
                      )}
                      <button
                        onClick={() => activity.targetPhotoId && viewPhoto(activity.targetPhotoId)}
                        className="text-[10px] text-[#3869A0] hover:underline font-bold pt-0.5 cursor-pointer block"
                      >
                        Ver foto ampliada →
                      </button>
                    </div>
                  </div>
                )}

                {activity.type === 'friend_added' && activity.targetUserName && (
                  <div className="pt-1 flex items-center gap-2.5 bg-emerald-50/40 p-1.5 rounded border border-emerald-100">
                    {activity.targetUserAvatar && (
                      <img 
                        src={activity.targetUserAvatar} 
                        alt={activity.targetUserName}
                        className="w-9 h-9 rounded object-cover border border-emerald-200 cursor-pointer hover:opacity-90"
                        onClick={() => activity.targetUserId && viewUserProfile(activity.targetUserId)}
                      />
                    )}
                    <div className="flex-1 flex items-center justify-between">
                      <div>
                        <span 
                          onClick={() => activity.targetUserId && viewUserProfile(activity.targetUserId)}
                          className="font-bold text-xs text-[#3869A0] hover:underline cursor-pointer block"
                        >
                          {activity.targetUserName}
                        </span>
                        <span className="text-[10px] text-gray-400">Ahora son amigos en Inkorium</span>
                      </div>
                      {activity.targetUserId && (
                        <button
                          onClick={() => openChatWith(activity.targetUserId!)}
                          className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded cursor-pointer transition shadow-2xs"
                        >
                          Chatear
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {activity.type === 'status_update' && activity.detail && (
                  <div className="pt-0.5 bg-purple-50/40 p-2 rounded border border-purple-100 text-[11px] text-gray-700 italic">
                    <span className="text-purple-600 font-serif font-bold text-xs">“</span>
                    {activity.detail}
                    <span className="text-purple-600 font-serif font-bold text-xs">”</span>
                  </div>
                )}

                {activity.type === 'wall_post' && activity.detail && (
                  <div className="pt-0.5 bg-sky-50/40 p-2 rounded border border-sky-100 text-[11px] text-gray-700">
                    <p className="line-clamp-2 italic text-gray-600">"{activity.detail}"</p>
                  </div>
                )}

                {activity.type === 'photo_comment' && (
                  <div className="pt-1 flex items-center gap-2 bg-indigo-50/30 p-1.5 rounded border border-indigo-100">
                    {activity.targetPhotoUrl && (
                      <img 
                        src={activity.targetPhotoUrl} 
                        alt=""
                        className="w-10 h-10 rounded object-cover border border-indigo-200 cursor-pointer hover:opacity-90 flex-shrink-0"
                        onClick={() => activity.targetPhotoId && viewPhoto(activity.targetPhotoId)}
                      />
                    )}
                    <div className="text-[11px] text-gray-700 flex-1 min-w-0">
                      {activity.detail && (
                        <p className="line-clamp-1 italic text-gray-600">«{activity.detail}»</p>
                      )}
                      {activity.targetPhotoId && (
                        <button
                          onClick={() => viewPhoto(activity.targetPhotoId!)}
                          className="text-[10px] text-[#3869A0] hover:underline font-semibold cursor-pointer"
                        >
                          Ir a la foto comentada
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {activity.type === 'album_created' && (
                  <div className="pt-0.5 bg-teal-50/40 p-2 rounded border border-teal-100 text-[11px]">
                    <span className="font-semibold text-teal-800 block">Nuevo álbum creado: {activity.targetAlbumName}</span>
                    {activity.detail && <p className="text-gray-600 text-[10px] mt-0.5">{activity.detail}</p>}
                    {activity.targetAlbumId && (
                      <button
                        onClick={() => viewAlbum(activity.targetAlbumId!)}
                        className="text-[10px] text-[#3869A0] hover:underline font-semibold cursor-pointer mt-1 block"
                      >
                        Ver álbum →
                      </button>
                    )}
                  </div>
                )}

                {activity.type === 'info_update' && activity.detail && (
                  <div className="pt-0.5 text-[11px] text-cyan-800 bg-cyan-50/40 p-1.5 rounded border border-cyan-100">
                    <span className="font-medium">{activity.detail}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Expand / Show More Button */}
      {filteredActivities.length > maxDisplay && (
        <div className="pt-2 border-t border-gray-100 text-center">
          <button
            onClick={() => setMaxDisplay(prev => prev + 6)}
            className="text-[11px] font-bold text-[#3869A0] hover:underline cursor-pointer"
          >
            Ver más actividades anteriores ({filteredActivities.length - maxDisplay} restantes) ↓
          </button>
        </div>
      )}
      {maxDisplay > 6 && filteredActivities.length <= maxDisplay && (
        <div className="pt-2 border-t border-gray-100 text-center">
          <button
            onClick={() => setMaxDisplay(6)}
            className="text-[10px] text-gray-500 hover:underline cursor-pointer"
          >
            Mostrar menos ↑
          </button>
        </div>
      )}
    </div>
  );
};

import React, { useState, useRef } from 'react';
import { useInkorium } from '../context/InkoriumContext';
import { X, Upload, Image as ImageIcon, Sparkles, Plus, Check } from 'lucide-react';

const NOSTALGIC_PRESET_PHOTOS = [
  {
    title: 'De fiesta con los colegas el sábado por la noche',
    url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=900&auto=format&fit=crop&q=80',
    category: 'Fiesta'
  },
  {
    title: 'Veranito inolvidable en la playa de Tarifa',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=80',
    category: 'Playa'
  },
  {
    title: 'Dándolo todo en el festival de música indie',
    url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=900&auto=format&fit=crop&q=80',
    category: 'Concierto'
  },
  {
    title: 'Tarde de skate y risas en el parque',
    url: 'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?w=900&auto=format&fit=crop&q=80',
    category: 'Colegas'
  },
  {
    title: 'Foto pose con la cámara digital antes de salir',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=80',
    category: 'Pose'
  },
  {
    title: 'Viaje de fin de curso a Mallorca',
    url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=900&auto=format&fit=crop&q=80',
    category: 'Viaje'
  }
];

export const UploadModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { albums, currentUser, uploadPhoto, createAlbum } = useInkorium();

  const [title, setTitle] = useState('');
  const [albumId, setAlbumId] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [showNewAlbumInput, setShowNewAlbumInput] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecciona un archivo de imagen válido.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPhotoUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleCreateNewAlbum = () => {
    if (!newAlbumName.trim()) return;
    createAlbum(newAlbumName.trim());
    setNewAlbumName('');
    setShowNewAlbumInput(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUrl) return;
    uploadPhoto(title || 'Sin título', albumId || null, photoUrl);
    setTitle('');
    setPhotoUrl('');
    setAlbumId('');
    onClose();
  };

  const myAlbums = albums.filter(a => a.userId === currentUser.id);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-lg border border-gray-300 max-w-xl w-full p-4 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-blue-100 text-[#3869A0] flex items-center justify-center font-bold">
              <Upload className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-sm text-gray-900">Subir fotos a Inkorium</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-lg font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Title */}
          <div>
            <label className="font-bold text-gray-700 block mb-1">Título de la foto:</label>
            <input
              type="text"
              placeholder="Escribe un título para la foto..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-2 text-xs rounded border border-gray-300 focus:outline-none focus:border-[#3869A0]"
            />
          </div>

          {/* Album Selector */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-gray-700">Álbum de destino:</label>
              <button
                type="button"
                onClick={() => setShowNewAlbumInput(!showNewAlbumInput)}
                className="text-[11px] text-[#3869A0] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Crear nuevo álbum</span>
              </button>
            </div>

            {showNewAlbumInput && (
              <div className="flex items-center gap-2 p-2 bg-blue-50/60 rounded border border-blue-200 mb-2">
                <input
                  type="text"
                  placeholder="Nombre del nuevo álbum..."
                  value={newAlbumName}
                  onChange={e => setNewAlbumName(e.target.value)}
                  className="flex-1 p-1.5 text-xs bg-white rounded border border-gray-300 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCreateNewAlbum}
                  disabled={!newAlbumName.trim()}
                  className="px-2.5 py-1 bg-[#3869A0] text-white font-bold rounded text-xs disabled:opacity-50"
                >
                  Guardar
                </button>
              </div>
            )}

            <select
              value={albumId}
              onChange={e => setAlbumId(e.target.value)}
              className="w-full p-2 text-xs rounded border border-gray-300 focus:outline-none focus:border-[#3869A0] bg-white"
            >
              <option value="">Ninguno (Fotos subidas sueltas)</option>
              {myAlbums.map(a => (
                <option key={a.id} value={a.id}>{a.nombre}</option>
              ))}
            </select>
          </div>

          {/* Drag and drop or file selector */}
          <div>
            <label className="font-bold text-gray-700 block mb-1">Imagen:</label>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
                isDragOver ? 'border-[#3869A0] bg-blue-50' : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                className="hidden"
              />

              {photoUrl ? (
                <div className="flex flex-col items-center gap-2">
                  <img src={photoUrl} alt="Preview" className="max-h-48 rounded shadow border" />
                  <span className="text-[11px] text-[#3869A0] font-bold">Haz clic o arrastra para cambiar la foto</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-500">
                  <ImageIcon className="w-10 h-10 text-gray-400" />
                  <p className="font-semibold text-gray-700">
                    Arrastra tu imagen aquí o haz clic para seleccionarla
                  </p>
                  <p className="text-[10px] text-gray-400">JPG, PNG, GIF o WEBP</p>
                </div>
              )}
            </div>
          </div>

          {/* Preset nostalgic photos showcase for instant testing */}
          <div>
            <span className="font-bold text-gray-600 block mb-1 flex items-center gap-1 text-[11px]">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>O elige una foto nostálgica de prueba (1-clic):</span>
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {NOSTALGIC_PRESET_PHOTOS.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setPhotoUrl(preset.url);
                    if (!title) setTitle(preset.title);
                  }}
                  className={`border rounded overflow-hidden cursor-pointer relative group transition ${
                    photoUrl === preset.url ? 'ring-2 ring-[#3869A0] border-[#3869A0]' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img src={preset.url} alt={preset.title} className="w-full h-14 object-cover" />
                  <div className="p-1 text-[9px] font-bold text-center text-gray-600 truncate bg-gray-50">
                    {preset.category}
                  </div>
                  {photoUrl === preset.url && (
                    <div className="absolute top-1 right-1 bg-[#3869A0] text-white rounded-full p-0.5 shadow">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!photoUrl}
              className="px-5 py-1.5 rounded bg-[#3869A0] hover:bg-[#2c537f] text-white font-bold cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Subir a Inkorium
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

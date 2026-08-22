import React, { useState } from 'react';
import { 
  Camera, Upload, Sparkles, X, Check, ArrowRight, 
  MapPin, Calendar, DollarSign, Image as ImageIcon 
} from 'lucide-react';
import { useTrip } from '../../context/TripContext.tsx';
import { api } from '../../services/api.ts';
import { AIPlanOption } from '../../types/index.ts';

export const PhotoToTripModal: React.FC = () => {
  const { isPhotoToTripOpen, setIsPhotoToTripOpen, setActiveTrip, loadTrips } = useTrip();
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  if (!isPhotoToTripOpen) return null;

  const sampleLandmarks = [
    { name: 'Mount Fuji & Chureito Pagoda, Japan', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500&auto=format&fit=crop&q=80' },
    { name: 'Marina Bay Sands & Supertrees, Singapore', img: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=500&auto=format&fit=crop&q=80' },
    { name: 'Colosseum & Roman Forum, Italy', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=500&auto=format&fit=crop&q=80' },
    { name: 'Tanah Lot & Rice Paddies, Bali', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500&auto=format&fit=crop&q=80' }
  ];

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setSelectedImage(dataUrl);
      analyzePhoto(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const analyzePhoto = async (imageInput: string) => {
    setIsLoading(true);
    setResult(null);
    try {
      const res = await api.photoToTrip(imageInput);
      setResult(res);
    } catch (err) {
      console.error('Photo analyze error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdoptPlan = async (option: AIPlanOption) => {
    if (!result) return;
    try {
      const newTrip = await api.createTrip({
        title: `${result.detectedCity} Highlights (${option.title || option.tier})`,
        description: `AI-crafted journey generated from image recognition of ${result.detectedLandmark}.`,
        coverImage: selectedImage || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80',
        totalDays: result.suggestedDurationDays || 5,
        totalBudget: option.totalCost,
        estimatedCost: option.totalCost,
        stops: option.stops || [],
        items: option.items || []
      });
      await loadTrips();
      setActiveTrip(newTrip);
      setIsPhotoToTripOpen(false);
    } catch (err) {
      console.error('Create trip from photo error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0f172a] rounded-3xl shadow-2xl border border-purple-500/30 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-purple-500/20 bg-gradient-to-r from-purple-500/20 via-pink-500/10 to-indigo-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                📸 Photo-to-Trip Generator
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-300">
                  Multimodal AI
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Upload any travel photo or landmark screenshot to generate a complete custom itinerary.
              </p>
            </div>
          </div>

          <button
            id="close-photo-to-trip-modal-btn"
            onClick={() => setIsPhotoToTripOpen(false)}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* Upload Dropzone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
            }}
            className={`border-2 border-dashed rounded-3xl p-6 text-center transition-all ${
              dragActive
                ? 'border-purple-500 bg-purple-500/10 scale-[1.02]'
                : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 hover:border-purple-400'
            }`}
          >
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Drag & drop your travel photo here, or browse files
                </p>
                <p className="text-[11px] text-slate-500 mt-1">Supports JPG, PNG, WEBP</p>
              </div>
              <label className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/25 cursor-pointer transition-all active:scale-95">
                <span>Select Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                  }}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Or Try Popular Landmark Presets:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {sampleLandmarks.map((sm, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedImage(sm.img);
                    analyzePhoto(sm.name);
                  }}
                  className="group relative rounded-2xl overflow-hidden aspect-4/3 border border-slate-200 dark:border-slate-800 hover:ring-2 hover:ring-purple-500 transition-all text-left"
                >
                  <img src={sm.img} alt={sm.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent p-2 flex flex-col justify-end">
                    <p className="text-[10px] font-bold text-white line-clamp-2 leading-tight">
                      {sm.name.split(',')[0]}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="p-8 rounded-2xl bg-purple-500/5 border border-purple-500/20 flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-10 h-10 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Identifying landmark & scanning coordinates...</p>
              <p className="text-xs text-slate-500">Gemini Vision generating 3 customized multi-city itinerary tiers</p>
            </div>
          )}

          {/* Result Section */}
          {result && !isLoading && (
            <div className="space-y-4 animate-in zoom-in-95">
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500 text-white">
                      {result.confidence}% Match
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {result.detectedLandmark}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-purple-500" />
                    {result.detectedCity}, {result.detectedCountry}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {result.vibe?.map((v: string, i: number) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                        ✨ {v}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Duration</p>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white">{result.suggestedDurationDays} Days</p>
                </div>
              </div>

              {/* Tiers generated */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Choose Itinerary Style:
                </p>
                {result.tripOptions?.map((opt: AIPlanOption) => (
                  <div
                    key={opt.tier}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 flex items-center justify-between gap-3 hover:border-purple-400 transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white">{opt.title || opt.tier}</span>
                        {opt.tag && (
                          <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                            {opt.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{opt.description || opt.tagline || opt.summary}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <p className="text-xs font-extrabold text-slate-900 dark:text-white">{opt.currency}{opt.totalCost}</p>
                        <p className="text-[10px] text-slate-400">{opt.items?.length || 0} Activities</p>
                      </div>
                      <button
                        onClick={() => handleAdoptPlan(opt)}
                        className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition-all flex items-center gap-1"
                      >
                        Adopt Trip
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video, Image, Camera, Upload, Play, Download,
  ChevronRight, ChevronLeft, Check, Sparkles, User2,
  Building2, Wand2, Settings2, Film, RotateCcw,
  Volume2, Maximize2, Plane, CircleDot, X
} from 'lucide-react';

// ===== ANIMATED BACKGROUND COMPONENT =====
const AnimatedBackground = () => {
  return (
    <div className="gradient-mesh">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${100 + Math.random() * 20}%`,
          }}
          animate={{
            y: [0, -window.innerHeight * 1.2],
            x: [0, (Math.random() - 0.5) * 100],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

// ===== STEP INDICATOR COMPONENT =====
const StepIndicator = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="flex flex-nowrap overflow-x-auto md:overflow-x-visible items-center justify-start md:justify-center gap-2 md:gap-4 lg:gap-6 mb-12 px-4 pb-4 md:pb-0 scrollbar-hide">
      {steps.map((step, index) => (
        <motion.div
          key={index}
          className="flex items-center gap-2 md:gap-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <motion.button
            onClick={() => onStepClick(index)}
            className={`
              flex items-center gap-2 px-3 md:px-4 py-2 rounded-full transition-all duration-300 flex-shrink-0
              ${currentStep === index
                ? 'bg-gradient-to-r from-[#0A84FF] to-[#BF5AF2] text-white shadow-lg shadow-blue-500/25'
                : currentStep > index
                  ? 'bg-[#30D158]/20 text-[#30D158]'
                  : 'bg-white/5 text-white/50 hover:bg-white/10'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className={`
              w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-xs font-semibold
              ${currentStep === index
                ? 'bg-white/20'
                : currentStep > index
                  ? 'bg-[#30D158]/30'
                  : 'bg-white/10'
              }
            `}>
              {currentStep > index ? <Check size={12} /> : index + 1}
            </span>
            <span className="text-xs md:text-sm font-medium hidden sm:block">{step}</span>
          </motion.button>
          {index < steps.length - 1 && (
            <div className={`hidden md:block w-8 lg:w-16 h-0.5 rounded-full transition-colors ${currentStep > index ? 'bg-[#30D158]' : 'bg-white/10'}`} />
          )}
        </motion.div>
      ))}
    </div>
  );
};

// ===== MODE SELECTION CARD =====
const ModeCard = ({ icon: Icon, title, description, selected, onClick, gradient }) => {
  return (
    <motion.div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={`mode-card ${selected ? 'selected' : ''} outline-none focus-visible:ring-2 focus-visible:ring-[#0A84FF]`}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${gradient}`}>
        <Icon className="text-white" size={28} />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-white/60 text-sm leading-relaxed">{description}</p>
      {selected && (
        <motion.div
          className="absolute top-4 right-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
        >
          <div className="w-6 h-6 rounded-full bg-[#30D158] flex items-center justify-center">
            <Check size={14} className="text-white" />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

// ===== DROPZONE COMPONENT =====
const DropZone = ({ id, label, instruction, icon: Icon, file, onFileChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  // Manage object URL for preview to avoid memory leaks
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Cleanup function to revoke the URL when component unmounts or file changes
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileChange(e.dataTransfer.files[0]);
    }
  }, [onFileChange]);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  const removeFile = (e) => {
    e.stopPropagation();
    onFileChange(null);
  };

  return (
    <motion.div
      className={`dropzone ${isDragging ? 'active' : ''}`}
      onClick={handleClick}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ borderColor: 'rgba(10, 132, 255, 0.5)' }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />

      <AnimatePresence mode="wait">
        {file && preview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative"
          >
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-xl"
            />
            <motion.button
              onClick={removeFile}
              className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={16} className="text-white" />
            </motion.button>
            <p className="text-sm text-white/70 mt-3">{file.name}</p>
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0A84FF]/20 to-[#BF5AF2]/20 flex items-center justify-center">
              <Icon className="text-[#0A84FF]" size={28} />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-1">{label}</h4>
              <p className="text-white/50 text-sm">{instruction}</p>
            </div>
            <div className="flex items-center gap-2 text-white/40 text-xs">
              <Upload size={14} />
              <span>Sürükleyip bırakın veya tıklayın</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ===== CAMERA TOGGLE OPTION =====
const CameraOption = ({ name, description, icon: Icon, selected, onClick }) => {
  return (
    <motion.div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={`
        p-5 rounded-2xl cursor-pointer transition-all duration-300 border focus:outline-none focus:ring-2 focus:ring-[#0A84FF]
        ${selected
          ? 'bg-[#0A84FF]/15 border-[#0A84FF]/50'
          : 'bg-white/5 border-white/10 hover:bg-white/8'
        }
      `}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-center gap-4">
        <div className={`
          w-12 h-12 rounded-xl flex items-center justify-center
          ${selected
            ? 'bg-gradient-to-br from-[#0A84FF] to-[#BF5AF2]'
            : 'bg-white/10'
          }
        `}>
          <Icon className="text-white" size={22} />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-white">{name}</h4>
          <p className="text-white/50 text-sm mt-0.5">{description}</p>
        </div>
        <div className={`toggle-switch ${selected ? 'active' : ''}`} />
      </div>
    </motion.div>
  );
};

// ===== MAIN APP COMPONENT =====
function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedMode, setSelectedMode] = useState(null);
  const [agentPhoto, setAgentPhoto] = useState(null);
  const [propertyPhoto, setPropertyPhoto] = useState(null);
  const [script, setScript] = useState('');
  const [cameraMode, setCameraMode] = useState('drone');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState(false);

  const steps = ['Mod Seçimi', 'Görsel Yükleme', 'Senaryo', 'Kamera', 'Önizleme'];

  const buildPrompt = () => {
    const basePrompt = selectedMode === 'presenter'
      ? 'Sinematik emlak satışı tanıtımı, adam sitenin bahçesinde Türkçe konuşarak şu sözleri söyler: '
      : 'Sinematik emlak tanıtım videosu, ';

    const cameraPrompt = cameraMode === 'drone'
      ? 'Drone kamera önce havaya doğru yavaşça yukarı çıkar, 360 derece döner. '
      : 'Sabit sinematik kamera çekimi, profesyonel ışıklandırma. ';

    return basePrompt + cameraPrompt + script;
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    setGeneratedVideo(true);
    setIsGenerating(false);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return selectedMode !== null;
      case 1:
        if (selectedMode === 'presenter') return agentPhoto !== null && propertyPhoto !== null;
        return propertyPhoto !== null;
      case 2: return script.length > 10;
      case 3: return true;
      case 4: return true;
      default: return false;
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1 && canProceed()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <AnimatedBackground />

      {/* Header - Centered Dynamic Island Style */}
      <motion.header
        className="fixed top-8 left-0 right-0 z-50 flex justify-center px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="glass-white px-2 py-2 pr-6 rounded-full flex items-center gap-3 shadow-2xl shadow-black/20 hover:scale-105 transition-transform duration-300">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF375F] to-[#FF9F0A] flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Film className="text-white" size={18} />
          </div>
          <div className="flex flex-col">
            <h1 className="hidden md:block text-lg font-bold bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent leading-none">
              EmlakPro<span className="text-[#0A84FF]">AI</span>
            </h1>
            <p className="hidden md:block text-[10px] text-white/40 font-semibold tracking-widest mt-0.5 uppercase">Veo 3.1 Suite</p>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main
        className="w-full max-w-5xl mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-24"
        style={{ paddingTop: '7rem' }} /* Refined Vertical Rhythm */
      >
        <StepIndicator
          steps={steps}
          currentStep={currentStep}
        />

        <AnimatePresence mode="wait">
          {/* STEP 1: Mode Selection */}
          {currentStep === 0 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="text-center mb-12 max-w-2xl mx-auto">
                <motion.h2
                  className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Video Modunu Seçin
                </motion.h2>
                <motion.p
                  className="text-white/50 text-xl font-light leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  Emlak tanıtım videonuz için en uygun görsel dili ve AI motorunu belirleyin
                </motion.p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <ModeCard
                  icon={User2}
                  title="Sunucu Modu"
                  description="AI avatarınız arka planınızda Türkçe konuşarak emlak tanıtımı yapar. Profesyonel bir sunucu deneyimi."
                  selected={selectedMode === 'presenter'}
                  onClick={() => setSelectedMode('presenter')}
                  gradient="bg-gradient-to-br from-[#BF5AF2] to-[#FF375F]"
                />
                <ModeCard
                  icon={Plane}
                  title="Sinematik Mod"
                  description="Drone çekimleri ve sinematik geçişlerle etkileyici B-roll görüntüler oluşturun."
                  selected={selectedMode === 'cinematic'}
                  onClick={() => setSelectedMode('cinematic')}
                  gradient="bg-gradient-to-br from-[#0A84FF] to-[#30D158]"
                />
              </div>
            </motion.div>
          )}

          {/* STEP 2: Asset Upload */}
          {currentStep === 1 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="text-center mb-12 max-w-2xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                  Görselleri Yükleyin
                </h2>
                <p className="text-white/50 text-xl font-light leading-relaxed">
                  {selectedMode === 'presenter'
                    ? 'Kendi portrenizi ve emlak görselinizi yüksek kalitede yükleyin'
                    : 'Sinematik video için yüksek çözünürlüklü emlak görselinizi yükleyin'
                  }
                </p>
              </div>

              <div className={`grid gap-6 ${selectedMode === 'presenter' ? 'md:grid-cols-2 max-w-4xl mx-auto' : 'max-w-xl mx-auto'}`}>
                {selectedMode === 'presenter' && (
                  <DropZone
                    id="agent_photo"
                    label="Emlak Danışmanı Fotoğrafı"
                    instruction="Portre fotoğrafınızı yükleyin"
                    icon={User2}
                    file={agentPhoto}
                    onFileChange={setAgentPhoto}
                  />
                )}
                <DropZone
                  id="property_photo"
                  label="Daire / Manzara Görseli"
                  instruction="Arka plan veya oda fotoğrafı"
                  icon={Building2}
                  file={propertyPhoto}
                  onFileChange={setPropertyPhoto}
                />
              </div>

              {selectedMode === 'presenter' && (
                <motion.div
                  className="glass-card p-4 mt-6 flex items-center gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Sparkles className="text-[#FF9F0A]" size={20} />
                  <p className="text-white/70 text-sm">
                    <strong className="text-[#FF9F0A]">AI Birleştirme:</strong> Fotoğrafınız arka plan ile otomatik olarak birleştirilecektir.
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* STEP 3: Prompt Engineering */}
          {currentStep === 2 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="text-center mb-12 max-w-2xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                  Senaryo Oluşturun
                </h2>
                <p className="text-white/50 text-xl font-light leading-relaxed">
                  Emlak tanıtım metninizi yazın, AI motoru bu metni görselleştirecek
                </p>
              </div>

              <div className="glass-white p-8 mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0A84FF] to-[#BF5AF2] flex items-center justify-center">
                    <Wand2 className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Akıllı Prompt Oluşturucu</h3>
                    <p className="text-white/50 text-sm">Metninizi girin, AI promptu otomatik oluşturulsun</p>
                  </div>
                </div>

                <textarea
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  placeholder="Daire tanıtım metnini buraya girin (Örn: Siteye ilk adım attığınızda sizi sosyal alanlar karşılıyor...)"
                  className="input-field min-h-[160px] resize-none text-base leading-relaxed"
                />

                <div className="flex items-center justify-between mt-4">
                  <span className="text-white/40 text-sm">{script.length} karakter</span>
                  <motion.button
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-sm transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Sparkles size={14} />
                    AI ile İyileştir
                  </motion.button>
                </div>
              </div>

              <div className="glass-card p-6">
                <h4 className="text-white/80 font-medium mb-3 flex items-center gap-2">
                  <Settings2 size={16} />
                  Oluşturulan Prompt Önizleme
                </h4>
                <p className="text-white/50 text-sm leading-relaxed bg-black/20 p-4 rounded-xl">
                  {buildPrompt() || 'Metin girdiğinizde prompt burada görünecek...'}
                </p>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Camera Settings */}
          {currentStep === 3 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="text-center mb-12 max-w-2xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                  Kamera Ayarları
                </h2>
                <p className="text-white/50 text-xl font-light leading-relaxed">
                  Videonuz için en etkileyici kamera hareketini seçin
                </p>
              </div>

              <div className="space-y-4 max-w-2xl mx-auto">
                <CameraOption
                  name="Drone Çekimi"
                  description="Havadan yavaşça yükselen ve 360° dönen sinematik çekim"
                  icon={Plane}
                  selected={cameraMode === 'drone'}
                  onClick={() => setCameraMode('drone')}
                />
                <CameraOption
                  name="Sabit Konuşmacı"
                  description="Profesyonel stüdyo tarzı sabit kamera, konuşmacıya odaklı"
                  icon={CircleDot}
                  selected={cameraMode === 'static'}
                  onClick={() => setCameraMode('static')}
                />
              </div>

              <motion.div
                className="glass-card p-6 mt-8 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Camera className="text-[#0A84FF]" size={20} />
                  <h4 className="font-semibold text-white">Kamera Prompt Önizlemesi</h4>
                </div>
                <p className="text-white/60 text-sm bg-black/20 p-4 rounded-xl leading-relaxed">
                  {cameraMode === 'drone'
                    ? 'Drone kamera önce havaya doğru yavaşça yukarı çıkar, 360 derece döner.'
                    : 'Sinematik emlak satışı tanıtımı, adam sitenin bahçesinde sabit kamera çekimi.'
                  }
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* STEP 5: Preview and Export */}
          {currentStep === 4 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="text-center mb-12 max-w-2xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                  Önizleme & Dışa Aktarma
                </h2>
                <p className="text-white/50 text-xl font-light leading-relaxed">
                  Videonuzu oluşturun ve dış dünyaya aktarın
                </p>
              </div>

              <div className="glass-white p-6 mb-6">
                <div className="video-container">
                  <AnimatePresence mode="wait">
                    {isGenerating ? (
                      <motion.div
                        key="generating"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center gap-4"
                      >
                        <motion.div
                          className="w-16 h-16 rounded-full border-4 border-[#0A84FF] border-t-transparent"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <p className="text-white/70">Video oluşturuluyor...</p>
                        <p className="text-white/40 text-sm">Bu işlem birkaç dakika sürebilir</p>
                      </motion.div>
                    ) : generatedVideo ? (
                      <motion.div
                        key="video"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full h-full relative"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e]/80 to-[#16213e]/80 flex items-center justify-center">
                          <div className="text-center">
                            <motion.div
                              className="w-20 h-20 rounded-full bg-gradient-to-br from-[#30D158] to-[#0A84FF] flex items-center justify-center mx-auto mb-4"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <Check size={40} className="text-white" />
                            </motion.div>
                            <h3 className="text-2xl font-bold text-white mb-2">Video Hazır!</h3>
                            <p className="text-white/60">Profesyonel emlak tanıtım videonuz oluşturuldu</p>
                          </div>
                        </div>

                        {/* Video Controls Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <motion.button
                                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Play size={18} className="text-white ml-0.5" />
                              </motion.button>
                              <span className="text-white/70 text-sm">0:00 / 0:45</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <motion.button
                                className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20"
                                whileHover={{ scale: 1.1 }}
                              >
                                <Volume2 size={16} className="text-white" />
                              </motion.button>
                              <motion.button
                                className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20"
                                whileHover={{ scale: 1.1 }}
                              >
                                <Maximize2 size={16} className="text-white" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center gap-4"
                      >
                        <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center">
                          <Video className="text-white/40" size={36} />
                        </div>
                        <p className="text-white/50">Video önizlemesi burada görünecek</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Summary Card */}
              <div className="glass-card p-6 mb-6">
                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Settings2 size={18} />
                  Video Özeti
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-black/20 p-4 rounded-xl">
                    <span className="text-white/40 text-sm">Mod</span>
                    <p className="text-white font-medium mt-1">
                      {selectedMode === 'presenter' ? 'Sunucu Modu' : 'Sinematik Mod'}
                    </p>
                  </div>
                  <div className="bg-black/20 p-4 rounded-xl">
                    <span className="text-white/40 text-sm">Kamera</span>
                    <p className="text-white font-medium mt-1">
                      {cameraMode === 'drone' ? 'Drone Çekimi' : 'Sabit Konuşmacı'}
                    </p>
                  </div>
                  <div className="bg-black/20 p-4 rounded-xl md:col-span-2">
                    <span className="text-white/40 text-sm">Senaryo</span>
                    <p className="text-white font-medium mt-1 line-clamp-2">
                      {script || 'Senaryo girilmedi'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {!generatedVideo ? (
                  <motion.button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="btn-primary flex-1 flex items-center justify-center gap-3 py-4 text-lg disabled:opacity-50"
                    whileHover={{ scale: isGenerating ? 1 : 1.02 }}
                    whileTap={{ scale: isGenerating ? 1 : 0.98 }}
                  >
                    {isGenerating ? (
                      <>
                        <motion.div
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Oluşturuluyor...
                      </>
                    ) : (
                      <>
                        <Sparkles size={22} />
                        Video Oluştur
                      </>
                    )}
                  </motion.button>
                ) : (
                  <>
                    <motion.button
                      className="btn-primary flex-1 flex items-center justify-center gap-3 py-4 text-lg"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Download size={22} />
                      İndir (MP4)
                    </motion.button>
                    <motion.button
                      className="btn-secondary flex-1 flex items-center justify-center gap-3 py-4 text-lg"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Film size={22} />
                      CapCut'a Gönder
                    </motion.button>
                  </>
                )}
              </div>

              {generatedVideo && (
                <motion.button
                  onClick={() => {
                    setGeneratedVideo(false);
                    setCurrentStep(0);
                    setSelectedMode(null);
                    setAgentPhoto(null);
                    setPropertyPhoto(null);
                    setScript('');
                    setCameraMode('drone');
                  }}
                  className="w-full mt-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 flex items-center justify-center gap-2 transition-colors"
                >
                  <RotateCcw size={18} />
                  Yeni Video Oluştur
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        {currentStep < 4 && (
          <motion.div
            className="flex justify-between items-center mt-16 max-w-3xl mx-auto px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="btn-secondary flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-xl border border-white/5"
              whileHover={{ scale: currentStep === 0 ? 1 : 1.02 }}
              whileTap={{ scale: currentStep === 0 ? 1 : 0.98 }}
            >
              <ChevronLeft size={18} />
              Geri
            </motion.button>

            <motion.button
              onClick={nextStep}
              disabled={!canProceed()}
              className="btn-primary flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
              whileHover={{ scale: !canProceed() ? 1 : 1.02 }}
              whileTap={{ scale: !canProceed() ? 1 : 0.98 }}
            >
              Devam Et
              <ChevronRight size={18} />
            </motion.button>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 py-4 text-center text-white/30 text-sm">
        <p>Powered by Google Veo 3.1 • EmlakProAI © 2026</p>
      </footer>
    </div>
  );
}

export default App;

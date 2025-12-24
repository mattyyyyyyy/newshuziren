import React, { useState } from 'react';
import Landing from './components/Landing';
import Studio from './components/Studio';
import CursorSystem from './components/CursorSystem';
import PromptLibrary from './components/PromptLibrary';
import { AppModule, Asset } from './types';

const TEXT_CONTENT = {
  zh: {
    heroTitle: "新一代 AIGC 创作平台",
    features: ["2D 对口型", "2D 实时对话", "2D 虚拟化身", "3D 虚拟化身"],
    studio: {
      nav: { saveSettings: "保存设置", systemSettings: "系统设置" },
      controls: {
        title: "控制台",
        voice: "音色选择",
        voiceSelectLabel: "选择音色",
        voiceLangLabel: "语言",
        voiceGenderLabel: "性别",
        voiceFilters: { all: "全部", male: "男声", female: "女声" },
        voiceEmotionLabel: "情绪",
        voiceSpeedLabel: "语速",
        voicePitchLabel: "语调",
        refImage: "参考形象 / 视频",
        bgMusic: "上传背景音乐",
        upload: "上传",
        placeholder: "输入对话内容...",
        drivePlaceholder: "输入内容...",
        chatPlaceholder: "输入消息...",
        initiate: "建立连接",
        terminate: "断开连接",
        generate: "开始生成",
        generating: "生成中...",
        ready: "READY",
        history: "历史记录",
        voiceCall: "开始对话",
        endCall: "结束对话",
        send: "发送",
        voiceInput: "语音输入",
        cancelVoice: "取消",
        callActive: "通话中",
        searchVoice: "搜索音色...",
        searchAvatar: "搜索形象...",
        searchAccessory: "搜索配饰...",
        searchMine: "搜索我的...",
        actions: "动作"
      },
      dialog: {
        title: "覆盖模型?",
        desc: "切换基础模型将重置当前的配饰组合。确定要继续吗？",
        confirm: "确定覆盖",
        cancel: "取消",
        callWarning: "请先结束当前对话",
        tip: "提示"
      },
      assets: {
        title: "资产库",
        save: "保存状态 (云端)",
        tabs: { public: "形象库", mine: "我的", male: "男", female: "女", pet: "宠物" },
        models: "角色模型",
        accessories: "形象配饰"
      }
    }
  },
  en: {
    heroTitle: "Next-Gen AIGC Platform",
    features: ["2D Lip Sync", "2D Real-time Chat", "2D Virtual Avatar", "3D Virtual Avatar"],
    studio: {
      nav: { saveSettings: "Save Settings", systemSettings: "System Settings" },
      controls: {
        title: "Control Panel",
        voice: "Voice Selection",
        voiceSelectLabel: "Select Voice",
        voiceLangLabel: "Language",
        voiceGenderLabel: "Gender",
        voiceFilters: { all: "All", male: "Male", female: "Female" },
        voiceEmotionLabel: "Emotion",
        voiceSpeedLabel: "Speed",
        voicePitchLabel: "Pitch",
        refImage: "Reference Image",
        bgMusic: "Upload BGM",
        upload: "Upload",
        placeholder: "Type message...",
        drivePlaceholder: "Enter text...",
        chatPlaceholder: "Type message...",
        initiate: "Link",
        terminate: "Unlink",
        generate: "Generate",
        generating: "Generating...",
        ready: "READY",
        history: "History",
        voiceCall: "Call",
        endCall: "End",
        send: "Send",
        voiceInput: "Voice",
        cancelVoice: "Cancel",
        callActive: "In Call",
        searchVoice: "Search voice...",
        searchAvatar: "Search avatar...",
        searchAccessory: "Search accessory...",
        searchMine: "Search mine...",
        actions: "Actions"
      },
      dialog: {
        title: "Overwrite Model?",
        desc: "Reset current accessory combo?",
        confirm: "Overwrite",
        cancel: "Cancel",
        callWarning: "End call first",
        tip: "Notice"
      },
      assets: {
        title: "Asset Library",
        save: "Save State",
        tabs: { public: "Avatar Lib", mine: "Mine", male: "Male", female: "Female", pet: "Pet" },
        models: "Models",
        accessories: "Accessories"
      }
    }
  }
};

const THEME_A_URL = "https://res.cloudinary.com/djmxoehe9/video/upload/v1765817364/12%E6%9C%8816%E6%97%A5_1_u5zzwh.mp4";

export default function App() {
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const [currentModule, setCurrentModule] = useState<AppModule | null>(null);
  const [savedAssets, setSavedAssets] = useState<Asset[]>([]);

  const t = TEXT_CONTENT[lang];

  const renderContent = () => {
    // If no module is selected, show Landing
    if (!currentModule) {
      return (
        <div key="landing" className="w-full h-full animate-in fade-in duration-700">
          <Landing 
            onSelectModule={setCurrentModule} 
            lang={lang}
            setLang={setLang}
            t={t}
          />
        </div>
      );
    }

    // AI Voice special module (Full-screen Iframe)
    if (currentModule === 'ai-voice') {
      return (
        <div key="voice" className="relative w-full h-full animate-in fade-in duration-700">
          <div className="absolute inset-0 w-full h-full z-0">
             <iframe 
                src="https://aigcplatform-v1-0.vercel.app/" 
                className="w-full h-full border-none"
                title="AI Speech"
                allow="microphone"
             />
          </div>
          {/* Internal Back Button for Iframe view */}
          <button 
            onClick={() => setCurrentModule(null)}
            className="absolute top-6 left-6 z-50 p-3 bg-black/50 backdrop-blur-md rounded-full text-white/70 hover:text-white hover:bg-black/70 transition-all border border-white/10"
          >
            返回
          </button>
        </div>
      );
    }

    // Prompt Library special module
    if (currentModule === 'prompt-library') {
      return (
        <div key="prompt" className="w-full h-full animate-in fade-in duration-700 bg-black/60 backdrop-blur-sm relative">
           <button 
              onClick={() => setCurrentModule(null)}
              className="absolute top-6 left-6 z-50 p-3 bg-white/5 backdrop-blur-md rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all border border-white/10"
            >
              返回
            </button>
           <PromptLibrary lang={lang} />
        </div>
      );
    }

    // Default Studio for Avatar modules
    return (
      <div key="studio" className="w-full h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Studio 
          module={currentModule} 
          onChangeModule={setCurrentModule}
          lang={lang} 
          setLang={setLang}
          onBack={() => setCurrentModule(null)}
          onOpenSettings={() => {}} 
          savedAssets={savedAssets}
          onSaveAsset={(asset) => setSavedAssets(prev => [asset, ...prev])}
          t={t}
        />
      </div>
    );
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden text-white selection:bg-indigo-500/30">
      <CursorSystem />

      <div className="absolute inset-0 z-0">
        <video 
          src={THEME_A_URL}
          autoPlay loop muted playsInline
          className="w-full h-full object-cover object-top"
        />
        <div className={`absolute inset-0 transition-colors duration-700 pointer-events-none ${
          currentModule ? 'bg-black/80' : 'bg-black/10'
        }`} />
      </div>

      <div className="relative z-10 w-full h-full">
        {renderContent()}
      </div>
    </div>
  );
}
import React from 'react';
import { Search, Sparkles, Copy, ChevronRight } from 'lucide-react';

const PROMPTS = [
  { id: 1, title: '新闻播报风格', category: '视频', tags: ['专业', '写实'], content: '作为一名资深新闻主播，以平稳专业的语调播报关于人工智能最新进展的新闻...' },
  { id: 2, title: '带货直播开场', category: '营销', tags: ['热情', '动感'], content: '欢迎来到直播间！今天给大家带来的是我们JDO平台的最新数字人模型...' },
  { id: 3, title: '治愈系睡前故事', category: '创意', tags: ['温柔', '慢速'], content: '在遥远的星系里，有一颗闪闪发光的小星球，那里住着一只爱做梦的小猫...' },
  { id: 4, title: '双语教学助手', category: '教育', tags: ['标准', '互动'], content: 'Hello class! Today we are going to learn about digital twins. 大家好，今天我们要学习数字孪生...' },
];

export default function PromptLibrary({ lang }: { lang: 'zh' | 'en' }) {
  return (
    <div className="w-full h-full pt-20 px-10 flex flex-col items-center">
      <div className="max-w-4xl w-full">
        <div className="flex flex-col gap-2 mb-10 text-center animate-in slide-in-from-top-4 duration-700">
          <h2 className="text-3xl font-bold tracking-[0.1em]">
            {lang === 'zh' ? '提示词灵感库' : 'Prompt Inspiration'}
          </h2>
          <p className="text-white/40 text-sm">
            {lang === 'zh' ? '探索最适合数字人的交互指令' : 'Explore best-in-class commands for your avatars'}
          </p>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
          <input 
            type="text" 
            placeholder={lang === 'zh' ? '搜索提示词...' : 'Search prompts...'}
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PROMPTS.map((item, i) => (
            <div 
              key={item.id} 
              className="group bg-white/[0.03] border border-white/5 p-5 rounded-2xl hover:bg-white/[0.06] hover:border-white/20 transition-all cursor-pointer animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Sparkles size={16} />
                  </div>
                  <h3 className="font-bold text-sm group-hover:text-indigo-300 transition-colors">{item.title}</h3>
                </div>
                <button className="p-2 text-white/20 hover:text-white transition-colors">
                  <Copy size={14} />
                </button>
              </div>
              <p className="text-xs text-white/50 line-clamp-2 leading-relaxed mb-4">
                {item.content}
              </p>
              <div className="flex items-center gap-2">
                {item.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[9px] text-white/40">{tag}</span>
                ))}
                <div className="ml-auto flex items-center gap-1 text-[9px] text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {lang === 'zh' ? '使用此提示' : 'Use this'}
                  <ChevronRight size={10} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
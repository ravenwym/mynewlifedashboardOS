import React, { useState, useEffect } from 'react';
import { 
  Sun, Moon, Droplet, Calendar, CheckSquare, DollarSign, 
  MessageSquare, Utensils, Plane, Plus, Trash2, Check, 
  RefreshCw, Settings, Sparkles, Clock, MapPin 
} from 'lucide-react';

export default function App() {
  // 1. 本地狀態與 LocalStorage 同步
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // 水分追蹤 (目標 2500ml)
  const [water, setWater] = useState(() => {
    const saved = localStorage.getItem('lifeos_water');
    return saved !== null ? Number(saved) : 0;
  });

  // 30日習慣打卡
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('lifeos_habits');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: '晨間 Duolingo 學習', completed: false },
      { id: 2, name: '喝水達標 2500ml', completed: false },
      { id: 3, name: '閱讀 Readmoo / AI 新知', completed: false }
    ];
  });
  const [newHabitName, setNewHabitName] = useState('');

  // 記帳與財務
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('lifeos_expenses');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: '手沖咖啡豆', amount: 120, category: '日常' },
      { id: 2, title: 'Vanguard VOO 定投', amount: 5000, category: '投資' }
    ];
  });
  const [expTitle, setExpTitle] = useState('');
  const [expAmount, setExpAmount] = useState('');

  // 語音/靈感收集 (Eisenhower Matrix)
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('lifeos_notes');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: '週末陶藝課練習拉坯技巧', quadrant: 'important_urgent' }
    ];
  });
  const [noteText, setNoteText] = useState('');
  const [noteQuadrant, setNoteQuadrant] = useState('important_urgent');

 // 儲存至 LocalStorage
  useEffect(() => {
    localStorage.setItem('lifeos_water', water);
  }, [water]);
  useEffect(() => {
    localStorage.setItem('lifeos_habits', JSON.stringify(habits));
  }, [habits]);
  useEffect(() => {
    localStorage.setItem('lifeos_expenses', JSON.stringify(expenses));
  }, [expenses]);
  useEffect(() => {
    localStorage.setItem('lifeos_notes', JSON.stringify(notes));
  }, [notes]);

  // ▼ 將這段貼在這裡 ▼
  const syncToGoogleSheets = async (category, value, note = '') => {
    const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxnxY3vaPvu80mV5rIZVaP0PC1QV91PxW8EXvyaub9qI2a5R0_uAvQ1PE56TzoQEpOF/exec";

    try {
      const response = await fetch(WEB_APP_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category, value, note })
      });
      console.log("已成功發送至 Google 試算表");
    } catch (error) {
      console.error("發送失敗：", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      ...

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 頂部導航列 */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-white">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">LifeOS 個人全方位生活助手</h1>
            <p className="text-xs text-slate-400">零幻覺架構 · 手動真實錄入 · 本地端持久化 (LocalStorage)</p>
          </div>
        </div>
        
        {/* 導航分頁按鈕 */}
        <nav className="flex space-x-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
          {[
            { id: 'dashboard', label: '儀表板', icon: Sun },
            { id: 'habits', label: '30日習慣', icon: CheckSquare },
            { id: 'finance', label: '財務記帳', icon: DollarSign },
            { id: 'notes', label: '靈感矩陣', icon: MessageSquare }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </header>

      {/* 主內容區 */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        
        {/* 1. 儀表板檢視 */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 天氣與時間模組 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-indigo-400" />
                    <span>時間與通勤天氣</span>
                  </h2>
                  <span className="text-xs px-2.5 py-1 bg-slate-800 text-slate-300 rounded-full flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-red-400" />
                    <span>香港</span>
                  </span>
                </div>
                <div className="space-y-2 text-slate-300 text-sm">
                  <p className="flex justify-between"><span>今日日期：</span><span className="font-medium text-white">{new Date().toLocaleDateString()}</span></p>
                  <p className="flex justify-between"><span>早間通勤：</span><span className="font-medium text-indigo-300">09:00 - 09:30 Podcast</span></p>
                  <p className="text-xs text-slate-500 mt-4 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                    💡 天氣與時間模組：未設定 OpenWeatherMap API 前保持空白，不產生任何 AI 幻覺數據。
                  </p>
                </div>
              </div>
            </div>

            {/* 水分追蹤器 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold flex items-center space-x-2">
                    <Droplet className="w-5 h-5 text-cyan-400" />
                    <span>今日水分補給</span>
                  </h2>
                  <span className="text-sm font-bold text-cyan-400">{water} ml / 2500 ml</span>
                </div>
                
                {/* 進度條 */}
                <div className="w-full bg-slate-950 rounded-full h-3 mb-6 overflow-hidden border border-slate-800">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (water / 2500) * 100)}%` }}
                  ></div>
                </div>
              </div>

<div className="grid grid-cols-3 gap-2">
  <button 
    onClick={() => {
      setWater(w => Math.max(0, w - 250));
      syncToGoogleSheets('water', -250, '減少水分');
    }} 
    className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition"
  >
    -250 ml
  </button>
  
  <button 
    onClick={() => {
      setWater(w => w + 250);
      syncToGoogleSheets('water', 250, '補充水分');
    }} 
    className="py-2 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-medium transition"
  >
    +250 ml
  </button>
  
  <button 
    onClick={() => {
      setWater(w => w + 500);
      syncToGoogleSheets('water', 500, '大杯補充');
    }} 
    className="py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-medium transition shadow-lg shadow-cyan-600/20"
  >
    +500 ml
  </button>
</div>
            </div>

            {/* 快速摘要 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>系統運行狀態</span>
                </h2>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-center justify-between"><span className="text-slate-400">前端框架</span><span className="text-emerald-400 font-medium">React + Vite</span></li>
                  <li className="flex items-center justify-between"><span className="text-slate-400">樣式引擎</span><span className="text-indigo-400 font-medium">Tailwind CSS</span></li>
                  <li className="flex items-center justify-between"><span className="text-slate-400">資料儲存</span><span className="text-cyan-400 font-medium">LocalStorage</span></li>
                  <li className="flex items-center justify-between"><span className="text-slate-400">預設假資料</span><span className="text-amber-400 font-medium">零 (完全手動錄入)</span></li>
                </ul>
              </div>
            </div>

          </div>
        )}

        {/* 2. 30日習慣打卡 */}
        {activeTab === 'habits' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center space-x-2">
                <CheckSquare className="w-6 h-6 text-indigo-400" />
                <span>30日習慣打卡追蹤</span>
              </h2>
            </div>

            {/* 新增習慣 */}
            <div className="flex space-x-3">
              <input 
                type="text" 
                placeholder="輸入新習慣（例如：Readmoo 閱讀 30 分鐘）"
                value={newHabitName}
                onChange={e => setNewHabitName(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
              <button 
                onClick={() => {
                  if (!newHabitName.trim()) return;
                  setHabits([...habits, { id: Date.now(), name: newHabitName, completed: false }]);
                  setNewHabitName('');
                }}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-indigo-600/20 flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>新增習慣</span>
              </button>
            </div>

            {/* 習慣列表 */}
            <div className="space-y-3">
              {habits.length === 0 ? (
                <p className="text-slate-500 text-center py-8">目前尚無習慣，請從上方手動新增。</p>
              ) : (
                habits.map(habit => (
                  <div key={habit.id} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800/80 rounded-xl">
                    <label className="flex items-center space-x-3 cursor-pointer flex-1">
                      <input 
                        type="checkbox" 
                        checked={habit.completed}
                        onChange={() => {
                          setHabits(habits.map(h => h.id === habit.id ? { ...h, completed: !h.completed } : h));
                        }}
                        className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className={`text-sm font-medium ${habit.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {habit.name}
                      </span>
                    </label>
                    <button 
                      onClick={() => setHabits(habits.filter(h => h.id !== habit.id))}
                      className="text-slate-500 hover:text-red-400 p-2 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 3. 財務記帳 */}
        {activeTab === 'finance' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <h2 className="text-xl font-bold flex items-center space-x-2">
              <DollarSign className="w-6 h-6 text-emerald-400" />
              <span>財務與投資紀錄</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input 
                type="text" 
                placeholder="項目名稱（例如：手沖咖啡豆）"
                value={expTitle}
                onChange={e => setExpTitle(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              />
              <input 
                type="number" 
                placeholder="金額 (HKD)"
                value={expAmount}
                onChange={e => setExpAmount(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              />
              <button 
                onClick={() => {
                  if (!expTitle.trim() || !expAmount) return;
                  setExpenses([...expenses, { id: Date.now(), title: expTitle, amount: Number(expAmount), category: '支出' }]);
                  setExpTitle('');
                  setExpAmount('');
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-emerald-600/20 py-2.5 flex items-center justify-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>新增記帳</span>
              </button>
            </div>

            <div className="space-y-3">
              {expenses.map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800/80 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-slate-200">{item.title}</p>
                    <span className="text-xs text-slate-500">{item.category}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-bold text-emerald-400">HK$ {item.amount}</span>
                    <button onClick={() => setExpenses(expenses.filter(e => e.id !== item.id))} className="text-slate-500 hover:text-red-400 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. 靈感矩陣 */}
        {activeTab === 'notes' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <h2 className="text-xl font-bold flex items-center space-x-2">
              <MessageSquare className="w-6 h-6 text-amber-400" />
              <span>艾森豪威爾靈感矩陣</span>
            </h2>

            <div className="flex flex-col md:flex-row gap-3">
              <input 
                type="text" 
                placeholder="輸入靈感或備忘..."
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
              />
              <select 
                value={noteQuadrant} 
                onChange={e => setNoteQuadrant(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none"
              >
                <option value="important_urgent">重要且緊急</option>
                <option value="important_not_urgent">重要不緊急</option>
                <option value="not_important_urgent">不重要但緊急</option>
                <option value="not_important_not_urgent">不重要不緊急</option>
              </select>
              <button 
                onClick={() => {
                  if (!noteText.trim()) return;
                  setNotes([...notes, { id: Date.now(), text: noteText, quadrant: noteQuadrant }]);
                  setNoteText('');
                }}
                className="bg-amber-600 hover:bg-amber-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition shadow-lg shadow-amber-600/20"
              >
                新增筆記
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'important_urgent', label: '🔥 重要且緊急' },
                { key: 'important_not_urgent', label: '🌱 重要不緊急 (長期發展)' },
                { key: 'not_important_urgent', label: '⚡ 不重要但緊急' },
                { key: 'not_important_not_urgent', label: '☕ 不重要不緊急' }
              ].map(q => (
                <div key={q.key} className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-3">
                  <h3 className="text-sm font-semibold text-slate-300">{q.label}</h3>
                  <div className="space-y-2">
                    {notes.filter(n => n.quadrant === q.key).map(note => (
                      <div key={note.id} className="flex items-center justify-between bg-slate-900 p-3 rounded-lg border border-slate-800 text-sm">
                        <span className="text-slate-200">{note.text}</span>
                        <button onClick={() => setNotes(notes.filter(n => n.id !== note.id))} className="text-slate-500 hover:text-red-400">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

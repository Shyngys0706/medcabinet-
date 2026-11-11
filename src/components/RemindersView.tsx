import React, { useState } from 'react';
import { Reminder, User } from '../types';
import { MessageSquare, Send, CheckCheck, Bell, Smartphone } from 'lucide-react';

interface RemindersViewProps {
  currentUser: User;
  reminders: Reminder[];
  onSendTestReminder: (message: string, recipientName: string, phone: string) => void;
}

export const RemindersView: React.FC<RemindersViewProps> = ({
  currentUser,
  reminders,
  onSendTestReminder,
}) => {
  const [testMsg, setTestMsg] = useState('');
  const [recipient, setRecipient] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);

  const filteredReminders =
    currentUser.role === 'admin'
      ? reminders
      : reminders.filter(
          (r) =>
            r.userId === currentUser.id ||
            r.recipientName.includes(currentUser.name) ||
            r.recipientPhone === currentUser.phone
        );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testMsg.trim()) return;
    onSendTestReminder(testMsg.trim(), recipient, phone);
    setTestMsg('');
  };

  return (
    <div className="space-y-6">
      {/* Overview header banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-teal-600" />
              Автоматты SMS & WhatsApp еске салғыштар орталығы
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Кабинет брондалғанда немесе қабылдауға жазылғанда жүйе хабарламаларды автоматты түрде генерациялайды.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Тікелей GSM/SMS симуляциясы
          </span>
        </div>

        {/* Quick Send Test SMS */}
        <form onSubmit={handleSend} className="mt-4 pt-2">
          <span className="text-xs font-bold text-slate-700 block mb-2">
            Жылдам сынақтық SMS хабарлама жіберу (Симуляция)
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mb-2">
            <div>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Қабылдаушы аты"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50"
                required
              />
            </div>
            <div>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Телефон нөмірі"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 font-mono"
                required
              />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={testMsg}
                onChange={(e) => setTestMsg(e.target.value)}
                placeholder="Хабарлама мәтіні..."
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200"
                required
              />
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Send className="w-3 h-3" />
                <span>Жіберу</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {filteredReminders.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-200 text-slate-500">
            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700">Хабарламалар тізімі бос</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Кабинет брондағанда немесе қабылдауға жазылған кезде хабарлама автоматты түрде пайда болады.
            </p>
          </div>
        ) : (
          filteredReminders.map((rem) => (
            <div
              key={rem.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-start justify-between gap-4 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                    rem.channel === 'WhatsApp' ? 'bg-emerald-600' : 'bg-teal-600'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        rem.channel === 'WhatsApp'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-sky-50 text-sky-700 border border-sky-200'
                      }`}
                    >
                      {rem.channel}
                    </span>
                    <strong className="text-xs text-slate-900 font-bold">{rem.recipientName}</strong>
                    <span className="font-mono text-[11px] text-slate-500">{rem.recipientPhone}</span>
                    <span className="text-[11px] text-slate-400">· {rem.sentAt}</span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                    {rem.message}
                  </p>
                </div>
              </div>

              <div className="shrink-0 self-center">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Жеткізілді
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

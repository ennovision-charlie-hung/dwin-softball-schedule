import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Share2, ChevronRight, CalendarPlus, Trophy, Users } from 'lucide-react';

// 定義比賽資料介面
interface Match {
  id: number;
  date: string;
  time: string;
  team1: string;
  team2: string;
  field: string;
  league: string; // e.g., 清新B
  timestamp: number;
}

const App = () => {
  // 整理自圖片的賽程資料 (重點放在紅框部分: DWIN 相關賽事)
  const matches: Match[] = [
    {
      id: 1,
      date: '2026-02-22',
      time: '12:00',
      team1: 'ATM',
      team2: 'DWIN',
      field: '美堤 A 球場',
      league: '清新B',
      timestamp: new Date('2026-02-22T12:00:00').getTime()
    },
    {
      id: 2,
      date: '2026-02-22',
      time: '13:00',
      team1: 'DWIN',
      team2: 'Duck Duck',
      field: '美堤 A 球場',
      league: '清新B',
      timestamp: new Date('2026-02-22T13:00:00').getTime()
    },
    {
      id: 3,
      date: '2026-03-15',
      time: '14:00',
      team1: 'DWIN',
      team2: '小飛象',
      field: '美堤 A 球場',
      league: '清新B',
      timestamp: new Date('2026-03-15T14:00:00').getTime()
    },
    {
      id: 4,
      date: '2026-03-15',
      time: '16:00',
      team1: '北極星',
      team2: 'DWIN',
      field: '美堤 A 球場',
      league: '清新B',
      timestamp: new Date('2026-03-15T16:00:00').getTime()
    },
    {
      id: 5,
      date: '2026-04-19',
      time: '14:00',
      team1: 'SHUANGXI',
      team2: 'DWIN',
      field: '美堤 A 球場',
      league: '清新B',
      timestamp: new Date('2026-04-19T14:00:00').getTime()
    },
    {
      id: 6,
      date: '2026-04-19',
      time: '15:00',
      team1: 'DWIN',
      team2: '華南永昌',
      field: '美堤 A 球場',
      league: '清新B',
      timestamp: new Date('2026-04-19T15:00:00').getTime()
    },
    {
      id: 7,
      date: '2026-05-10',
      time: '15:00',
      team1: '魔鬼鯊',
      team2: 'DWIN',
      field: '美堤 A 球場',
      league: '清新B',
      timestamp: new Date('2026-05-10T15:00:00').getTime()
    },
    {
      id: 8,
      date: '2026-05-10',
      time: '16:00',
      team1: 'DWIN',
      team2: 'Power man',
      field: '美堤 A 球場',
      league: '清新B',
      timestamp: new Date('2026-05-10T16:00:00').getTime()
    }
  ];

  // 提供的 Google Calendar CID 連結
  const calendarLink = "https://calendar.google.com/calendar/u/0?cid=Y19jYTcyOTRkMzE2ZWE1YmI4YThmNDg3YWIyOTA1ZTVjMTI4ODdmZjBhZGUzNmEwY2RhZjgyNWMyMWNlZjBiMGE1QGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20";

  const [nextMatch, setNextMatch] = useState<Match | null>(null);
  const [countdown, setCountdown] = useState<string>("");

  useEffect(() => {
    const now = new Date().getTime(); 
    const upcoming = matches.find(m => m.timestamp > now);
    setNextMatch(upcoming || matches[matches.length - 1]);

    const timer = setInterval(() => {
      if (upcoming) {
        const diff = upcoming.timestamp - new Date().getTime();
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          setCountdown(`${days}天 ${hours}小時`);
        } else {
          setCountdown("比賽進行中或已結束");
        }
      }
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const generateGoogleCalendarUrl = (match: Match) => {
    const startDateTime = match.date.replace(/-/g, '') + 'T' + match.time.replace(':', '') + '00';
    const endHour = parseInt(match.time.split(':')[0]) + 1;
    const endDateTime = match.date.replace(/-/g, '') + 'T' + (endHour < 10 ? '0' + endHour : endHour) + match.time.split(':')[1] + '00';
    
    const title = `壘球賽：${match.team1} vs ${match.team2}`;
    const details = `組別：${match.league}\n對手：${match.team1 === 'DWIN' ? match.team2 : match.team1}`;
    const location = match.field;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDateTime}/${endDateTime}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const getWeekDay = (dateStr: string) => {
    const days = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
    return days[new Date(dateStr).getDay()];
  };

  // Group matches by date
  const groupedMatches = matches.reduce((acc, match) => {
    if (!acc[match.date]) {
      acc[match.date] = [];
    }
    acc[match.date].push(match);
    return acc;
  }, {} as Record<string, Match[]>);

  const sortedDates = Object.keys(groupedMatches).sort();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-12">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-green-700 to-emerald-600 text-white p-6 shadow-lg rounded-b-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-10">
          <Trophy size={200} />
        </div>
        
        <div className="relative z-10 max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-2 opacity-90">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold tracking-wider">2026 美堤春季聯盟賽</span>
            <span className="text-xs font-medium">清新 B 組</span>
          </div>
          <h1 className="text-3xl font-extrabold mb-1">DWIN 壘球隊</h1>
          <p className="opacity-90 text-sm mb-6">熱血開戰，全力以赴！</p>

          {/* Next Match Highlight Card inside Header */}
          {nextMatch && (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 mt-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-green-200 uppercase tracking-wide">下一場比賽</span>
                <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded font-bold">
                  {countdown ? `倒數 ${countdown}` : '即將開始'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="text-xl font-bold">{nextMatch.team1}</div>
                </div>
                <div className="text-sm font-bold opacity-75 px-2">VS</div>
                <div className="text-center">
                  <div className="text-xl font-bold">{nextMatch.team2}</div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-center gap-4 text-xs opacity-90">
                <div className="flex items-center gap-1">
                  <Calendar size={12} /> {formatDate(nextMatch.date)}
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={12} /> {nextMatch.time}
                </div>
                <a 
                  href="https://maps.app.goo.gl/eRzf41tPTogzahkR6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-yellow-300 transition-colors cursor-pointer"
                >
                  <MapPin size={12} /> {nextMatch.field}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="max-w-md mx-auto px-4 -mt-5 relative z-20">
        <a 
          href={calendarLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full bg-white text-emerald-700 shadow-lg rounded-xl py-3 px-4 flex items-center justify-center gap-2 font-bold hover:bg-emerald-50 transition border border-emerald-100"
        >
          <CalendarPlus size={20} />
          訂閱球隊行事曆
        </a>
      </div>

      {/* Schedule List Grouped by Date */}
      <div className="max-w-md mx-auto px-4 mt-8">
        <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
          <Calendar size={20} className="text-emerald-600"/> 完整賽程表
        </h2>
        
        <div className="space-y-6">
          {sortedDates.map((date) => (
            <div key={date}>
              {/* Date Header */}
              <div className="flex items-center gap-2 mb-3 px-1 sticky top-0 bg-slate-50/95 backdrop-blur py-2 z-10 rounded-lg">
                <div className="h-5 w-1.5 bg-emerald-500 rounded-full"></div>
                <h3 className="font-bold text-slate-700 text-lg">
                  {date.split('-')[1]}月{date.split('-')[2]}日
                </h3>
                <span className="text-sm font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  {getWeekDay(date)}
                </span>
              </div>

              <div className="space-y-3">
                {groupedMatches[date].map((match) => {
                  const isPast = match.timestamp < new Date().getTime();
                  
                  return (
                    <div 
                      key={match.id} 
                      className={`bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md ${isPast ? 'opacity-60 grayscale-[0.5]' : ''}`}
                    >
                      <div className="flex">
                        {/* Left Time Column - replacing Date Column */}
                        <div className="bg-slate-50 w-20 flex flex-col items-center justify-center border-r border-slate-100 p-3">
                          <Clock size={16} className="text-emerald-600 mb-1 opacity-80" />
                          <span className="text-xl font-bold text-slate-800 tracking-tight">{match.time}</span>
                        </div>

                        {/* Right Content Column */}
                        <div className="flex-1 p-4">
                          <div className="flex justify-between items-start mb-2">
                             {/* Spacer or League info if needed, keeping field right aligned */}
                             <div className="text-xs text-slate-400 font-medium">
                               {match.league}
                             </div>
                             <a 
                              href="https://maps.app.goo.gl/eRzf41tPTogzahkR6"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-slate-500 border border-slate-200 px-2 py-0.5 rounded-full flex items-center gap-1 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300 transition-colors cursor-pointer"
                            >
                              <MapPin size={10} />
                              {match.field}
                            </a>
                          </div>

                          <div className="flex items-center justify-between mb-3">
                            <div className={`font-bold text-lg ${match.team1.includes('DWIN') ? 'text-emerald-700' : 'text-slate-700'}`}>
                              {match.team1}
                            </div>
                            <span className="text-slate-300 font-light text-sm px-2">VS</span>
                            <div className={`font-bold text-lg ${match.team2.includes('DWIN') ? 'text-emerald-700' : 'text-slate-700'}`}>
                              {match.team2}
                            </div>
                          </div>

                          {!isPast && (
                            <div className="pt-3 border-t border-slate-50 flex gap-2">
                              <a 
                                href={generateGoogleCalendarUrl(match)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 text-center text-xs bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-600 py-2 rounded-lg transition font-medium flex items-center justify-center gap-1"
                              >
                                <CalendarPlus size={14} />
                                加入日曆
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-slate-400 text-xs pb-8">
        <p>賽程資訊依大會公告為準</p>
        <p className="mt-1">Designed for DWIN Softball Team</p>
      </div>
    </div>
  );
};

export default App;
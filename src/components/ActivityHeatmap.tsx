import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GitCommit, Filter, CheckCircle2, AlertTriangle, Play, HelpCircle, Activity } from "lucide-react";

// Types for heatmap data
interface HeatmapDay {
  date: Date;
  count: number;
  level: 0 | 1 | 2 | 3 | 4; // 0 = none, 4 = maximum activity
  pipelines: {
    name: string;
    type: "smoke" | "regression" | "api" | "performance";
    status: "success" | "failed";
    duration: string;
  }[];
}

export default function ActivityHeatmap() {
  const [filterType, setFilterType] = useState<"all" | "smoke" | "regression" | "api">("all");
  const [hoveredDay, setHoveredDay] = useState<HeatmapDay | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Generate 52 weeks + current week of structured data (approx 370 days)
  const heatmapData = useMemo(() => {
    const days: HeatmapDay[] = [];
    const today = new Date();
    // Start 370 days ago, aligned to the nearest Sunday
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364);
    const startDayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - startDayOfWeek); // Roll back to Sunday

    // Generate date sequence
    const tempDate = new Date(startDate);
    const qaActivities = [
      { name: "Execute Playwright login smoke suite", type: "smoke", status: "success", duration: "1.4s" },
      { name: "Deploy Pytest API snapshot validation rules", type: "api", status: "success", duration: "0.8s" },
      { name: "Run Selenium regression suite on production builds", type: "regression", status: "success", duration: "12.5s" },
      { name: "Trigger JMeter endpoint load stresses (3000 RPS)", type: "performance", status: "success", duration: "15.0s" },
      { name: "Master branch gating check-in", type: "smoke", status: "success", duration: "2.1s" },
      { name: "Validate CORS rules on profile proxies", type: "api", status: "success", duration: "0.4s" },
      { name: "Deploy updated test runners to GCP GKE", type: "regression", status: "failed", duration: "4.5s" }
    ];

    while (tempDate <= today) {
      const dateCopy = new Date(tempDate);
      const isWeekend = dateCopy.getDay() === 0 || dateCopy.getDay() === 6;
      
      // Determine activity frequency based on day of week and seed
      let seed = (dateCopy.getFullYear() * 3 + dateCopy.getMonth() * 7 + dateCopy.getDate() * 13) % 100;
      let count = 0;
      
      if (!isWeekend) {
        if (seed > 85) count = Math.floor(Math.random() * 5) + 6; // Level 4
        else if (seed > 60) count = Math.floor(Math.random() * 3) + 3; // Level 3
        else if (seed > 30) count = Math.floor(Math.random() * 2) + 1; // Level 1 or 2
      } else {
        if (seed > 92) count = Math.floor(Math.random() * 2) + 1; // Rare weekend work
      }

      // Generate random matching pipelines
      const dayPipelines: HeatmapDay["pipelines"] = [];
      if (count > 0) {
        for (let i = 0; i < Math.min(count, 4); i++) {
          const act = qaActivities[(seed + i) % qaActivities.length];
          // Filter match simulated in state helper
          dayPipelines.push({
            name: act.name,
            type: act.type as any,
            status: (act.status === "failed" && (seed + i) % 7 === 0) ? "failed" : "success",
            duration: act.duration
          });
        }
      }

      // Determine level (0 to 4)
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (count > 0) {
        if (count <= 2) level = 1;
        else if (count <= 4) level = 2;
        else if (count <= 7) level = 3;
        else level = 4;
      }

      days.push({
        date: dateCopy,
        count,
        level,
        pipelines: dayPipelines
      });

      tempDate.setDate(tempDate.getDate() + 1);
    }

    return days;
  }, []);

  // Filtered dataset for display
  const filteredData = useMemo(() => {
    if (filterType === "all") return heatmapData;
    return heatmapData.map(day => {
      const matchingPipelines = day.pipelines.filter(p => p.type === filterType);
      const count = matchingPipelines.length;
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (count > 0) {
        if (count === 1) level = 1;
        else if (count === 2) level = 2;
        else if (count === 3) level = 3;
        else level = 4;
      }
      return {
        ...day,
        count,
        level,
        pipelines: matchingPipelines
      };
    });
  }, [heatmapData, filterType]);

  // Group by week for grid columns
  const weeks = useMemo(() => {
    const result: HeatmapDay[][] = [];
    let currentWeek: HeatmapDay[] = [];
    
    filteredData.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        result.push(currentWeek);
        currentWeek = [];
      }
    });
    
    if (currentWeek.length > 0) {
      result.push(currentWeek);
    }
    return result;
  }, [filteredData]);

  // Handle tooltip display on hover
  const handleDayHover = (day: HeatmapDay, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const parentRect = event.currentTarget.parentElement?.parentElement?.getBoundingClientRect();
    
    if (parentRect) {
      setTooltipPos({
        x: rect.left - parentRect.left + rect.width / 2,
        y: rect.top - parentRect.top - 10
      });
    }
    setHoveredDay(day);
  };

  // Color mapping matching Immersive UI deep emerald shades
  const getLevelColorClass = (level: 0 | 1 | 2 | 3 | 4) => {
    switch (level) {
      case 0: return "bg-white/[0.04] border border-white/5 hover:bg-white/[0.12]";
      case 1: return "bg-emerald-950/70 border border-emerald-900/10 hover:bg-emerald-900/50";
      case 2: return "bg-emerald-800/80 border border-emerald-700/20 hover:bg-emerald-700/60";
      case 3: return "bg-emerald-600/90 border border-emerald-500/20 hover:bg-emerald-500/70";
      case 4: return "bg-emerald-400 border border-emerald-300/30 hover:bg-emerald-300";
    }
  };

  // Format month labels for top of heatmap
  const monthLabels = useMemo(() => {
    const labels: { text: string; index: number }[] = [];
    let lastMonth = -1;
    
    weeks.forEach((week, weekIdx) => {
      const firstDayOfWeek = week[0]?.date;
      if (firstDayOfWeek && firstDayOfWeek.getMonth() !== lastMonth) {
        lastMonth = firstDayOfWeek.getMonth();
        labels.push({
          text: firstDayOfWeek.toLocaleString("default", { month: "short" }),
          index: weekIdx
        });
      }
    });

    // Skip every second label if too crowded
    return labels.filter((_, idx) => idx % 2 === 0 || labels.length < 8);
  }, [weeks]);

  // Statistics summaries
  const totalCommits = useMemo(() => {
    return heatmapData.reduce((acc, curr) => acc + curr.count, 0);
  }, [heatmapData]);

  const activeDaysRatio = useMemo(() => {
    const active = heatmapData.filter(d => d.count > 0).length;
    return Math.round((active / heatmapData.length) * 100);
  }, [heatmapData]);

  return (
    <div className="bg-black/40 border border-white/5 rounded-xl p-5 mb-6">
      {/* Heatmap Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <Activity size={15} />
          </span>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-white">CI/CD Execution Matrix</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">365-day pipeline integration consistency audit trail.</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono flex items-center gap-1">
            <Filter size={10} /> Filter:
          </span>
          <div className="flex bg-black/50 p-0.5 rounded-lg border border-white/5">
            {(["all", "smoke", "regression", "api"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`text-[9px] uppercase tracking-wider font-bold px-2 py-1 rounded transition-all cursor-pointer ${
                  filterType === t
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Canvas Wrapper with Horizontal Scroll */}
      <div className="relative">
        <div className="overflow-x-auto no-scrollbar pb-3 scroll-smooth">
          <div className="min-w-[690px] flex flex-col pt-4 pb-1">
            {/* Months Header Row */}
            <div className="flex text-[9px] font-mono text-slate-500 mb-1 ml-6 relative h-4">
              {monthLabels.map((lbl, idx) => (
                <span
                  key={idx}
                  className="absolute"
                  style={{ left: `${lbl.index * 12.5}px` }}
                >
                  {lbl.text}
                </span>
              ))}
            </div>

            {/* Main Day Squares Grid */}
            <div className="flex">
              {/* Day of Week Side labels */}
              <div className="flex flex-col justify-between text-[9px] font-mono text-slate-500 mr-2 w-4 h-[84px] py-0.5">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
              </div>

              {/* Grid Column rendering (53 columns of weeks) */}
              <div className="flex gap-[2px] relative">
                {weeks.map((week, weekIdx) => (
                  <div key={weekIdx} className="flex flex-col gap-[2px]">
                    {week.map((day, dayIdx) => (
                      <div
                        key={dayIdx}
                        onMouseEnter={(e) => handleDayHover(day, e)}
                        onMouseLeave={() => setHoveredDay(null)}
                        className={`w-[10px] h-[10px] rounded-[1.5px] transition-colors cursor-pointer ${getLevelColorClass(
                          day.level
                        )}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hover Tooltip Popup Overlay */}
        <AnimatePresence>
          {hoveredDay && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute z-30 pointer-events-none bg-[#0a0a0a]/95 border border-white/15 p-3 rounded-xl shadow-2xl text-[10px] font-mono w-[220px]"
              style={{
                left: `${tooltipPos.x}px`,
                top: `${tooltipPos.y}px`,
                transform: "translate(-50%, -100%)"
              }}
            >
              <div className="flex justify-between items-center text-slate-500 border-b border-white/5 pb-1 mb-1.5 font-semibold">
                <span>{hoveredDay.date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}</span>
                <span className="text-emerald-400 font-bold">{hoveredDay.count} pipelines</span>
              </div>
              {hoveredDay.pipelines.length > 0 ? (
                <div className="space-y-1">
                  {hoveredDay.pipelines.map((p, idx) => (
                    <div key={idx} className="flex items-start justify-between gap-1 text-[9px]">
                      <span className="text-slate-300 truncate max-w-[130px]" title={p.name}>
                        {p.name}
                      </span>
                      <span className="flex items-center gap-0.5 shrink-0">
                        {p.status === "success" ? (
                          <CheckCircle2 size={9} className="text-emerald-400" />
                        ) : (
                          <AlertTriangle size={9} className="text-rose-400" />
                        )}
                        <span className="text-slate-500">({p.duration})</span>
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-slate-600 italic">No automated tests recorded.</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Heatmap Footer Legend & High-Level Metrics */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-3 pt-3 border-t border-white/5 text-[9px] font-mono text-slate-400">
        <div className="flex items-center gap-4">
          <div>
            Total Automated Runs: <span className="text-emerald-400 font-bold">{totalCommits}</span>
          </div>
          <div>
            Yearly Consistency Ratio: <span className="text-indigo-400 font-bold">{activeDaysRatio}%</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1 text-slate-500">
          <span>Less</span>
          <div className="w-[10px] h-[10px] rounded-[1.5px] bg-white/[0.04] border border-white/5" />
          <div className="w-[10px] h-[10px] rounded-[1.5px] bg-emerald-950/70 border border-emerald-900/10" />
          <div className="w-[10px] h-[10px] rounded-[1.5px] bg-emerald-800/80 border border-emerald-700/20" />
          <div className="w-[10px] h-[10px] rounded-[1.5px] bg-emerald-600/90 border border-emerald-500/20" />
          <div className="w-[10px] h-[10px] rounded-[1.5px] bg-emerald-400 border border-emerald-300/30" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

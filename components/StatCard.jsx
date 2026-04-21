import { cn } from "@/lib/utils";

const StatCard = ({ title, value, icon: Icon, trend, trendType = "up", description, color = "slate" }) => {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    slate: "bg-slate-50 text-slate-600",
    red: "bg-rose-50 text-rose-600",
    emerald: "bg-emerald-50 text-emerald-600"
  };

  return (
    <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-4">
        {Icon ? (
          <div className={cn("p-2 rounded-lg", colorMap[color] || colorMap.slate)}>
            <Icon size={20} />
          </div>
        ) : (
          <div className="p-5" /> // Spacer if no icon
        )}
        {trend && (
          <span className={cn(
            "text-xs font-medium px-2 py-1 rounded-full",
            trendType === "up" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          )}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        {description && <p className="text-xs text-slate-400 mt-2">{description}</p>}
      </div>
    </div>
  );
};

export default StatCard;

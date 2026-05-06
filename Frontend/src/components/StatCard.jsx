const StatCard = ({ title, value, icon: Icon, color = "indigo", subtitle }) => {
  const colorClasses = {
    indigo: "bg-indigo-50 text-indigo-600 shadow-indigo-100",
    green: "bg-green-50 text-green-600 shadow-green-100",
    yellow: "bg-yellow-50 text-yellow-600 shadow-yellow-100",
    red: "bg-red-50 text-red-600 shadow-red-100",
    blue: "bg-blue-50 text-blue-600 shadow-blue-100",
    purple: "bg-purple-50 text-purple-600 shadow-purple-100",
  };

  return (
    <div className="card card-hover p-6 relative overflow-hidden">
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-slate-100/70" />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <h3 className="text-4xl font-extrabold text-slate-900 mt-3">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-2">{subtitle}</p>
          )}
        </div>

        <div
          className={`h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg ${
            colorClasses[color] || colorClasses.indigo
          }`}
        >
          <Icon size={28} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
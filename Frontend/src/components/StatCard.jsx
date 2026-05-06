
const StatCard = ({ title, value, icon: Icon, subtitle }) => {
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-2">
            {value}
          </h3>
        </div>

        <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
          <Icon className="text-indigo-600" size={24} />
        </div>
      </div>

      {subtitle && (
        <p className="text-sm text-slate-400 mt-4">{subtitle}</p>
      )}
    </div>
  );
};

export default StatCard;
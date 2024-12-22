/* eslint-disable react/prop-types */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload.tooltipData;
    const date = new Date(data.date);
    
    const priorities = [
      { label: "High priority", count: Number(data.priorities.high.completed), total: Number(data.priorities.high.total) },
      { label: "Medium priority", count: Number(data.priorities.medium.completed), total: Number(data.priorities.medium.total) },
      { label: "Low priority", count: Number(data.priorities.low.completed), total: Number(data.priorities.low.total) }
    ];

    return (
      <div className="bg-accent text-white p-3 rounded-2xl max-w-sm">
        <div className="space-y-2">
          <div>
            <div className="text-xl font-bold">
              {date.toLocaleDateString('en-US', { weekday: 'long' })}
            </div>
            <div className="text-blue-300 font-thin text-sm">
              {date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}
            </div>
          </div>

          <div className="h-[1px] bg-[#83CFFF]"></div>

          <div className="pt-1">
            <div className="flex items-baseline">
              <span className="text-xl font-bold mr-2">Total:</span>
              <span className="text-2xl font-bold">{data.completed}</span>
              <span className="text-blue-300 text-xl">/{data.totalTasks}</span>
            </div>
          </div>

          <div className="">
            {priorities.map((priority) => (
              <div key={priority.label} className="flex justify-between items-center gap-3">
                <span className="text-sm font-thin text-white">{priority.label}</span>
                <div>
                  <span className="text-lg font-bold">{priority.count}</span>
                  <span className="text-[#83CFFF] text-sm">/{priority.total}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
/* eslint-disable react/prop-types */
import './dashboard.css';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import TaskCompletionChart from './M_Chart';

const data = [
  { name: 'Category A', value: 35 },
  { name: 'Category B', value: 45 },
  { name: 'Category C', value: 20 }
];

const COLORS = ['#99a4c4', '#c5c9d5', '#6e76c1'];

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor="middle" 
      dominantBaseline="central"
      className="text-end font-medium select-none"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const PurplePieChart = () => {
  return (
    <div className=" bg-slate-300 rounded-lg shadow-lg p-5 w-full h-80 flex items-center justify-center relative select-none pointer-events-none">
      <PieChart width={400} height={320}>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          labelLine={false}
          label={CustomLabel}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend 
          layout="vertical"
          verticalAlign="bottom"
          align="right"
          wrapperStyle={{
            position: 'absolute',
            bottom: 70,
            right: 20,
            borderRadius: '8px',
            padding: '12px 16px',
            userSelect: 'none'
          }}

          iconSize={16}
          fontSize={14}
          iconType="square"
        />
      </PieChart>
    </div>
  );
};

const DashboardLayout = () => {

  return (
    <div className="dashboard-container">

      <aside className="left-sidebar">
        <div className="sidebar-content">Sidebar</div>
      </aside>

      <main className="main-content">
        <div className="search-bar">SearchBar Component</div>
          <PurplePieChart />
          <TaskCompletionChart
            date={''}
          />
      </main>

      <aside className="right-sidebar">
        <div className="user-settings">UserAndSettings Component</div>
        <div className="calendar">Calendar Component</div>
        <div className="tasks-day">TasksDay Component</div>
      </aside>
    </div>

  );


};

export default DashboardLayout;
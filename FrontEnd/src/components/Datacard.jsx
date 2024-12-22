/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

const DataCard = ({ 
  Icon, 
  total = 25,
  completed = 11, 
  title = "Les tâches en retard",
  bgIconColor
  }) => {
  var percentage = Math.round((completed / total) * 100);
  percentage = percentage || 0;

  return (

    <div className="bg-bluemain text-white p-3 rounded-2xl w-60">
    <div className="">
      <div className={`${bgIconColor} inline-block p-2 rounded-xl`}>
        <Icon 
        size={30} 
        />
      </div>
    </div>
    
    <h2 className="text-lg font-normal">
      {title}
    </h2>
    
    <div className="mb-2">
      <span className="text-7xl font-bold">{completed}</span>
      <span className="text-3xl font-light text-sky-700">/{total}</span>
    </div>
    
    <p className="text-xs">
      you have completed <span className="text-accent font-medium">{percentage}%</span>
    </p>
  </div>
);
};


export default DataCard;

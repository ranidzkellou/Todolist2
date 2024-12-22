/* eslint-disable react/prop-types */
import { Bell, Loader2 } from 'lucide-react';
import { Flag } from 'lucide-react';
import { useAuth } from '../context/AuthProvider';

const NotificationGroup = ({ title, notifications }) => {
  if (!notifications || notifications.length === 0) return null;
  
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-accent mb-2">{title}</h3>
      {notifications.map(notification => (
        <div
          key={notification.id}
          className="bg-white shadow-sm rounded-lg p-4 mb-2"
        >
          <div className="flex items-center gap-2">
            <span>{notification.emoji}</span>
            <p className="text-sm text-gray-600">{notification.title}</p>
          </div>
          <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-gray-500">
            Due: {(() => {
              const date = new Date(notification.deadline);
              date.setHours(date.getHours() - 1);
              return date.toLocaleString('en-US', {
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              }).replace('/', '-').replace('/', '-').replace(',', ' at');
            })()}
          </p>
          <span className={`inline-flex items-center px-2 py-1 rounded-full ${
  notification.priority === 'High' ? '' :
  notification.priority === 'Medium' ? '' :
  ''
}`}>
  <Flag strokeWidth={3} className={`w-4 h-4 ${
    notification.priority === 'High' ? 'text-red-600' :
    notification.priority === 'Medium' ? 'text-amber-400' :
    'text-green-600'
  }`} />
</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const Notification = () => {
  const { notifications, loading } = useAuth();

  return (
    <div 
    className="
    bg-background rounded-xl p-4 w-full h-full ">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          
          <div className='flex flex-col'>
            <div className='flex gap-1'>
              <Bell className="text-bluemain" />
              <h2 className="text-lg text-accent font-bold">Notifications</h2>              
            </div>
            <p className='text-xs font-light text-gray-500'>Please scroll to see more notifications</p>            
          </div>

          {notifications?.totalCount > 0 && (
            <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
              {notifications.totalCount}
            </span>
          )}
        </div>
        {loading && <Loader2 className="w-4 h-4 animate-spin text-bluemain" />}
      </div>

      <div className="space-y-4">
        {!notifications || (Object.values(notifications?.notifications || {}).every(arr => arr.length === 0)) ? (
          <div className="text-center text-gray-500 py-2">
            No notifications
          </div>
        ) : (
          <div className=' h-52 overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 overflow-y-scroll
'>
            <NotificationGroup title="Today" notifications={notifications?.notifications?.today} />
            <NotificationGroup title="Tomorrow" notifications={notifications?.notifications?.tomorrow} />
            <NotificationGroup title="Upcoming" notifications={notifications?.notifications?.upcoming} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;
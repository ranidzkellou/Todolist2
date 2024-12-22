/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import MaincontentDash from "../components/MaincontentDash";
import Notification from '../components/Message';
import axios from 'axios';

import { useAuth } from '../context/AuthProvider';


function Dashboard() {
  const [monthData, setMonthData] = useState([]);
  const [todayData, setTodayData] = useState([]);
  const [statsData, setStatsData] = useState([]);
  const [loading, setLoading] = useState(true);


  console.log("todayData", todayData);
  console.log("this mouths tasks",monthData)

  useEffect(() => {

    const fetchTodayData = async () => { 
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/dashboard/today', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTodayData(response.data);
        return response.data;
      } catch (error) {
        console.error('Error fetching today\'s data:', error);
        throw error;
      }
    };

    const fetchData = async () => {
      console.log("fetching data dashboard");
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [monthResponse, statsResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/dashboard/month', config),
          axios.get('http://localhost:5000/api/dashboard/', config),
        ])


        console.log("monthResponse", monthResponse.data);
        console

        setMonthData(monthResponse.data);
        setStatsData(statsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    fetchTodayData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex gap-3 self-start flex-row h-full w-full grow-0 mt-3 overflow-hidden">
      <MaincontentDash 
        todayData={todayData}
        monthData={monthData}
        statsData={statsData}
      />
      <div className="h-max w-[20%] space-y-3">
        <Notification />          
      </div>
    </div>
  );
}

export default Dashboard;

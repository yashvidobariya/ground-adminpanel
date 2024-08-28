import React, { useEffect, useState } from 'react'
import Sidebar from '../Component/Sidebar'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Revenuegrowth, Totalrevenue } from '../service/APIrouter';
import { startOfWeek, format } from 'date-fns';
import { GlobalApi } from '../service/GlobalApi';

const Financial = () => {
    const [errormessage, seterrormessage] = useState("");
    const [revenuegrowth, setrevenuegrowth] = useState(null);
    const [totalrevenue, settotalrevenue] = useState(null);
    const [interval, setInterval] = useState('day');
    const [loading, setloading] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await GlobalApi(totalrevenue, 'POST', null, token);

                if (response.status === 200) {
                    settotalrevenue(response.data);
                    console.log("totalrevenue", response.data);
                } else if (response.status === 401) {
                    seterrormessage("Authentication error. Please login as an Admin.");
                    localStorage.removeItem('token');
                    localStorage.removeItem('userdata');
                } else if (response.status === 500) {
                    seterrormessage("internet server down");
                }
            } catch (error) {
                console.error('Error:', error);
                seterrormessage("An error occurred while fetching data.");
            } finally {
                setloading(false);
            }
        };
        fetchData();
    }, []);



    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await GlobalApi(Revenuegrowth, 'POST', null, token);

                if (response.status === 200) {
                    setrevenuegrowth(response.data.dailyGrowth);
                    console.log("Revenuegrowth", response.data.dailyGrowth);
                } else if (response.status === 401) {
                    seterrormessage("Authentication error. Please login as an Admin.");
                    localStorage.removeItem('token');
                    localStorage.removeItem('userdata');
                } else if (response.status === 500) {
                    seterrormessage("internet server down");
                }
            } catch (error) {
                console.error('Error:', error);
                seterrormessage("An error occurred while fetching data.");
            } finally {
                setloading(false);
            }
        };
        fetchData();
    }, []);



    const processUserData = (data, key) => {
        if (!Array.isArray(data)) {
            console.error("Data is not an array:", data);
            return {};
        }

        const intervals = {
            day: {},
            week: {},
            month: {},
            year: {}
        };

        data.forEach((item) => {
            const date = new Date(item.createdat || item.date);
            const dayKey = format(date, 'dd MMM yyyy');
            const weekKey = format(getStartOfWeek(date), 'dd MMM yyyy');
            const monthKey = format(date, 'MMM yyyy');
            const yearKey = format(date, 'yyyy');

            intervals.day[dayKey] = (intervals.day[dayKey] || 0) + (item.active || 1);
            intervals.week[weekKey] = (intervals.week[weekKey] || 0) + (item.active || 1);
            intervals.month[monthKey] = (intervals.month[monthKey] || 0) + (item.active || 1);
            intervals.year[yearKey] = (intervals.year[yearKey] || 0) + (item.active || 1);
        });
        return intervals[key];
    };



    const getStartOfWeek = (date) => {
        return startOfWeek(date, { weekStartsOn: 1 });
    };

    const handleIntervalChange = (interval) => {
        setInterval(interval);
    };
    const revenuegrowthchart = revenuegrowth && Array.isArray(revenuegrowth) ? processUserData(revenuegrowth, interval) : {};
    const totalrevenuechart = totalrevenue && Array.isArray(totalrevenue) ? processUserData(totalrevenue, interval) : {};
    return (
        <div>
            <Sidebar />
            <div className="home-chart-controls">
                <div className="home-chart-button">
                    <button onClick={() => handleIntervalChange('day')} className={interval === 'day' ? 'active' : ''}>Day</button>
                    <button onClick={() => handleIntervalChange('week')} className={interval === 'week' ? 'active' : ''}>Week</button>
                    <button onClick={() => handleIntervalChange('month')} className={interval === 'month' ? 'active' : ''}>Month</button>
                    <button onClick={() => handleIntervalChange('year')} className={interval === 'year' ? 'active' : ''}>Year</button>
                </div>
            </div>
            <div className="finacial-div">
                <div className="home-chart">
                    <div className="home-chart-user">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={Object.keys(totalrevenuechart).map(key => ({ interval: key, totalrevenue: totalrevenuechart[key] }))}>
                                <CartesianGrid strokeDasharray="2 2" />
                                <XAxis dataKey="interval" padding={{ left: 0, right: 0 }} />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="totalrevenue" fill="#F26835" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="home-chart-pie">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={Object.keys(revenuegrowthchart).map(key => ({ interval: key, RevenueGrowth: revenuegrowthchart[key] }))}>
                                <CartesianGrid strokeDasharray="2 2" />
                                <XAxis dataKey="interval" padding={{ left: 0, right: 0 }} />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="RevenueGrowth" fill="#F26835" radius={[10, 10, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Financial

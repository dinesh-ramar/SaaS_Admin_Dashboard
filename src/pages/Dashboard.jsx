import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
    Users,
    DollarSign,
    ShoppingBag,
    Activity,
    TrendingUp,
    TrendingDown
} from 'lucide-react';
import Card from '../components/common/Card';
import { dashboardData } from '../data/dashboard';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';

const KPICard = ({ label, value, change, trend, icon: Icon }) => (
    <Card className="flex flex-col">
        <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Icon size={20} />
            </div>
            <div className={`flex items-center text-sm font-medium ${trend === 'up' ? 'text-success' : 'text-error'
                }`}>
                {trend === 'up' ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                {change}
            </div>
        </div>
        <div>
            <p className="text-sm font-medium text-textMuted">{label}</p>
            <div className="text-2xl font-bold font-heading text-textPrimary mt-1" role="text">{value}</div>
        </div>
    </Card>
);

KPICard.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    change: PropTypes.string.isRequired,
    trend: PropTypes.oneOf(['up', 'down']).isRequired,
    icon: PropTypes.elementType.isRequired,
};

const Dashboard = () => {
    const icons = [Users, DollarSign, ShoppingBag, Activity];

    // Memoize chart data to prevent unnecessary re-renders
    const chartData = useMemo(() => dashboardData.revenueGrowth, []);

    // Memoize tooltip styles to prevent object recreation on each render
    const tooltipStyle = useMemo(() => ({
        backgroundColor: 'rgb(var(--color-card))',
        borderColor: 'rgb(var(--color-border))',
        borderRadius: '8px',
        color: 'rgb(var(--color-text-primary))'
    }), []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold font-heading text-textPrimary">Dashboard Overview</h1>
                <div className="text-sm text-textMuted">
                    Last updated: {new Date().toLocaleDateString()}
                </div>
            </div>

            {/* KPI Section */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {dashboardData.kpis.map((kpi, index) => (
                    <KPICard
                        key={kpi.label}
                        {...kpi}
                        icon={icons[index]}
                    />
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Revenue Growth">
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%" debounce={50}>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0F766E" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#0F766E" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgb(var(--color-border))" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'currentColor', fontSize: 12 }}
                                    className="text-textMuted"
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'currentColor', fontSize: 12 }}
                                    className="text-textMuted"
                                />
                                <Tooltip
                                    contentStyle={tooltipStyle}
                                    itemStyle={{ color: '#0F766E' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#0F766E"
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                    strokeWidth={2}
                                    isAnimationActive={false}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="User Acquisitions">
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%" debounce={50}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgb(var(--color-border))" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'currentColor', fontSize: 12 }}
                                    className="text-textMuted"
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'currentColor', fontSize: 12 }}
                                    className="text-textMuted"
                                />
                                <Tooltip
                                    cursor={{ fill: 'currentColor', opacity: 0.1 }}
                                    contentStyle={tooltipStyle}
                                />
                                <Bar
                                    dataKey="users"
                                    fill="#0F766E"
                                    radius={[4, 4, 0, 0]}
                                    barSize={30}
                                    isAnimationActive={false}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;

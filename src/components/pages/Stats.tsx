import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, TooltipProps } from "recharts";
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { Flag, Globe, Medal } from "lucide-react";
import { fetchStatsData, Country, Event } from "../../services/fetchStatsData";

const Stats = () => {
  const [data, setData] = useState<{ countries: Country[]; events: Event[] }>({ countries: [], events: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStatsData()
      .then((fetchedData) => {
        setData(fetchedData);
        setIsLoading(false);
      })
      .catch(console.error);
  }, []);

  const { topCountries, continentMedals, medalDistribution } = useMemo(() => {
    const topCountries = data.countries.sort((a, b) => b.total_medals - a.total_medals).slice(0, 5);
    const continentMedals = data.countries.reduce((acc, country) => {
      if (country.continent && country.total_medals > 0) {
        acc[country.continent] = (acc[country.continent] || 0) + country.total_medals;
      }
      return acc;
    }, {} as Record<string, number>);
    const medalDistribution = data.countries.reduce((acc, country) => {
      acc.gold += country.gold_medals;
      acc.silver += country.silver_medals;
      acc.bronze += country.bronze_medals;
      return acc;
    }, { gold: 0, silver: 0, bronze: 0 });

    return { topCountries, continentMedals, medalDistribution };
  }, [data.countries]);

  const COLORS = ["#FFD700", "#C0C0C0", "#CD7F32"];

  const ChartCard = ({ title, icon, children, className = "" }: { title: string; icon: React.ReactNode; children: React.ReactNode; className?: string }) => (
    <motion.div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
      <div className="bg-gray-900 p-4">
        <div className="flex items-center text-white">
          {icon}
          <h2 className="text-xl font-bold ml-2">{title}</h2>
        </div>
      </div>
      <div className="p-4">{children}</div>
    </motion.div>
  );

  const formatContinent = (continent: string) => {
    const continentMap: { [key: string]: string } = {
      AME: "Americas",
      ASI: "Asia",
      EUR: "Europe",
      OCE: "Oceania",
      AFR: "Africa",
    };
    return continentMap[continent] || continent;
  };

  const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow">
          <p className="font-bold">{formatContinent(label as string)}</p>
          <p>Medals: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <main className="container mx-auto py-16 px-4">
        <motion.h1 className="text-4xl font-extrabold mb-16 text-center text-gray-800" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          Paris 2024 Olympics Stats
        </motion.h1>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ChartCard title="Medals by Continent" icon={<Globe size={24} />}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={Object.entries(continentMedals).map(([key, value]) => ({ name: key, medals: value }))} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tickFormatter={formatContinent} />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="medals" fill="#6366F1" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard title="Medal Distribution by Type" icon={<Medal size={24} />}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.entries(medalDistribution).map(([key, value]) => ({ name: key, value }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {Object.entries(medalDistribution).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard title="Top 5 Countries" icon={<Flag size={24} />} className="md:col-span-2">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={topCountries} layout="vertical" margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis
                    dataKey="id"
                    type="category"
                    width={50}
                    tick={(props) => {
                      const { x, y, payload } = props;
                      return (
                        <svg x={x - 24} y={y - 12} width="24" height="24">
                          <image href={`https://codante.s3.amazonaws.com/codante-apis/olympic-games/flags/${payload.value}.png`} width="24" height="24" />
                        </svg>
                      );
                    }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="gold_medals" stackId="a" fill="#FFD700" name="Gold" />
                  <Bar dataKey="silver_medals" stackId="a" fill="#C0C0C0" name="Silver" />
                  <Bar dataKey="bronze_medals" stackId="a" fill="#CD7F32" name="Bronze" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        )}
      </main>
    </motion.div>
  );
};

export default Stats;
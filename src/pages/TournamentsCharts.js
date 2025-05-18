import React, { useContext, useEffect, useState } from "react";
import { TournamentContext } from "../context/TournamentContext.js";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF", "#FF6384"];

export default function TournamentCharts() {
    const { tournaments } = useContext(TournamentContext);
    const [chartData, setChartData] = useState({
        tournamentsPerYear: [],
        prizeMoneyDistribution: [],
        favoritePlayers: []
    });
    const { latestTournament } = useContext(TournamentContext);


    useEffect(() => {
        const processChartData = () => {
            // Tournaments Per Year (Pie Chart)
            const yearCounts = tournaments.reduce((acc, tournament) => {
                const year = new Date(tournament.date).getFullYear();
                acc[year] = (acc[year] || 0) + 1;
                return acc;
            }, {});
            const tournamentsPerYear = Object.entries(yearCounts).map(([year, count]) => ({ name: year, value: count }));

            // Prize Money Distribution (Pie Chart)
            const prizeMoneyDistribution = tournaments.map(tournament => ({
                name: tournament.name,
                value: parseFloat(tournament.prize.replace(/[^0-9.]/g, "")) || 0
            }));

            // Favorite Players Popularity (Bar Chart)
            const playerCounts = tournaments.reduce((acc, tournament) => {
                acc[tournament.favoritePlayer] = (acc[tournament.favoritePlayer] || 0) + 1;
                return acc;
            }, {});
            const favoritePlayers = Object.entries(playerCounts).map(([player, count]) => ({ player, count }));

            setChartData({ tournamentsPerYear, prizeMoneyDistribution, favoritePlayers });
        };

        processChartData();
    }, [tournaments]);

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "30px" }}>
            {latestTournament && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-4 shadow-md">
                     <strong>{latestTournament.name}</strong> was just added!
                    <br />
                     <strong>{latestTournament.location}</strong> |  <strong>{new Date(latestTournament.date).toLocaleDateString()}</strong> |  <strong>{latestTournament.prize}</strong>
                    <br />
                     Favorite Player: <strong>{latestTournament.favoritePlayer}</strong>
                </div>
            )}

            <h2>Tournaments Per Year</h2>
            <ResponsiveContainer width={400} height={400}>
                <PieChart>
                    <Pie data={chartData.tournamentsPerYear} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={150} fill="#8884d8" label>
                        {chartData.tournamentsPerYear.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>

            <h2>Prize Money Distribution</h2>
            <ResponsiveContainer width={400} height={400}>
                <PieChart>
                    <Pie data={chartData.prizeMoneyDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={150} fill="#82ca9d" label>
                        {chartData.prizeMoneyDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>

            <h2>Favorite Players Popularity</h2>
            <ResponsiveContainer width={500} height={400}>
                <BarChart data={chartData.favoritePlayers} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="player" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#ff7300" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

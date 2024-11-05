"use client";
import { useState, useEffect } from "react";

// Sample data for leaderboard
const initialLeaderboardData = [
  { username: "User1", totalWorkouts: 20, caloriesBurned: 5000 },
  { username: "User2", totalWorkouts: 15, caloriesBurned: 4500 },
  { username: "User3", totalWorkouts: 18, caloriesBurned: 3000 },
  // More users...
];

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState(
    initialLeaderboardData
  );
  const [selectedMetric, setSelectedMetric] = useState<
    "totalWorkouts" | "caloriesBurned"
  >("totalWorkouts");

  useEffect(() => {
    const updateLeaderboard = () => {
      const updatedData = [...leaderboardData].sort((a, b) => {
        return b[selectedMetric] - a[selectedMetric];
      });
      setLeaderboardData(updatedData);
    };

    const interval = setInterval(updateLeaderboard, 5000);
    return () => clearInterval(interval);
  }, [selectedMetric, leaderboardData]);

  return (
    <section className="mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Leaderboard</h2>

      {/* Metric Selection */}
      <div className="mb-4">
        <label className="mr-2">Select Metric:</label>
        <select
          value={selectedMetric}
          onChange={(e) =>
            setSelectedMetric(
              e.target.value as "totalWorkouts" | "caloriesBurned"
            )
          }
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="totalWorkouts">Total Workouts</option>
          <option value="caloriesBurned">Calories Burned</option>
          {/* Additional metrics can be added here */}
        </select>
      </div>

      {/* Leaderboard Table */}
      <table className="min-w-full bg-white border border-gray-300 rounded-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border">Rank</th>
            <th className="py-2 px-4 border">Username</th>
            <th className="py-2 px-4 border">Total Workouts</th>
            <th className="py-2 px-4 border">Calories Burned</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((user, index) => (
            <tr key={user.username} className="text-center">
              <td className="py-2 border">{index + 1}</td>
              <td className="py-2 border">{user.username}</td>
              <td className="py-2 border">{user.totalWorkouts}</td>
              <td className="py-2 border">{user.caloriesBurned}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

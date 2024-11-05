"use client";
import { useState, useEffect } from "react";
import {
  createChart,
  DeepPartial,
  IChartApi,
  ISeriesApi,
  LineData,
  LineSeriesOptions,
  LineStyleOptions,
  SeriesOptionsCommon,
  Time,
  WhitespaceData,
} from "lightweight-charts";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import Leaderboard from "@/components/leaderboard";
import ChallengeFeature from "@/components/challengeFeature";

type Profile = {
  age: number | "";
  weight: number | "";
  height: number | "";
  goals: string;
};

type Workout = {
  type: string;
  duration: number;
  calories: number;
};

type Goal = {
  id: number;
  name: string;
  target: number;
  progress: number;
};

export default function FitnessApp() {
  const [profile, setProfile] = useState<Profile>({
    age: "",
    weight: "",
    height: "",
    goals: "Run 10 miles",
  });
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [notifications] = useState<string[]>(["Reminder: Log your workout!"]);
  const [selectedTab, setSelectedTab] = useState("daily");
  const [showSummary, setShowSummary] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const displaySummary = () => {
    setShowSummary(true);
  };

  const confirmShare = () => {
    setShowShareOptions(true); // Show social media share options
  };

  const handleShareSuccess = () => {
    setShareSuccess(true);
    setTimeout(() => {
      setShowShareOptions(false);
      setShareSuccess(false);
    }, 2000); // Automatically close after 2 seconds
  };

  const [goals, setGoals] = useState<Goal[]>([
    { id: 1, name: "Run 10 miles", target: 10, progress: 0 },
  ]);
  const [chart, setChart] = useState<IChartApi | null>(null);
  const [series, setSeries] = useState<ISeriesApi<
    "Line",
    Time,
    LineData<Time> | WhitespaceData<Time>,
    LineSeriesOptions,
    DeepPartial<LineStyleOptions & SeriesOptionsCommon>
  > | null>(null);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const initialData = [
    { time: "2023-01-03", value: 6 },
    { time: "2023-01-04", value: 8 },
    { time: "2023-01-05", value: 5 },
    { time: "2023-01-06", value: 7 },
    { time: "2023-01-07", value: 6 },
    { time: "2023-01-08", value: 9 },
    { time: "2023-01-09", value: 4 },
    { time: "2023-01-10", value: 7 },
    { time: "2023-01-11", value: 6 },
    { time: "2023-01-12", value: 8 },
    { time: "2023-01-13", value: 5 },
    { time: "2023-01-14", value: 9 },
    { time: "2023-01-15", value: 7 },
    { time: "2023-01-16", value: 6 },
    { time: "2023-01-17", value: 8 },
  ];

  useEffect(() => {
    const savedProfile = localStorage.getItem("profile");
    const savedWorkouts = localStorage.getItem("workouts");
    const savedGoals = localStorage.getItem("goals");

    if (savedProfile) setProfile(JSON.parse(savedProfile));
    if (savedWorkouts) setWorkouts(JSON.parse(savedWorkouts));
    if (savedGoals) setGoals(JSON.parse(savedGoals));

    if (!chart) {
      const chartElement = document.getElementById("workout-chart");
      if (chartElement) {
        const newChart = createChart(chartElement, { width: 600, height: 300 });
        const newSeries = newChart.addLineSeries();

        newSeries.setData(initialData);

        setChart(newChart);
        setSeries(newSeries);
      }
    }
  }, [chart]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (profile) localStorage.setItem("profile", JSON.stringify(profile));
      localStorage.setItem("workouts", JSON.stringify(workouts));
      localStorage.setItem("goals", JSON.stringify(goals));
    }
  }, [profile, workouts, goals]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: name === "goals" ? value : value === "" ? "" : Number(value),
    }));
  };

  const saveProfile = () => {
    if (profile) {
      localStorage.setItem("profile", JSON.stringify(profile));
      alert("Profile saved!");
      setIsEditingProfile(false);
    }
  };

  const handleWorkoutSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const workout = {
      type: formData.get("type") as string,
      duration: Number(formData.get("duration")),
      calories: Number(formData.get("calories")),
    };

    setWorkouts((prev) => {
      const updatedWorkouts = [...prev, workout];
      if (series) {
        const newTime = new Date().toISOString().slice(0, 10);
        series.update({ time: newTime, value: workout.duration });
      }
      return updatedWorkouts;
    });
    e.currentTarget.reset();
  };

  const addGoalProgress = (id: number) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === id ? { ...goal, progress: goal.progress + 1 } : goal
      )
    );
  };

  return (
    <div className="container mx-auto p-6 font-sans text-gray-800 max-w-xl">
      {/* Floating Navbar */}
      <nav className="fixed top-0 left-0 w-full flex justify-between items-center py-4 px-6 bg-white rounded-b-lg shadow-md transition-all duration-200 ease-in-out hover:shadow-lg z-50">
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
          Fitness App
        </h1>
        <div className="flex space-x-6">
          <a
            href="#profile"
            className="text-[#007AFF] font-medium hover:underline transition-all duration-200 ease-in-out hover:text-blue-600"
          >
            Profile
          </a>
          <a
            href="#workouts"
            className="text-[#007AFF] font-medium hover:underline transition-all duration-200 ease-in-out hover:text-blue-600"
          >
            Workouts
          </a>
          <a
            href="#historical"
            className="text-[#007AFF] font-medium hover:underline transition-all duration-200 ease-in-out hover:text-blue-600"
          >
            History
          </a>
          <a
            href="#goals"
            className="text-[#007AFF] font-medium hover:underline transition-all duration-200 ease-in-out hover:text-blue-600"
          >
            Goals
          </a>
        </div>
      </nav>
      <div className="container mx-auto font-sans text-gray-800 max-w-xl mt-20"></div>
      {/* Notifications */}
      <div className="mb-8 p-6 bg-white rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Notifications
        </h2>
        <ul className="list-disc pl-8 space-y-2">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <li key={index} className="text-gray-700 leading-relaxed">
                {notification}
              </li>
            ))
          ) : (
            <li className="text-gray-500">No new notifications.</li>
          )}
        </ul>
      </div>

      {/* Profile Section */}
      <section
        id="profile"
        className="mb-6 p-6 bg-white rounded-2xl shadow-lg transition-all duration-200 ease-in-out hover:shadow-xl"
      >
        <h2 className="text-2xl font-semibold text-gray-900 mb-5">
          {profile && !isEditingProfile
            ? "Your Profile"
            : "Create Your Profile"}
        </h2>

        {profile && !isEditingProfile ? (
          <div className="flex items-center space-x-6">
            {/* Profile Photo */}
            <img
              src="https://via.placeholder.com/100"
              alt="Profile"
              className="w-24 h-24 rounded-full border-2 border-gray-200 shadow-sm"
            />
            <div className="text-gray-700 space-y-1">
              <p>
                <span className="font-medium">Age:</span> {profile.age}
              </p>
              <p>
                <span className="font-medium">Weight:</span> {profile.weight} kg
              </p>
              <p>
                <span className="font-medium">Height:</span> {profile.height} cm
              </p>
              <p>
                <span className="font-medium">Goals:</span> {profile.goals}
              </p>
            </div>
            <button
              onClick={() => setIsEditingProfile(true)}
              className="bg-[#007AFF] text-white px-5 py-2 rounded-full font-medium shadow-md hover:bg-blue-600 transition duration-150 ease-in-out"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form className="space-y-4">
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={profile?.age || ""}
              onChange={handleProfileChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            />
            <input
              type="number"
              name="weight"
              placeholder="Weight (kg)"
              value={profile?.weight || ""}
              onChange={handleProfileChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            />
            <input
              type="number"
              name="height"
              placeholder="Height (cm)"
              value={profile?.height || ""}
              onChange={handleProfileChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            />
            <input
              type="text"
              name="goals"
              placeholder="Fitness Goals"
              value={profile?.goals || ""}
              onChange={handleProfileChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            />
            <button
              type="button"
              onClick={saveProfile}
              className="w-full bg-[#007AFF] text-white py-3 rounded-full font-semibold shadow-md hover:bg-blue-600 transition duration-150 ease-in-out"
            >
              {profile && isEditingProfile ? "Update Profile" : "Save Profile"}
            </button>
          </form>
        )}
      </section>

      {/* Workout Logging Section */}
      <section
        id="workouts"
        className="mb-8 p-6 bg-white rounded-2xl shadow-md transition-all duration-200 ease-in-out hover:shadow-lg"
      >
        <h2 className="text-2xl font-semibold text-gray-900 mb-5">
          Log Daily Workout
        </h2>
        <form onSubmit={handleWorkoutSubmit} className="space-y-4">
          <input
            type="text"
            name="type"
            placeholder="Type of Exercise"
            required
            className="w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          />
          <input
            type="number"
            name="duration"
            placeholder="Duration (min)"
            required
            className="w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          />
          <input
            type="number"
            name="calories"
            placeholder="Calories Burned"
            required
            className="w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          />
          <button
            type="submit"
            className="w-full p-3 bg-[#007AFF] text-white rounded-full font-semibold shadow-md hover:bg-blue-600 transition duration-150 ease-in-out"
          >
            Add Workout
          </button>
        </form>

        {/* Display list of logged workouts */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Workout History
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            {workouts.length > 0 ? (
              workouts.map((workout, index) => (
                <li key={index} className="text-gray-700">
                  <span className="font-medium">{workout.type}</span>:{" "}
                  {workout.duration} mins, {workout.calories} kcal
                </li>
              ))
            ) : (
              <li className="text-gray-500">No workouts logged yet.</li>
            )}
          </ul>
        </div>
      </section>

      {/* Historical Data Visualization */}
      <section
        id="historical"
        className="mb-8 p-6 bg-white rounded-2xl shadow-lg transition-all duration-200 ease-in-out hover:shadow-xl"
      >
        <h2 className="text-2xl font-semibold text-gray-900 mb-5">
          Historical Workout Data
        </h2>
        {/* Tabs for Daily, Weekly, Monthly */}
        <div className="flex justify-center space-x-4 mb-4">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none"
            onClick={() => setSelectedTab("daily")}
          >
            Daily
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none"
            onClick={() => setSelectedTab("weekly")}
          >
            Weekly
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none"
            onClick={() => setSelectedTab("monthly")}
          >
            Monthly
          </button>
        </div>

        {/* Chart container */}
        <div
          id="workout-chart"
          className="bg-gray-100 rounded-lg shadow-inner w-full h-64 max-h-80 overflow-x-auto"
          style={{ maxWidth: "100%" }}
        >
          {selectedTab === "daily" && (
            <div>
              {" "}
              {/* Placeholder for daily chart */} Daily workout chart goes here.{" "}
            </div>
          )}
          {selectedTab === "weekly" && (
            <div>
              {" "}
              {/* Placeholder for weekly chart */} Weekly workout chart goes
              here.{" "}
            </div>
          )}
          {selectedTab === "monthly" && (
            <div>
              {" "}
              {/* Placeholder for monthly chart */} Monthly workout chart goes
              here.{" "}
            </div>
          )}
        </div>
      </section>

      {/* Weekly Goal Tracking */}
      <section id="goals" className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-medium mb-4">Weekly Goals</h2>

        {/* Form to add a new goal */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const newGoal = {
              id: goals.length + 1,
              name: formData.get("name") as string,
              target: Number(formData.get("target")),
              progress: 0,
            };
            setGoals((prev) => [...prev, newGoal]);
            e.currentTarget.reset();
          }}
          className="space-y-4"
        >
          <input
            type="text"
            name="name"
            placeholder="Goal Name"
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <input
            type="number"
            name="target"
            placeholder="Target (e.g., 10)"
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded-md font-semibold"
          >
            Add Goal
          </button>
        </form>

        {/* Display list of goals with progress */}
        <div className="mt-4">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="flex justify-between items-center mb-4"
            >
              <div>
                <h3 className="font-semibold">{goal.name}</h3>
                <p>
                  Progress: {goal.progress}/{goal.target}
                </p>
              </div>
              <button
                onClick={() => addGoalProgress(goal.id)}
                disabled={goal.progress >= goal.target}
                className={`px-2 py-1 rounded-md ${
                  goal.progress >= goal.target
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-green-500 text-white"
                }`}
              >
                {goal.progress >= goal.target ? "Finished" : "+1 Progress"}
              </button>
            </div>
          ))}
        </div>
      </section>
      {/* Exercise Suggestions Section */}
      <section
        id="suggestions"
        className="p-6 bg-white rounded-2xl shadow-lg mb-8 transition-all duration-200 ease-in-out hover:shadow-xl mt-6"
      >
        <h2 className="text-2xl font-semibold text-gray-900 mb-5">
          Personalized Exercise Suggestions
        </h2>
        <div className="space-y-5">
          {/* Mock suggestion based on a goal */}
          <div className="p-5 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
            <h3 className="font-semibold text-lg text-gray-800 mb-2">
              Suggestion for Goal: Run 10 miles
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Start with a 2-mile jog every morning to build endurance.
            </p>
          </div>
          <div className="p-5 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
            <h3 className="font-semibold text-lg text-gray-800 mb-2">
              Suggestion for Goal: Build Upper Body Strength
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Incorporate push-ups and pull-ups into your routine 3 times a
              week.
            </p>
          </div>
          <div className="p-5 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
            <h3 className="font-semibold text-lg text-gray-800 mb-2">
              Suggestion for Goal: Improve Flexibility
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Try a daily 10-minute stretching session targeting hamstrings and
              shoulders.
            </p>
          </div>
        </div>
      </section>

      {/* Share Workout Summary Section */}
      <section
        id="share-summary"
        className="mt-8 p-6 bg-white rounded-2xl shadow-lg transition-all duration-200 ease-in-out hover:shadow-xl"
      >
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Share Your Workout Summary
        </h2>
        <p className="text-gray-600 mb-4">
          Review your progress before sharing!
        </p>
        <button
          onClick={displaySummary}
          className="w-full py-3 bg-[#007AFF] text-white rounded-full font-semibold shadow-md hover:bg-blue-600 transition duration-150 ease-in-out"
        >
          Show Summary
        </button>
      </section>

      {/* Workout Summary Component */}
      {showSummary && (
        <section
          id="workout-summary"
          className="mt-6 p-6 bg-gray-50 rounded-2xl shadow-lg transition-all duration-200 ease-in-out"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-5">
            Your Workout Summary
          </h2>
          <div className="space-y-5">
            {/* Overall Progress */}
            <div className="p-5 border border-gray-200 rounded-lg shadow-sm bg-white">
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                Overall Progress
              </h3>
              <p className="text-gray-600">Total Workouts: 15</p>
              <p className="text-gray-600">Calories Burned: 3,500 kcal</p>
              <p className="text-gray-600">Goals Achieved: 2/3</p>
            </div>

            {/* Workout History */}
            <div className="p-5 border border-gray-200 rounded-lg shadow-sm bg-white">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Workout History
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Running: 30 mins, 300 kcal</li>
                <li>Yoga: 45 mins, 200 kcal</li>
                <li>Strength Training: 60 mins, 500 kcal</li>
              </ul>
            </div>

            {/* Confirm Share Button */}
            <button
              onClick={confirmShare}
              className="w-full py-3 bg-green-500 text-white rounded-full font-semibold shadow-md hover:bg-green-600 transition duration-150 ease-in-out"
            >
              Confirm Share
            </button>
          </div>
        </section>
      )}

      {/* Share Options Popup */}
      {showShareOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center max-w-xs transition-all duration-200 ease-in-out">
            {shareSuccess ? (
              <div>
                <h2 className="text-lg font-semibold text-green-600">
                  Share Success!
                </h2>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-gray-900 mb-5">
                  Share on Social Media
                </h2>
                <div className="flex justify-around space-x-6">
                  <button
                    className="text-blue-600"
                    onClick={handleShareSuccess}
                  >
                    <FaFacebook size={30} />
                    <p className="text-sm mt-2">Facebook</p>
                  </button>
                  <button
                    className="text-pink-500"
                    onClick={handleShareSuccess}
                  >
                    <FaInstagram size={30} />
                    <p className="text-sm mt-2">Instagram</p>
                  </button>
                  <button
                    className="text-blue-400"
                    onClick={handleShareSuccess}
                  >
                    <FaTwitter size={30} />
                    <p className="text-sm mt-2">X</p>
                  </button>
                </div>
                <button
                  onClick={() => setShowShareOptions(false)}
                  className="mt-6 px-6 py-2 bg-gray-500 text-white rounded-full font-medium hover:bg-gray-600 transition duration-150 ease-in-out"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
      <Leaderboard />
      <ChallengeFeature />
    </div>
  );
}

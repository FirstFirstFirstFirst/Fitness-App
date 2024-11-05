"use client";
import { useState } from "react";

export default function ChallengeFeature() {
  // Initialize with mock challenges
  const [challenges, setChallenges] = useState([
    { text: "Run 5 kilometers", accepted: false },
    { text: "Complete 50 push-ups", accepted: true },
    { text: "Drink 2 liters of water daily", accepted: false },
    { text: "Meditate for 10 minutes", accepted: true },
  ]);

  const [newChallenge, setNewChallenge] = useState(""); // New challenge input

  const handleCreateChallenge = () => {
    if (newChallenge.trim()) {
      // Add the new challenge to the list
      setChallenges((prevChallenges) => [
        ...prevChallenges,
        { text: newChallenge, accepted: false },
      ]);
      setNewChallenge(""); // Clear the input field
    }
  };

  const handleAcceptChallenge = (index: number) => {
    const updatedChallenges = [...challenges];
    updatedChallenges[index].accepted = true; // Mark the challenge as accepted
    setChallenges(updatedChallenges);
  };

  return (
    <section className="mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Fitness Challenges</h2>

      {/* Input for new challenge */}
      <div className="mb-4">
        <input
          type="text"
          value={newChallenge}
          onChange={(e) => setNewChallenge(e.target.value)}
          placeholder="Enter a new challenge"
          className="p-2 border border-gray-300 rounded-md w-full"
        />
        <button
          onClick={handleCreateChallenge}
          className="mt-2 p-2 bg-blue-500 text-white rounded-md"
        >
          Create Challenge
        </button>
      </div>

      {/* List of challenges */}
      <h3 className="text-lg font-semibold mb-2">Active Challenges</h3>
      <ul className="list-disc pl-5">
        {challenges.length === 0 ? (
          <li>No active challenges.</li>
        ) : (
          challenges.map((challenge, index) => (
            <li
              key={index}
              className={`flex justify-between items-center ${
                challenge.accepted ? "text-gray-500 line-through" : ""
              }`}
            >
              <span>{challenge.text}</span>
              {!challenge.accepted && (
                <button
                  onClick={() => handleAcceptChallenge(index)}
                  className="ml-4 p-1 bg-green-500 text-white rounded-md"
                >
                  Accept
                </button>
              )}
              {challenge.accepted && (
                <span className="ml-4 text-green-600">Accepted</span>
              )}
            </li>
          ))
        )}
      </ul>
    </section>
  );
}

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { History } from "lucide-react";

function StoryDisplay() {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStory = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(
          `http://localhost:3000/en/story-display/${id}`
        );
        setStory(response.data);
      } catch (error) {
        console.error("Error fetching story:", error.message);
        setError("Failed to load the story. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [id]);

  if (loading) return <p>Loading story...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center space-x-4 mb-8">
        <History className="h-8 w-8 text-indigo-600" />
        <h1 className="text-3xl font-bold text-gray-800">{story?.title}</h1>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{story?.genre}</h2>
        <p className="text-gray-700 whitespace-pre-line">{story?.generatedStory}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {story?.images.map((image, i) => (
            <img
              key={i}
              src={`data:image/png;base64,${image}`}
              alt={`Story Image ${i + 1}`}
              className="w-full h-64 object-cover rounded-lg"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default StoryDisplay;
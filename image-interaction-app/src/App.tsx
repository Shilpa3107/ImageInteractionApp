import { useQuery } from '@tanstack/react-query';
import { useStore } from './store/store';

// Example API call function
const fetchRandomUser = async () => {
  const response = await fetch('https://randomuser.me/api/');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

function App() {
  const { count, increment, decrement, reset } = useStore();
  
  // Example of using React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ['randomUser'],
    queryFn: fetchRandomUser,
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          React + Vite + Tailwind + Zustand + React Query
        </h1>
        
        <div className="mb-8 p-4 border border-gray-200 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Zustand Counter Example</h2>
          <div className="flex items-center space-x-4">
            <button 
              onClick={decrement}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Decrement
            </button>
            <span className="text-2xl font-bold">{count}</span>
            <button 
              onClick={increment}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Increment
            </button>
            <button 
              onClick={reset}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">React Query Example</h2>
          {isLoading ? (
            <div className="text-gray-600">Loading user data...</div>
          ) : error ? (
            <div className="text-red-500">Error loading user data</div>
          ) : (
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {data?.results[0]?.name?.first} {data?.results[0]?.name?.last}</p>
              <p><span className="font-medium">Email:</span> {data?.results[0]?.email}</p>
              <p><span className="font-medium">Location:</span> {data?.results[0]?.location?.city}, {data?.results[0]?.location?.country}</p>
            </div>
          )}
        </div>

        <div className="mt-8 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            This is a starter template with Vite, React, TypeScript, Tailwind CSS, Zustand, and React Query.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;

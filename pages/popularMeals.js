import Header from '@/components/Header';
import { useEffect, useState } from 'react';

export default function PopularMeals() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    async function fetchPopularMeals() {
      try {
        const response = await fetch('/api/popularToday');
        const data = await response.json();

        if (response.ok) {
          setMeals(data.meals);  
        } else {
          setError(data.error || 'Error fetching meals');
        }
      } catch (err) {
        setError('Error fetching meals');
        console.log(err)
      } finally {
        setLoading(false);
      }
    }

    fetchPopularMeals();
  }, []);

  
  if (loading) return <p>Loading popular meals...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Header/>
      <h1 className="text-2xl font-bold mb-4">Popular Meals for Today</h1>
      {meals.length === 0 ? (
        <p>No popular meals found for today.</p>
      ) : (
        <ul className="space-y-4">
          {meals.map((meal, index) => (
            <li key={index} className="border p-4 rounded shadow-md">
              <h2 className="text-xl font-semibold">{meal.name}</h2>
              <p>
                <strong>Prices:</strong> {meal.prices.join(', ')} Ksh
              </p>
              <p>
                <strong>Times Ordered:</strong> {meal.timesOrdered} times
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

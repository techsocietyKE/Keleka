import Layout from "@/components/Layout";
import { withAuth } from "@/utils/withAuth";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

const truncateDescription = (description, wordLimit) => {
  return description.split(" ").slice(0, wordLimit).join(" ") + (description.split(" ").length > wordLimit ? "..." : "");
};
const Meals =()=> {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    axios.get('/api/meals').then((response) => {
      console.log(response.data);
      setMeals(response.data);
    });
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Meals</h1>
          <Link href={'/meals/new'} className="bg-primary hover:shadow-lg text-white font-bold py-2 px-4 rounded">
            Add New Meal
          </Link>
        </div>

        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Image</th>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Description</th>
                <th className="py-3 px-6 text-left">Category</th>
                <th className="py-3 px-6 text-left">Price</th>
                <th className="py-3 px-6 text-left">AddedBy</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {meals.length > 0 ? (
                meals.map((meal) => (
                  <tr key={meal._id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                     
                     
                      <div className="h-24 bg-white p-1 shadow-md rounded-sm border border-gray-200">
                      <img
                      src={meal.image}
                      className="rounded-lg w-full h-full object-cover"
                      />
                      </div>
                    </td>
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      <span className="font-medium">{meal.name}</span>
                    </td>
                    <td className="py-3 px-6 text-left">
                      {truncateDescription(meal.description, 5)}
                    </td>
                    <td className="py-3 px-6 text-left">
  {meal.category && meal.category.length > 0 ? (
    <ul>
      {meal.category.map((category, index) => (
        <li key={index}> {category}</li>
      ))}
    </ul>
  ) : (
    <span>Not Speicified</span>
  )}
</td>
                    <td className="py-3 px-6 text-left">
  {meal.prices && meal.prices.length > 0 ? (
    <ul>
      {meal.prices.map((price, index) => (
        <li key={index}>Ksh {price}</li>
      ))}
    </ul>
  ) : (
    <span>No prices available</span>
  )}
</td>

                    <td className="py-3 px-6 text-left">
                     {meal.createdBy}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center gap-3">
                      <Link href={'/meals/view/' + meal._id} className="text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
  <path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clip-rule="evenodd" />
</svg>

                        </Link>
                        <Link href={'/meals/edit/' + meal._id} className="text-primary">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                            />
                          </svg>
                        </Link>
                        <Link href={'/meals/delete/' + meal._id} className="text-red-600 hover:text-red-800">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                          </svg>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    No meals found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
export default withAuth(Meals,['Staff','Admin'])

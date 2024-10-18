import MealBox from "./MenuItem";

export default function MealsGrid({ meals }) {
  return (
    <div className="px-4 md:px-8 lg:px-12 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {meals?.length > 0 &&
          meals.map((meal) => <MealBox key={meal._id} {...meal} />)}
      </div>
    </div>
  );
}

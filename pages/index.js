import Featured from "@/components/Featured";
import Header from "@/components/Header";
import { mongooseConnect } from "@/lib/mongoose";
import { Meal } from "@/models/Meal";
import { Divider } from '@chakra-ui/react';
import PopularMenu from "./popularmenu";



export default function HomePage({ featuredmeal, newMeals }) {
  return (
    <div className="bg-white">
      <Header />
      <Featured meal={featuredmeal} />
      <Divider />
      <PopularMenu/>
    </div>
  );
}

export async function getServerSideProps() {
  const featuredMealId = '671230469ec68b0507c89949';
  await mongooseConnect();

  const featuredmeal = await Meal.findById(featuredMealId);
  const newMeals = await Meal.find({}, null, { sort: { '_id': -1 }, limit: 8 });

  console.log('Featured Meal:', featuredmeal); 
    console.log('New Meals:', newMeals);


  return {
    props: {
      featuredmeal: JSON.parse(JSON.stringify(featuredmeal)),
      newMeals: JSON.parse(JSON.stringify(newMeals)),
    }
  };
}

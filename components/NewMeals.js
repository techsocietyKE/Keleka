import MealsGrid from "./MealsGrid";

export default function NewMeals({meals}){
    return(
         <div className="bg-white">
             <h1 className="text-center m-8 font-bold text-xl md:text-3xl text-gray-900">Popular meals  </h1> 
         <MealsGrid meals={meals}/>
         </div>
    )
}

import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MealForm from "@/components/MealForm";

export default function EditMealPage(){
    const [mealInfo,setMealInfo] = useState(null)
    const  router = useRouter();
    const {id} = router.query;
    useEffect(() => {
        if(!id){
            return;
        }
     axios.get('/api/meals?id=' +id).then(response=>{
        setMealInfo(response.data)
     })
      
    }, [id])
    
    return(
        <Layout>
             <h1>Edit Meal</h1>
             {mealInfo &&(
                  <MealForm {...mealInfo}/>
             )}
          
        </Layout>
    )
}
import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DeleteMealPage() {
    const [mealInfo, setMealInfo] = useState(null); 
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/api/meals?id=' + id).then(response => {
            setMealInfo(response.data);
        });
    }, [id]); 

    function getBack() {
        router.push('/meals');
    }
    async function deleteMeal(){
       await axios.delete('/api/meals?id='+id)
       getBack();
    }
    return (
        <Layout>
            <h1 className="text-center">Do you really want to delete this meal?</h1>
          <div className="flex gap-2 justify-center">
            <button className="btn-red" onClick={deleteMeal}>Yes</button>
            <button className='btn-default' onClick={getBack}>No</button>
          </div>
        </Layout>
    );
}

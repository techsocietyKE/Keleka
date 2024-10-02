
import Layout from "@/components/Layout";
import OrdersForm from "@/components/OrdersForm";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditProductPage(){
    const [orderInfo,setOrderInfo] = useState(null)
    const  router = useRouter();
    const {id} = router.query;
    useEffect(() => {
        if(!id){
            return;
        }
     axios.get('/api/editorder?id=' +id).then(response=>{
        setOrderInfo(response.data)
     })
      
    }, [id])

    return(
        <Layout>
             <h1>Edit Order</h1>
             {orderInfo &&(
                  <OrdersForm {...orderInfo}/>
             )}
          
        </Layout>
    )
}
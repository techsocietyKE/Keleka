import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DeleteOrderPage() {
    const [orderInfo, setOrderInfo] = useState(null); // Set initial state to null
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/api/ordersdelete?id=' + id).then(response => {
            setOrderInfo(response.data);
        });
    }, [id]); // Add id as a dependency to useEffect

    function getBack() {
        router.push('/orders');
    }
    async function deleteOrder(){
       await axios.delete('/api/orders?id='+id)
       getBack();
    }
    return (
        <Layout>
            <h1 className="text-center">Do you really want to this order "{orderInfo ? orderInfo.name : 'this order'}"?</h1>
          <div className="flex gap-2 justify-center">
            <button className="btn-red" onClick={deleteOrder}>Yes</button>
            <button className='btn-default' onClick={getBack}>No</button>
          </div>
        </Layout>
    );
}

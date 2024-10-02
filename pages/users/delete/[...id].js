import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DeleteBookPage() {
    const [userInfo, setUserInfo] = useState(null); // Set initial state to null
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/api/users?id=' + id).then(response => {
            setUserInfo(response.data);
        });
    }, [id]); // Add id as a dependency to useEffect

    function getBack() {
        router.push('/users');
    }
    async function deleteUser(){
       await axios.delete('/api/users?id='+id)
       getBack();
    }
    return (
        <Layout>
            <h1 className="text-center">Do you really want to delete this user</h1>
          <div className="flex gap-2 justify-center">
            <button className="btn-red" onClick={deleteUser}>Yes</button>
            <button className='btn-default' onClick={getBack}>No</button>
          </div>
        </Layout>
    );
}

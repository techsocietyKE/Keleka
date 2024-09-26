import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DeleteBookPage() {
    const [genreInfo, setGenreInfo] = useState(null); // Set initial state to null
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/api/genres?id=' + id).then(response => {
            setGenreInfo(response.data);
        });
    }, [id]); // Add id as a dependency to useEffect

    function getBack() {
        router.push('/genres');
    }
    async function deleteGenre(){
       await axios.delete('/api/genres?id='+id)
       getBack();
    }
    return (
        <Layout>
            <h1 className="text-center">Do you really want to delete this Genre</h1>
          <div className="flex gap-2 justify-center">
            <button className="btn-red" onClick={deleteGenre}>Yes</button>
            <button className='btn-default' onClick={getBack}>No</button>
          </div>
        </Layout>
    );
}

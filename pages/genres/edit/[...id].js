
import GenreForm from "@/components/GenreForm";
import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditGenrePage(){
    const [genreInfo,setGenreInfo] = useState(null)
    const  router = useRouter();
    const {id} = router.query;
    useEffect(() => {
        if(!id){
            return;
        }
     axios.get('/api/genres?id=' +id).then(response=>{
        setGenreInfo(response.data)
     })
      
    }, [id])
    
    return(
        <Layout>
             <h1>Edit Genre</h1>
             {genreInfo &&(
                  <GenreForm {...genreInfo}/>
             )}
        </Layout>
    )
}
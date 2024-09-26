import BookForm from "@/components/BookForm";
import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditProductPage(){
    const [bookInfo,setBookInfo] = useState(null)
    const  router = useRouter();
    const {id} = router.query;
    useEffect(() => {
        if(!id){
            return;
        }
     axios.get('/api/books?id=' +id).then(response=>{
        setBookInfo(response.data)
     })
      
    }, [id])
    
    return(
        <Layout>
             <h1>Edit Book</h1>
             {bookInfo &&(
                  <BookForm {...bookInfo}/>
             )}
          
        </Layout>
    )
}
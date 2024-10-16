
import Layout from "@/components/Layout";
import UserForm from "@/components/userForm";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditProductPage(){
    const [userInfo,setUserInfo] = useState(null)
    const  router = useRouter();
    const {id} = router.query;
    useEffect(() => {
        if(!id){
            return;
        }
     axios.get('/api/users?id=' +id).then(response=>{
        setUserInfo(response.data)
     })
      
    }, [id])
    
    return(
        <Layout>
             <h1>Edit User</h1>
             {userInfo &&(
                  <UserForm {...userInfo}/>
             )}
          
        </Layout>
    )
}
import clientPromise from '@/lib/mongodb'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import NextAuth, { getServerSession } from 'next-auth'
import GoogleProvider  from "next-auth/providers/google"

const adminEmails = ['michaelcelwin98@gmail.com'];
export const authOptions = {
    
        providers:[
            GoogleProvider({
                clientId: process.env.GOOGLE_ID,
                clientSecret:process.env.GOOGLE_SECRET
            })
        ],
        adapter:MongoDBAdapter(clientPromise),
        callbacks:{
            session:({session,token,user})=>{
                if (adminEmails.includes(session?.user?.email)){
                return session;
               }
               return false;
            }
        }
    
}
export default NextAuth (authOptions)

export async function isAdminRequest (req,res){
    const session = await getServerSession(req,res,authOptions);
    
    if(!adminEmails.includes(session?.user?.email)){
        res.status(401);
        res.send();
        throw new 'not admin'
    } 
   
}

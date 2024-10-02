import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import StatsCount from "./statsCount";




export default function Home() {
  const { data: session, status } = useSession();
   
  return <Layout>
  
   <div>
    <h1 className="text-3xl font-bold">Welcome to the dashboard</h1>
    <div className="flex flex-col">
      <div>
      <h2>   Hello, <b>{session?.user.firstname} {session?.user.lastname}</b></h2>
      </div>
      <div>
        <StatsCount/>
      </div>
    </div>
   </div>
 </Layout>
}
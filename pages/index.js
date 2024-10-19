import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import StatsCount from "./statsCount";
import PopularMeals from "@/components/PopularMeals";




export default function Home() {
  const { data: session, status } = useSession();
   
  return <Layout>
  
   <div>
    <h1 className="md:text-3xl text-xl font-semibold text-primary">Welcome to the dashboard</h1>
    <div className="flex flex-col">
      <div>
      <h2>   Hello, <b>{session?.user.firstname} {session?.user.lastname}</b></h2>
      </div>
      <div>
        <StatsCount/>
      </div>
      <div>
        <PopularMeals/>
      </div>
    </div>
   </div>
 </Layout>
}
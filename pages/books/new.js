import BookForm from "@/components/BookForm";
import Layout from "@/components/Layout";


export default function NewBook(){
  return(
    <Layout>
       <h1>New Book</h1>
      <BookForm/>
    </Layout>
  )
   
}
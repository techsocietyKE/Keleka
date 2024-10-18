import BooksGrid from "@/components/MealsGrid";
import Header from "@/components/Header";
import { mongooseConnect } from "@/lib/mongoose";
import { Book } from "@/models/Book";

export default function AllBooks({books}){
    return(
        <>
        <Header/>
        <h1>All Books</h1>
        <BooksGrid books={books}/>
        </>
    )
}

export async  function getServerSideProps(){
    await mongooseConnect();
  const books = await Book.find({}, null, { sort: { '_id': -1 }, limit: 4 });
  return {
    props: {
      books: JSON.parse(JSON.stringify(books)),
    },
    }

}
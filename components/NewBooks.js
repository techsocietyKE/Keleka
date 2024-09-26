import BooksGrid from "./BooksGrid";

export default function NewBooks({books}){
    return(
         <div className="bg-[#201F31]">
             <h1 className="text-center m-8 font-bold text-xl md:text-3xl text-gray-200">Featured Books  </h1> 
         <BooksGrid books={books}/>
         </div>
    )
}
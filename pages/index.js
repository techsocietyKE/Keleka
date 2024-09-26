import Featured from "@/components/Featured";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import NewBooks from "@/components/NewBooks";
import { mongooseConnect } from "@/lib/mongoose";
import { Book } from "@/models/Book";
import { Divider } from '@chakra-ui/react';

export default function HomePage({ featuredbook, newBooks }) {
  return (
    <div className="bg-[#201F31]">
      <Header />
      <Featured book={featuredbook} />
      {/* <Hero/> */}
      <Divider />
      <NewBooks books={newBooks} />
    </div>
  );
}

export async function getServerSideProps() {
  const featuredBookId = '66d95b6b83c23e11870a6f56';
  await mongooseConnect();

  const featuredbook = await Book.findById(featuredBookId);
  const newBooks = await Book.find({}, null, { sort: { '_id': -1 }, limit: 8 });

  // Console log the new books
  // console.log(newBooks);

  return {
    props: {
      featuredbook: JSON.parse(JSON.stringify(featuredbook)),
      newBooks: JSON.parse(JSON.stringify(newBooks)),
    }
  };
}

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
  const featuredBookId = '6703f55705c59ae6335282dd';
  await mongooseConnect();

  const featuredbook = await Book.findById(featuredBookId);
  const newBooks = await Book.find({}, null, { sort: { '_id': -1 }, limit: 8 });


  return {
    props: {
      featuredbook: JSON.parse(JSON.stringify(featuredbook)),
      newBooks: JSON.parse(JSON.stringify(newBooks)),
    }
  };
}

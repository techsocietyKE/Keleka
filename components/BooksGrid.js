import BookBox from "./BookBox";

export default function BooksGrid({ books }) {
  return (
    <div className="px-4 md:px-8 lg:px-12 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books?.length > 0 &&
          books.map((book) => <BookBox key={book._id} {...book} />)}
      </div>
    </div>
  );
}

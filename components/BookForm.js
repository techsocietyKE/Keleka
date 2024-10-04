import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Spinner from "./Spinner";
import { useSession } from "next-auth/react";

export default function BookForm({
  _id,
  title: existingTitle,
  author: existingAuthor,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  genre: existingGenre,
}) {
  const { data: session } = useSession();
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [author, setAuthor] = useState(existingAuthor || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [images, setImages] = useState(existingImages || []);
  const [isUploading, setIsUploading] = useState(false);
  const [genre, setGenre] = useState(existingGenre || "");
  const [genreName, setGenreName] = useState(""); // Store selected genre's name
  const [genres, setGenres] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [filteredGenres, setFilteredGenres] = useState([]); // State for filtered genres

  const router = useRouter();

  // Fetch genres from API
  useEffect(() => {
    axios.get("/api/genres").then((result) => {
      setGenres(result.data); // Set genres state with the data from API
      setFilteredGenres(result.data); // Initially, set filtered genres to all genres
    });
  }, []);

  // Filter genres based on search query
  useEffect(() => {
    if (searchQuery === "") {
      setFilteredGenres(genres);
    } else {
      setFilteredGenres(
        genres.filter((genre) =>
          genre.genrename.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, genres]);

  async function saveProduct(ev) {
    ev.preventDefault();
    const data = {
      title,
      author,
      description,
      price,
      images,
      genre: genreName, // Send selected genre name
      createdBy: session?.user?.firstname,createdBy: session?.user?.firstname, // Get user first name from session
    };
    if (_id) {
      await axios.put("/api/books", { ...data, _id });
    } else {
      await axios.post("/api/books", data);
    }

    router.push("/books");
  }

  // Handle image upload
  async function uploadImages(ev) {
    const files = ev.target?.files;
    setIsUploading(true);
    if (files?.length > 0) {
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      const uploadedImages = await res.json();
      setImages((oldImages) => [...oldImages, ...uploadedImages]);
      setIsUploading(false);
    }
  }

  return (
    <form onSubmit={saveProduct} className="p-4 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Book Form</h2>

      <label className="block text-gray-700 mb-2">Book Name</label>
      <input
        className="w-full border border-gray-300 rounded-lg p-2 mb-4 outline-none focus:border-blue-500"
        type="text"
        placeholder="Book name"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />

      <label className="block text-gray-700 mb-2">Author</label>
      <input
        className="w-full border border-gray-300 rounded-lg p-2 mb-4 outline-none focus:border-blue-500"
        placeholder="Author"
        value={author}
        onChange={(ev) => setAuthor(ev.target.value)}
      />

      <label className="block text-gray-700 mb-2">Description</label>
      <textarea
        className="w-full border border-gray-300 rounded-lg p-2 mb-4 outline-none focus:border-blue-500"
        placeholder="Description"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      />

      <label className="block text-gray-700 mb-2">Genre</label>
      
      <select
        className="w-full border border-gray-300 rounded-lg p-2 mb-4 outline-none focus:border-blue-500"
        value={genre}
        onChange={(ev) => {
          const selectedGenre = genres.find((g) => g._id === ev.target.value);
          setGenre(ev.target.value); // Set the genre ID
          setGenreName(selectedGenre?.genrename || ""); // Set the genre name
        }} // Update selected genre on change
      >
        {filteredGenres.length > 0 ? (
          filteredGenres.map((g) => (
            <option key={g._id} value={g._id}>
              {g.genrename}
            </option>
          ))
        ) : (
          <option disabled>No genres found</option>
        )}
      </select>

      <label className="block text-gray-700 mb-2">Cover Photo</label>
      <div className="flex flex-wrap gap-4 mb-4">
        {!!images.length &&
          images.map((uploadedImage, index) => (
            <div key={index} className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={uploadedImage}
                alt={`Uploaded Image ${index}`}
                className="rounded-lg w-full h-full object-cover"
              />
            </div>
          ))}

        {isUploading && (
          <div className="h-24 w-24 flex items-center justify-center">
            <Spinner />
          </div>
        )}

        <label className="w-24 h-24 flex items-center justify-center text-gray-500 rounded-lg bg-gray-200 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <span>Upload</span>
          <input onChange={uploadImages} type="file" multiple className="hidden" />
        </label>
      </div>

      <label className="block text-gray-700 mb-2">Price (in Ksh)</label>
      <input
        className="w-full border border-gray-300 rounded-lg p-2 mb-4 outline-none focus:border-blue-500"
        type="number"
        placeholder="Price"
        value={price}
        onChange={(ev) => setPrice(ev.target.value)}
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white rounded-lg py-2 mt-4 hover:bg-blue-700 transition"
      >
        Save
      </button>
    </form>
  );
}

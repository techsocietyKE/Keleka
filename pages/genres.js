import Layout from '@/components/Layout';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { withAuth } from '@/utils/withAuth';

const Genres = () => {
  const router = useRouter();
  const { id } = router.query; // Get the genre ID from the URL
  const [genrename, setGenreName] = useState('');
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch genres when component mounts or ID changes
  useEffect(() => {
    fetchGenres();
    if (id) {
      fetchGenre(id); // Fetch genre for editing
    }
  }, [id]);

  // Fetch all genres from the API
  const fetchGenres = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/genres');
      setGenres(response.data);
    } catch (error) {
      console.error('Error fetching genres:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch a single genre by ID
  const fetchGenre = async (genreId) => {
    try {
      const response = await axios.get(`/api/genres?id=${genreId}`);
      setGenreName(response.data.genrename); // Set the genre name for editing
    } catch (error) {
      console.error('Error fetching genre:', error);
    }
  };

  // Save or update genre
  const saveGenre = async (ev) => {
    ev.preventDefault();
    setIsSubmitting(true);
    const data = { genrename };

    try {
      if (id) {
        await axios.put('/api/genres', { ...data, _id: id });
      } else {
        await axios.post('/api/genres', data);
      }

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Genre saved successfully!',
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000
      });

      setGenreName('');
      fetchGenres();
      router.push('/genres'); // Redirect to genres list after saving
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to save the genre.',
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="p-4 max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            {id ? 'Edit Genre' : 'Add New Book Genre'}
          </h2>
          <form onSubmit={saveGenre} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Genre Name</label>
              <input
                type="text"
                placeholder="Enter genre name"
                value={genrename}
                onChange={(ev) => setGenreName(ev.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 transition"
                disabled={isSubmitting}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : (id ? 'Update Genre' : 'Save Genre')}
            </button>
          </form>
        </div>

        <div className="mt-10 bg-white shadow-md rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 p-4 border-b">Available Genres</h3>

          {isLoading ? (
            <div className="text-center p-4">Loading genres...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-200 text-gray-600 text-sm leading-normal">
                  <tr>
                    <th className="py-3 px-6 text-left">Genre Name</th>
                    <th className="py-3 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-sm">
                  {genres.length > 0 ? (
                    genres.map((genre) => (
                      <tr key={genre._id} className="border-b border-gray-200 hover:bg-gray-100">
                        <td className="py-3 px-6 text-left">
                          <span className="font-medium">{genre.genrename}</span>
                        </td>
                        <td className="py-3 px-6 text-center">
                          <div className="flex justify-center space-x-4">
                            <Link href={`/genres/edit/${genre._id}`}>
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
                                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                />
                              </svg>
                            </Link>
                            <Link href={`/genres/delete/${genre._id}`}>
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
                                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                />
                              </svg>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="text-center py-5">
                        No genres found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default withAuth(Genres,['Admin']);

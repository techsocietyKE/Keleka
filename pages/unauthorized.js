import Link from "next/link";

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-red-600">Unauthorized Access</h1>
      <p>You don&#39;t have permission to view this page.</p>

      <Link href={'/login'}>
        <button
          type="button"
          className="bg-green-500 text-white font-bold px-6 py-2 mt-4"
        >
          Go Back
        </button>
      </Link>
    </div>
  );
}

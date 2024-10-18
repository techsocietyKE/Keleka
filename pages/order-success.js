import Header from "@/components/Header";


export default function OrderSuccessPage() {
    return (
      
       <div>
        <Header />
        <div className="bg-white h-screen flex flex-col items-center justify-center text-center">
            
            <div className="p-6 bg-green-500 text-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-semibold mb-4">Order Placed Successfully!</h1>
                <p className="mt-4">You can check your email for further updates.</p>
            </div>
        </div>
       </div>
    );
}

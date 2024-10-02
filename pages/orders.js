import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import PendingDeliveries from "@/components/PendingDeliveries";
import { withAuth } from "@/utils/withAuth";
import AllOrders from "./allOrders";


const OrdersPage = () => {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("Orders");

  useEffect(() => {
    if (activeTab === "Orders") {
      axios.get("/api/orders").then((response) => {
        setOrders(response.data);
      });
    }
  }, [activeTab]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const isAdmin = session?.user?.role === "Admin";
  const isStaff = session?.user?.role === "Staff";
  const isDeliveryGuy = session?.user?.role === "DeliveryGuy";

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Orders</h1>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-2 overflow-x-auto no-scrollbar">
            {/* Show all tabs if Admin or Staff */}
            {(isAdmin || isStaff) && (
              <>
                <button
                  onClick={() => handleTabClick("Orders")}
                  className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                    activeTab === "Orders"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600"
                  }`}
                >
                  Orders
                </button>
                <button
                  onClick={() => handleTabClick("Pending Deliveries")}
                  className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                    activeTab === "Pending Deliveries"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600"
                  }`}
                >
                  Pending Deliveries
                </button>
                
              </>
            )}

            {/* Show only Pending Deliveries for Delivery Guy */}
            {isDeliveryGuy && (
              <button
                onClick={() => handleTabClick("Pending Deliveries")}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                  activeTab === "Pending Deliveries"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600"
                }`}
              >
                Pending Deliveries
              </button>
            )}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "Orders" && (isAdmin || isStaff) && <AllOrders />}
        {activeTab === "Pending Deliveries" && <PendingDeliveries />}
      </div>
    </Layout>
  );
};

export default withAuth(OrdersPage, ["Admin", "Staff", "DeliveryGuy"]);

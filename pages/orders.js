import Layout from "@/components/Layout";
import { withAuth } from "@/utils/withAuth";
import AllOrders from "./allOrders";


const OrdersPage = () => {


  return (
    <Layout>
     <AllOrders/>
    </Layout>
  );
};

export default withAuth(OrdersPage, ["Admin", "Staff", "DeliveryGuy"]);

import Header from '@/components/Header';
import MyOrders from './myorders';
import withAuth from '@/utils/withAuth';

const Profile = () => {
 

  return (
   <div>
     <div>
      <Header/>
     </div>
     <div className='mt-[80px] md:mt-[80px] sm:mt-[70px]'>
      <MyOrders/>
     </div>
   </div> 
  );
};

export default withAuth(Profile);

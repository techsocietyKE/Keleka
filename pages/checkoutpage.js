import Payment from '@/components/Payment'
import withAuth from '@/utils/withAuth'
import React from 'react'

const CheckoutPage = () => {
  return (
    <div>
      <Payment/>
    </div>
  )
}

export default withAuth(CheckoutPage)
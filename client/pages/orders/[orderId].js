import { Order } from '../../components'
import StripeCheckout from 'react-stripe-checkout'
const OrderShow = ({ order, currentUser, stripeKey }) => {
  return (
    <>
      <Order {...order} />
      <StripeCheckout
        token={token => console.log(token)}
        stripeKey={stripeKey}
        amount={order.ticket.price * 100} // cents
        email={currentUser.email}
      />
    </>
  )
}

OrderShow.getInitialProps = async (context, axios) => {
  const { orderId } = context.query
  const { data: order } = await axios.get(`/api/orders/${orderId}`)
  return { order, stripeKey: process.env.STRIPE_PUB_KEY }
}
export default OrderShow

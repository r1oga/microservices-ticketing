import { Order } from '../../components'

const OrderShow = ({ order }) => <Order {...order} />

OrderShow.getInitialProps = async (context, axios) => {
  const { orderId } = context.query
  const { data: order } = await axios.get(`/api/orders/${orderId}`)
  return { order }
}
export default OrderShow

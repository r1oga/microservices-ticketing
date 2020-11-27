import axios from 'axios'

const baseURL =
  typeof window === 'undefined'
    ? 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local'
    : ''

const buildClient = ({ req }) => {
  const { headers } = req
  return axios.create({ baseURL, headers })
}
export default buildClient

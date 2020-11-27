import axios from 'axios'

const baseURL =
  typeof window === 'undefined'
    ? 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local'
    : ''

const buildClient = ({ req: { headers } }) => axios.create({ baseURL, headers })
export default buildClient

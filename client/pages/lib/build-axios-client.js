import axios from 'axios'

const baseURL =
  typeof window === 'undefined'
    ? 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local'
    : ''

export default ({ req: { headers } }) => axios.create({ baseURL, headers })

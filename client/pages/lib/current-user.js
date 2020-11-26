import axios from 'axios'

export default async function currentUser(cookie) {
  let url = '/api/users/currentuser'
  const headers = { Cookie: `express:sess=${cookie}` }
  if (typeof window === 'undefined') {
    // we are on the server
    url = `http://ingress-nginx-controller.ingress-nginx.svc.cluster.local${url}`
    headers.Host = 'ticketing.io'
  }

  const response = await axios.get(url, { headers })
  return response.data
}

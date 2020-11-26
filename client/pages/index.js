import { buildClient } from './lib'
const LandingPage = ({ currentUser }) => (
  <>
    <h1>Landing page!!</h1>
    {currentUser && <div>Logged in as {currentUser.email}</div>}
  </>
)

export async function getServerSideProps(context) {
  const axios = buildClient(context)
  const { data } = await axios.get('/api/users/currentuser')
  return { props: data }
}

export default LandingPage

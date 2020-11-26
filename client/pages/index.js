import { currentUser } from './lib'
const LandingPage = ({ user }) => (
  <>
    <h1>Landing page!!</h1>
    {currentUser && <div>Logged in as {user.email}</div>}
  </>
)

export async function getServerSideProps({ req }) {
  const cookie = req.cookies['express:sess']
  const { currentUser: user } = await currentUser(cookie)
  return { props: { user } }
}

export default LandingPage

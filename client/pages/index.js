const LandingPage = ({ currentUser, extra }) => {
  return <h1>Landing page!!</h1>
}

export async function getServerSideProps(context) {
  return { props: { extra: 'test' } }
}

export default LandingPage

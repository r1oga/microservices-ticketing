const LandingPage = () => {
  return <h1>Landing page!!</h1>
}

export async function getInitialProps(context, axios, currentUser) {
  console.log(currentUser)
  console.log(axios)
  return { props: { extra: 'test' } }
}

export default LandingPage

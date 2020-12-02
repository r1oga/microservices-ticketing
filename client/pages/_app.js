import 'bootstrap/dist/css/bootstrap.css'

import { Header } from '../components'
import { buildClient } from '../lib'

const _App = ({ Component, pageProps, currentUser }) => {
  return (
    <>
      <Header currentUser={currentUser} />
      <div className='container'>
        <Component {...pageProps} />
      </div>
    </>
  )
}

// _app doesn't support `getServerSideProps`, use `getInitialProps` instead
// https://nextjs.org/docs/advanced-features/custom-app#caveats
_App.getInitialProps = async appContext => {
  const axios = buildClient(appContext.ctx)
  const { data } = await axios.get('/api/users/currentuser')
  let pageProps = {}
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      axios,
      data.currentUser
    )
  }
  return { pageProps, ...data }
}

export default _App

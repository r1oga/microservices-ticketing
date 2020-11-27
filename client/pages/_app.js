import 'bootstrap/dist/css/bootstrap.css'
import Link from 'next/link'
import App from 'next/app'
import { useState } from 'react'
import { buildClient } from './lib'

const _App = ({ Component, pageProps }) => {
  const { currentUser } = pageProps
  const [logged, setLogged] = useState(currentUser !== null)
  return (
    <>
      <ul className='nav justify-content-end'>
        {logged ? (
          <>
            <li className='nav-item'>{currentUser.email}</li>
            <li className='nav-item'>
              <Link href='/auth/signout'>
                <a className='nav-link' href='#'>
                  Sign Out
                </a>
              </Link>
            </li>
          </>
        ) : (
          <>
            <li className='nav-item'>
              <Link href='/auth/signin'>
                <a className='nav-link active'>Sign In</a>
              </Link>
            </li>
            <li className='nav-item'>
              <Link href='/auth/signup'>
                <a className='nav-link' href='#'>
                  Sign Up
                </a>
              </Link>
            </li>
          </>
        )}
      </ul>
      <Component {...pageProps} />
    </>
  )
}

// _app doesn't support `getServerSideProps`, use `getInitialProps` instead
// https://nextjs.org/docs/advanced-features/custom-app#caveats
_App.getInitialProps = async appContext => {
  const axios = buildClient(appContext.ctx)
  const { data } = await axios.get('/api/users/currentuser')
  return { pageProps: data }
}

export default _App

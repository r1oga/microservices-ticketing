import axios from 'axios'
import { useState } from 'react'
import { buildClient } from '../lib'

const SignOut = ({ currentUser }) => {
  const [logged, setLogged] = useState(currentUser !== null)
  const onSubmit = async event => {
    event.preventDefault()
    await axios.post('/api/users/signout', {})
    setLogged(false)
  }

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign Out</h1>
      {logged ? (
        <div>Logged in as {currentUser.email}</div>
      ) : (
        <div>You are not signed in</div>
      )}
      <button className='btn btn-primary'>Sign Out</button>
    </form>
  )
}

export async function getServerSideProps(context) {
  const axios = buildClient(context)
  const { data } = await axios.get('/api/users/currentuser')
  return { props: data }
}

export default SignOut

const tokenValidation ={
  methods : {
 validateToken()  {
  const authToken = localStorage.getItem('Auth_token')
  const tokenExpiration = localStorage.getItem('tokenExpiration')

  if (authToken && tokenExpiration) {
    const expirationTime = new Date(tokenExpiration)

    if (new Date() < expirationTime) {
      console.log("iamhere")
      return authToken 
    } else {
      localStorage.removeItem('Auth_token')
      localStorage.removeItem('user_id')
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('tokenExpiration')
      this.$router.push("/login")
      return null
    }
  }
  this.$router.push("/login")
      return null
}
  }
}
export default tokenValidation

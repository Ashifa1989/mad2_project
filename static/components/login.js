const login = {
  template: `
  <div>

    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 66vh;">
        <div v-if="!success" style="display: block; margin-bottom: 5px; color:red">
          {{ error_message }}
        </div>
        
        <form @submit.prevent="loginUser" style="border: 2px solid grey; padding: 20px; border-radius: 10px; max-width: 300px;">
            <h3 style="text-align: center; ">Login</h3>
            <label for="email" style="display: block; margin-bottom: 5px;">Email:</label>
            <input type="email" id="email" v-model="formData.email" placeholder="email" required style="padding: 8px; border: 1px solid #ccc; border-radius: 5px; width: 100%; margin-bottom: 10px;" />

            <label for="password" style="display: block; margin-bottom: 5px;">Password:</label>
            <input type="password" id="password" placeholder="password" v-model="formData.password" required style="padding: 8px; border: 1px solid #ccc; border-radius: 5px; width: 100%; margin-bottom: 10px;" />

            <button type="submit" style="padding: 8px 15px; background-color: green; color: white; border: none; border-radius: 5px; cursor: pointer;">Login</button>
        </form>
    </div>

    
</div>`,

  data() {
    return {
      formData: {
        username: "",
        password: "",
        email: ""
      },
      success: true,
      error_message: "something went wrong"
    }
  },
  props: ['isLoggedIn'],

  methods: {
    async loginUser() {
      const res = await fetch(`http://127.0.0.1:5000/login?include_auth_token`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache"
        },
        body: JSON.stringify(this.formData)
      })
      //console.log("Response status code:", res.status);

      if (res.ok) {
        //console.log("i am here")
        const data = await res.json()
        this.formData = data
        this.success = true

        localStorage.setItem('Auth_token', data.response.user.authentication_token)
        localStorage.setItem('user_id', data.response.user.id)
        localStorage.setItem('isLoggedIn', 'true');
        

        const response = await fetch(`http://127.0.0.1:5000/api/user`, {
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": localStorage.getItem("Auth_token")
          }
        })

        if (response.ok) {
          const userdata = await response.json()
          this.$root.$emit('userLoggedInEvent',userdata.roles)
          localStorage.setItem('roles', JSON.stringify(userdata.roles));
          console.log(userdata.roles)
          if (userdata.roles.some(r => r.name == 'Manager')) {
            this.$router.push('/all_product')
          }
          else if (userdata.roles.some(r => r.name == 'Admin')) {
            console.log("Inside admin role")
            this.$router.push('/adminDashboard')
          }
          else {
            this.$router.push('/home')
          }
        }
        else {
          console.log("no role found")
        }
      }
      else {
        const errorData = await res.json();
        console.log("Login failed:", errorData);
        this.success = false
        this.error_message = "You have entered an invalid email or password"
        
      }
    },
  },
}


export default login

const signUp={
    template : `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 66vh;">
            
            <form @submit.prevent="signUpUser" style="border: 2px solid grey; padding: 20px; border-radius: 10px; max-width: 300px;">
            <h3 style="text-align: center; ">Sign Up</h3>  
            <label for="email" style="display: block; margin-bottom: 5px;">Email:</label>
            <input type="email" id="email" v-model="user.email" placeholder="Email" required style="padding: 8px; border: 1px solid #ccc; border-radius: 5px; width: 100%; margin-bottom: 10px;" />
            
            <label for="username" style="display: block; margin-bottom: 5px;">Username:</label>
            <input type="text" id="username" placeholder="Name" v-model="user.username" required style="padding: 8px; border: 1px solid #ccc; border-radius: 5px; width: 100%; margin-bottom: 10px;" />

            <label for="password" style="display: block; margin-bottom: 5px;">Password:</label>
            <input type="password" id="password"  placeholder="Password" v-model="user.password" required style="padding: 8px; border: 1px solid #ccc; border-radius: 5px; width: 100%; margin-bottom: 10px;" />

            <button type="submit" style="padding: 8px 15px; background-color: rgb(76, 175, 80); color: white; border: none; border-radius: 5px; cursor: pointer;">Create Account</button>
            </form>
            <div v-if="success">{{ message }}</div>
            <div v-else>{{ error_message }}</div>
        </div>
        `,




data() {
    return {
        user : {
            email: '',
            username: '',
            password: ''
        },
        error_message : "",
        success : true,
        message : "",
        apiBaseUrl: "http://127.0.0.1:5000/api/"

        }
    },

    methods : {
        async signUpUser() {
            const res = await fetch(`${this.apiBaseUrl}/user/register`,{
                method : "post",
                headers : {
                    "content-type" : "application/json",
                    
                },
                body : JSON.stringify(this.user)
            })
            console.log(res)
            if (res.ok){
                const data = await res.json()
                this.user = data
                this.success = true
                this.message = data.message
                this.$router.push('/login'); 
            }
            else {
                const errorData = await res.json()
                this.success = false
                this.error_message= errorData.error_message
                console.log("i am here", this.error_message)
            }
        }
    },
    
}
export default signUp
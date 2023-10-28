const signUp={
    template : `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 66vh;">
            
            <form @submit.prevent="signUpUser" style="border: 2px solid grey; padding: 20px; border-radius: 10px; max-width: 300px;">
            <h3 style="text-align: center; ">Sign up</h3>  
            <label for="email" style="display: block; margin-bottom: 5px;">Email:</label>
            <input type="email" id="email" v-model="user.email" placeholder="email" required style="padding: 8px; border: 1px solid #ccc; border-radius: 5px; width: 100%; margin-bottom: 10px;" />
            
            <label for="username" style="display: block; margin-bottom: 5px;">Username:</label>
            <input type="text" id="username" placeholder="username" v-model="user.username" required style="padding: 8px; border: 1px solid #ccc; border-radius: 5px; width: 100%; margin-bottom: 10px;" />

            <label for="password" style="display: block; margin-bottom: 5px;">Password:</label>
            <input type="password" id="password"  placeholder="password" v-model="user.password" required style="padding: 8px; border: 1px solid #ccc; border-radius: 5px; width: 100%; margin-bottom: 10px;" />

            <button type="submit" style="padding: 8px 15px; background-color: green; color: white; border: none; border-radius: 5px; cursor: pointer;">Create Account</button>
            </form>
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
        success : true

        }
    },

    methods : {
        async signUpUser() {
            const res = await fetch(`http://127.0.0.1:5000/api/user/register`,{
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
                this.$router.push('/login'); 
            }
            else {
                const errorData = await res.json()
                this.success = false
                this.error_message= errorData.error_message
            }
        }
    },
    
}
export default signUp
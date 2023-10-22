const login = { 
    template : `<div>
    
    <form >
    <label for="email">Email:</label>
    <p><input type="email" name="email"   placeholder="email" v-model="formData.email" ></input></p>
    <p><label for="password">Password:</label></p>
    <p><input type="password" name="password" id="password" placeholder="password" v-model="formData.password" ></input></p>
    <button @click.prevent="loginUser">LoginCustomer</button> 
    <button @click.prevent="loginManager">LoginManager</button>
    
    </form>
    
    <div v-if= "!success">
        {{ error_message }}
    </div>
    </div>`,
    data() {
        return {
            formData: {
                username : "",
                password : "",
                email :""
            },
            success : true,
            error_message : "something went wrong"
        }
    },
    methods: {
        async loginUser() {
            const res = await fetch(`http://127.0.0.1:5000/login?include_auth_token`, {
                method: "post",
                headers : {
                    "Content-Type" : "application/json",
                    "Cache-Control": "no-store, no-cache"                    
                },
                body : JSON.stringify(this.formData)
            })
                console.log("Response status code:", res.status);
            
            if (res.ok){
                const data = await res.json()
                console.log("Login successful 123:", data);
                this.formData = data
                this.success = true;
                
                localStorage.setItem('Auth_token', data.response.user.authentication_token)
                const id = data.response.user.id 
                this.$router.push(`/profile/${id}`)                 
            }
            else {
                const errorData = await res.json();
                console.log("Login failed:", errorData);
                this.success = false
                this.error_message = errorData.error_message
            }
        },
    },
   
   

}
export default login

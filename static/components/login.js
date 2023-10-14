const login = { 
    template : `<div>
    
    <form >

    <p><input type="text" name="email" id="email"  placeholder="username" v-model="formData.username" ></input></p>
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
            },
            success : true,
            error_message : "something went wrong"
        }
    },
    methods: {
        async loginUser() {
            const res = await fetch("http://127.0.0.1:5000/api/users/login", {
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
                // console.log(data.id)
                this.$router.push({ name: 'profile', params: { id: data.id } });                
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

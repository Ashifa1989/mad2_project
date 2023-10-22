const signUp={
    template : `<div>
    
    <form >
    <p><input type="text" name="username" id="username"  placeholder="name" v-model="user.username" ></input></p>
    <p><input type="text" name="email" id="email"  placeholder="example@gmail.com" v-model="user.email" ></input></p>
    <p><input type="password" name="password" id="password" placeholder="password" v-model="user.password" ></input></p>
    <button @click.prevent="signUpUser">signUp</button> 
    
    </form>

    
</div>`,



data() {
    return {
        user : {
            username: "",
            email: "",
            password : "",
        },
        error_message : "",
        success : true

        }
    },

    methods : {
        async signUpUser() {
            const res = await fetch(`http://127.0.0.1:5000/api/users/register`,{
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
                this.$router.push("/login"); 
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
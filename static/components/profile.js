const profile = {
    template :` <div> 
    <div v-if="success">
    <h2> Username : {{ profile.username}}</h2>
    <h2> password : {{ profile.password }}</h2>
    </div>
    <div v-else>
        {{ error }}
    </div>
    </div>`,
    data(){
        return{
            profile : {
                "username": 'Ayisha',
                "password" : "1234"
            },
            success: true,
            error : "something went wrong"
        }
    },

    async mounted() {
        const res = await fetch('http://127.0.0.1:5000/api/users/2') 
        const data= await res.json() 
        if (res.ok){
            this.profile = data            
        }
        else {
            this.success = false
            this.error = data.message
        }
    }

}
export default profile
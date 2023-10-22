const profile = {
    template :` <div> 
    <div v-if="success">
    <h2> Welcome {{ profile.username }} !! </h2>
    
    </div>
    <div v-else>
        {{ error_message }}
    </div>
    </div>`,
    data(){
        return{
            profile : {
                username: ''
                
            },
            success: true,
            error_message : "something went wrong"
        }
    },

    async mounted(){
        
        const res = await fetch(`/api/users/${this.$route.params.id}`,{
            headers :{
                "Content-Type" : "application/json",
            }
        }) 
        console.log(res.status)
        if (res.status == 401) {
            const data= await res.json()
            console.log("no user found", data);
            this.success = false
            this.error_message ="not an autheticated user"
        }
        else if (res.ok){
            const data= await res.json()
            this.profile = data
            console.log(data)            
        }
        else {
            const errorData = await res.json();
            console.log("no user found", errorData);

            this.success = false
            this.error_message = errorData.error_message
        }
    }
    

}

export default profile


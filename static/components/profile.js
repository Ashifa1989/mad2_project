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
                username: 'ashifa'
                
            },
            success: true,
            error_message : "something went wrong"
        }
    },

    async mounted() {
        
        const res = await fetch(`/api/users/${this.$route.params.id}`) 
        
        
        if (res.ok){
            const data= await res.json()
            this.profile = data            
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


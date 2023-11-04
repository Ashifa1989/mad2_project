
const profile = {
    template :`
    <div> 
      <div v-if="success">
        <h2> Welcome {{ profile.username }} !! </h2>
        <button @click.prevent="trigger_celery_task">triggercelerytask</button>
        <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">Toggle right offcanvas</button>

        <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasRightLabel">Offcanvas right</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body">
            <div>
                <router-link to="/address" class="nav-link" style="margin-left: 20px; float: right">Address</router-link>
            </div>
            <div>
                <router-link to='/payment' class="nav-link" style="margin-left: 20px; float: right">Payment</router-link>
            </div>
          </div>
        </div>
      </div>
    <div v-else>
        {{ error_message }}
    </div>
    </div>`,
    data(){
        return{
            profile : {
                username: '',
                
                
            },
            success: true,
            error_message : "something went wrong"
        }
    },
    methods:{
        

    },

    async mounted(){
        
        const res = await fetch("/api/user",{
            headers :{
                "Content-Type" : "application/json",
                "Authentication-Token" : localStorage.getItem("Auth_token")
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


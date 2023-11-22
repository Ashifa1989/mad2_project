const admin={
  template:`
  <div>
    <h1>Welcom Back {{ user.username }}</h1>
    <div v-if="users.length>0">
      <div v-if="success" style=" margin-top: 20px"><strong>Pending Manager Signup Approvals</strong></div>
      <div class="conatiner text-auto  mt-3 mb-3">
        <table class="table ml-0">
          <thead>
            <tr>
              <th>UserName</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr  v-for="user in users">
              <td>{{ user.username}}</td>
              <td>{{ user.email }}</td>
              <td>
                <button class="btn btn-success" @click="ApproveSignUpRequest(user.id)">accept</button>
                <button class="btn btn-success" @click=" RejectSignUpRequest(user.id)">reject</button>
              </td>
            </tr>
            
          </tbody>
        </table>    
      </div>
    </div>
    <div v-else>
      <strong>{{ error_message }}</strong>  
    </div>   
  </div>
  `,
  data(){
    return{
      users:[],
      message:"",
      success:true,
      user:{},
      error_message:"",
    }
  },
  methods:{
    async getallSignupRequest(){
      const res=await fetch("http://127.0.0.1:5000/api/Admin_approval")
      if (res.ok){
        const data=await res.json()
        if(data.length  >0){
          
          this.success=true
          this.users=data
        }
        else{
          this.success=false
          this.error_message="there is no new manager signUp request"
        }
        
      }
      else{
        const errorData=await res.json()
        this.success=false
        this.errorMessage=errorData.errorMessage
      }
    },
    async getAdmin(){
      const res=await fetch("http://127.0.0.1:5000/api/user",{
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("Auth_token")
          
        },
      })
      if(res.ok){
        const data=await res.json()
        this.user=data
      }
      else{
        const errorData= await res.json()
        this.errorMessage= errorData.errorMessage
      }
    },
    async ApproveSignUpRequest(id){
      const res=await fetch(`http://127.0.0.1:5000/api/Admin_approval/${id}`,{
        method: "put",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store, no-cache",
            "Authentication-Token" : localStorage.getItem("Auth_token")
          },
          

      })
      if (res.ok){
        alert("approved manager SignUp Request")
        const res=await fetch("http://127.0.0.1:5000/api/Admin_approval")
        if (res.ok){
          const data=await res.json()
          this.success=true
          this.users=data
          
        }
        else{
          this.success=false
          this.message="there is no new manager signUp request"
        }
      }
      else{
        const errorData=await res.json()
        this.success=false
        this.errorMessage=errorData.errorMessage
      }
      

    },
    async RejectSignUpRequest(id){
      
      const res=await fetch(`http://127.0.0.1:5000/api/Admin_reject/${id}`,{
        method: "put",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store, no-cache",
            "Authentication-Token" : localStorage.getItem("Auth_token")
          },
          

      })
      if (res.ok){
        alert("Rejected manager SignUp Request")
        const res=await fetch("http://127.0.0.1:5000/api/Admin_approval")
        if (res.ok){
          const data=await res.json()
          this.success=true
          this.users=data
        }
        else{
          this.success=false
          this.message="there is no new manager signUp request"
        }
      }
      else{
        const errorData=await res.json()
        this.success=false
        this.errorMessage=errorData.errorMessage
      }
      

    },

  },
  mounted() {
    this.getallSignupRequest();
    this.getAdmin()
  },
}
export default admin
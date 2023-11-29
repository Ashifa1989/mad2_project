import userService from "./userService.js"
const managerDashboard = {
  template: `
  <div>
  <div v-if="successfirst">
  <div class="container mt-4">
        <div class="card">
            <div class="card-body">
                <div class="row">
                    <div class="col-md-4">
                    <img src="https://i.pinimg.com/originals/f9/75/81/f9758151b717582c500f0dcc33beca4f.png"  alt="Manager photo" class="img-fluid rounded-circle">
                    
                    </div>
                    <div class="col-md-8">
                        <h4 class="card-title">{{ user.username }}</h4>
                        <p class="card-text">Email: {{ user.email }}</p>
                        <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal" @click.prevent="showEditUser()" >
                          Edit Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="container mt-4">
        <div class="row">
            <div class="col-md-6">
                
                <button class="btn btn-success btn-block" @click="DownloadCSVFile">Export Product Report as CSV</button>  
            </div>
            

            
        </div>
    </div>
    </div>
  <div v-else>
  {{ error_message }}
  </div>


    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h1 class="modal-title fs-5" id="exampleModalLabel">Update Manager Details</h1>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <div>
                      <label for="exampleFormControlInput1" class="form-label">Name</label>
                        <input type="text" class="form-control" v-model="user.username">
                      </div>
                      <div>
                        <label class="form-label">Email:</label>
                        <input type="text" class="form-control" v-model="user.email">
                      </div>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                      <button type="button" @click="updateManager" class="btn btn-success" style="background-color: rgb(244, 67, 54)">
                      Save</button>
                    </div>
                    <div v-if="success">{{ message }}</div>
                    <div v-else>{{ error_message }}</div>
              </div>
          </div>
        </div>
        </div>

  

  </div>
  `,
  data() {
    return {
      user: {},
      success: true,
      error_message: "",
      apiBaseUrl: "http://127.0.0.1:5000/api/",
      EditUser: {},
      message: "",
      success:true,
      successfirst:true
      
        
    }
  },
  methods: {
    async getManager(){
      const data=await userService.methods.getUser()
      this.user=data
      
    },
    async updateManager() {
        const res =await fetch(`${this.apiBaseUrl}/user`, {
          method: "put",
          headers: {
              "Content-Type": "application/json",
              "Authentication-Token": localStorage.getItem("Auth_token")
          },
          body: JSON.stringify(this.user),
          

      })
      console.log("rse", res.status)
      if (res.ok) {
          const data=await res.json()
          this.user = data
          this.getManager()
          // this.$router.go(0)
      }
      else {
          const errorData = await res.json()
          this.success=false
          this.error_message = errorData.error_message
      }
    },  
    
    async showEditUser() {
      console.log(" iam inside show")
      this.EditUser = this.user
      console.log(" iam inside show after")
    },
    async DownloadCSVFile() {
      const res = await fetch("/DownloadCSVFile")
      const data = await res.json()
      const id = localStorage.getItem("user_id")

      if (res.ok) {
        
        const taskId=data["task_id"]
        const intv= setInterval(async () =>{
        const csv_res = await fetch(`/status/${taskId}`)
        if (csv_res.ok){
          clearInterval(intv)
          window.location.href = "/download-file"
          const notifyres = await fetch(`/notify_manager_csv_download/${id}`)
          //console.log("status", notifyres.status)
          const notifydata = await notifyres.json()
          
        }
        
        }, 1000)
        
       
        
        
      }
      

    },
  },
  async mounted() {
    if(localStorage.getItem("Auth_token")){
      const userid=localStorage.getItem("user_id")
      console.log("userid",userid)
      const res=await fetch(`${this.apiBaseUrl}/user`,{
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("Auth_token")
      },
      })
      if(res.ok){
        const userdata=await res.json()
        console.log("userdata", userdata)
        if(userdata.id == userid && (userdata.roles.some(role => role.name == "Manager"))){
          this.getManager()
        }
        else{
          this.successfirst=false
          this.error_message="You are not authorized to access this page. Please log in"
        }
        
      }
      else{
        this.successfirst=false
        this.error_message="You are not authorized to access this page. Please log in"
      }
    }
    else{
      this.successfirst=false
      this.error_message="You are not authorized to access this page. Please log in"
    }
  }
}

export default managerDashboard
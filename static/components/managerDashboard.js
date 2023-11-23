import userService from "./userService.js"
const managerDashboard = {
  template: `
  <div>
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
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="container mt-4">
        <div class="row">
            <div class="col-md-6">
                
                <button class="btn btn-success btn-block" @click="DownloadCSVFile">Export CSV</button>  
            </div>
            
        </div>
    </div>
  </div>
  `,
  data() {
    return {
      user: {},
      success: true,
      error_message: "something went wrong",
      apiBaseUrl: "http://127.0.0.1:5000/api/",
      EditUser: {},
      message: ""
    }
  },
  methods: {
    async updateManager() {
      const res = fetch(`${this.apiBaseUrl}/user`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("Auth_token")
        },
        body: JSON.stringify(this.user),

      })
      if (res.ok) {
        const data = await res.json()
        this.user = data
        this.get_manager()
      }
      else {
        const errorData = await res.json()
        this.error_message = errorData.error_message
      }
    },

    async showEditUser() {
      this.EditUser = this.user
    },
    async DownloadCSVFile(){
      const res=await fetch("/DownloadCSVFile")
      if(res.ok){
          const data= await res.json()
          console.log("details of celery job", data)
          const id=localStorage.getItem("user_id")
          
          const notifyres=await fetch(`/notify_manager_csv_download/${id}`)
          console.log("status", notifyres.status)
          const notifydata= await notifyres.json()
          this.notifymessage=notifydata.message
          window.location.href="/download-file"
      }
  },
  },
  

  async mounted() {
    this.user = userService.methods.getUser()//this.get_manager()
    console.log(this.user)
  }
}

export default managerDashboard
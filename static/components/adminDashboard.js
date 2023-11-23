const admin={
  template:`
  <div>
    <h1>Welcome Back  {{ user.username }}</h1>
    <div v-if="users.length > 0" style="margin-top: 20px">
        <strong>Pending Manager Signup Approvals</strong>
        <div class="container text-auto mt-3 mb-3">
            <table class="table ml-0">
                <thead>
                    <tr>
                        <th>UserName</th>
                        <th>Email</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" :key="user.id">
                        <td>{{ user.username }}</td>
                        <td>{{ user.email }}</td>
                        <td>
                            <button class="btn btn-success" @click="ApproveSignUpRequest(user.id)">Approve</button>
                            <button class="btn btn-secondary" @click="RejectSignUpRequest(user.id)">Reject</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div v-else>
        <strong>{{ Signup_error_message }}</strong>
    </div>

    <div v-if="newCategories.length > 0" style="margin-top: 20px">
        <strong>Pending New Category Approval</strong>
        <div class="container text-auto mt-3 mb-3">
            <table class="table ml-0">
                <thead>
                    <tr>
                      <th>categoryName</th>
                      <th>Image</th>
                      <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr  v-for="category in newCategories">
                    <td>{{ category.category_name}}</td>
                    <td>{{ category.imagelink }}</td>
                        <td>
                        <button class="btn btn-success" @click="ApproveNewCategory(category.category_id)">Approve</button>
                        <button class="btn btn-secondary" @click="RejectNewCategory(category.category_id)">Reject</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div v-else>
        <strong>{{ newCategory_error_message }}</strong>
    </div>

    <div v-if="updateCategories.length > 0" style="margin-top: 20px">
        <strong>Pending Category Update Approval</strong>
        <div class="container text-auto mt-3 mb-3">
            <table class="table ml-0">
                <thead>
                  <tr>
                    <th>categoryName</th>
                    <th>Image</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                    <tr  v-for="category in updateCategories">
                    <td>{{ category.category_name}}</td>
                    <td>{{ category.imagelink }}</td>
                    <td>
                    <button class="btn btn-success" @click="UpdateCategoryRequest(category.category_id)">Approve </button>

                    <button class="btn btn-secondary" @click="RejectUpdateCategoryRequest(category.category_id)">Reject </button>

                    </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div v-else>
        <strong>{{ updatecategory_error_message }}</strong>
    </div>


    <div v-if="deleteCategories.length > 0" style="margin-top: 20px">
        <strong>Pending Category Delete Approval</strong>
        <div class="container text-auto mt-3 mb-3">
            <table class="table ml-0">
                <thead>
                    <tr>
                      <th>categoryName</th>
                      <th>Image</th>
                      <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr  v-for="category in deleteCategories">
                    <td>{{ category.category_name}}</td>
                    <td>{{ category.imagelink }}</td>
                        <td>
                        <button class="btn btn-success" @click="DeleteCategoryRequest(category.category_id)">Approve</button>
                        <button class="btn btn-secondary" @click="RejectDeleteCategoryRequest(category.category_id)">Reject</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div v-else>
        <strong>{{ deleteCategory_error_message }}</strong>
    </div>


  </div>
  `,
  data(){
    return{
      users:[],
      message:"",
      success:true,
      user:{},
      Signup_error_message:"",
      newCategory_error_message:"",
      updatecategory_error_message:"",
      deleteCategory_error_message:"",
      newCategories:[],
      updateCategories:[],
      deleteCategories:[]
    }
  },
  methods:{
    async getallSignupRequest(){
      const res=await fetch("http://127.0.0.1:5000/api/Admin_approval",{
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token" : localStorage.getItem("Auth_token")
        },
      })
      if (res.ok){
        const data=await res.json()
        this.users=data
        console.log("i am her", this.users.length)
        if(data.length  > 0){
          
          this.success=true
          this.users=data
          this.Signup_message=data.message
        }
        else{
          this.success=false
          this. Signup_error_message="No pending manager sign-up requests."
        
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
        // this.$router.go(0)
        
        const res=await fetch("http://127.0.0.1:5000/api/Admin_approval")
        if (res.ok){
          const data=await res.json()
          this.success=true
          this.users=data
        }
        else{
          this.success=false
          this.message="No pending manager sign-up requests."
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
          this.message="No pending manager sign-up requests."
        }
      }
      else{
        const errorData=await res.json()
        this.success=false
        this.errorMessage=errorData.errorMessage
      }
      

    },

    async getallNewCategoryRequest(){
      const res=await fetch("http://127.0.0.1:5000/api/Admin_Approval_category_request",{
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache",
          "Authentication-Token" : localStorage.getItem("Auth_token")
        },
      })
      if (res.ok){
        console.log("i am here in getallNewCategoryRequest", res.status)
        const data=await res.json()
        console.log("i am here in getallNewCategoryRequest too1", data.length)
        if(data.length  >0){
          console.log("i am here in getallNewCategoryRequest too", data.length)
          this.success=true
          this.newCategories=data.filter(category=> category.approve==false && category.updateRequest==false && category.deleteRequest==false)
          
        }
        else{
          this.success=false
          this.newCategory_error_message="No pending new category requests"
        }
        
      }
      else{
        const errorData=await res.json()
        this.success=false
        this.errorMessage=errorData.errorMessage
      }
    },

    async getallCategoryUpdateRequest(){
      const res=await fetch("http://127.0.0.1:5000/api/categoryUpdateRequest",{
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache",
          "Authentication-Token" : localStorage.getItem("Auth_token")
        },
      })
      if (res.ok){
        const data=await res.json()
        if(data.length  >0){
          
          this.success=true
          this.updateCategories=data.filter(category => category.approve==true && category.updateRequest==true)
        }
        else{
          this.success=false
          this.updatecategory_error_message="No pending category update  requests"
        }
        
      }
      else{
        const errorData=await res.json()
        this.success=false
        this.errorMessage=errorData.errorMessage
      }
    },

    async getallCategoryDeleteRequest(){
      const res=await fetch("http://127.0.0.1:5000/api/categoryDeleteRequest",{
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache",
          "Authentication-Token" : localStorage.getItem("Auth_token")
        },
      })
      if (res.ok){
        const data=await res.json()
        if(data.length  >0){
          
          this.success=true
          this.deleteCategories=data.filter(category=> category.approve==true && category.deleteRequest==true)
        }
        else{
          this.success=false
          this.deleteCategory_error_message="No pending category deletion  requests"
        }
        
      }
      else{
        const errorData=await res.json()
        this.success=false
        this.errorMessage=errorData.errorMessage
      }
    },


    async ApproveNewCategory(id){
      const res=await fetch(`http://127.0.0.1:5000/api/Admin_Approval_category_request/${id}`,{
        method: "put",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache",
          "Authentication-Token" : localStorage.getItem("Auth_token")
        },
      })
      if (res.ok){
        alert("approved New category Request")
        const res=await fetch("http://127.0.0.1:5000/api/Admin_Approval_category_request") // reload the page
        if (res.ok){
          const data=await res.json()
          this.success=true
          this.newCategories=data
        }
        
        else{
          this.success=false
          this.error_message="No pending new category requests"
        }
        
      }
      else{
        const errorData=await res.json()
        this.success=false
        this.errorMessage=errorData.errorMessage
      }
    },


    async RejectNewCategory(id){
      const res=await fetch(`http://127.0.0.1:5000/api/Admin_Approval_category_request/${id}`,{
        method: "delete",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache",
          "Authentication-Token" : localStorage.getItem("Auth_token")
        },
      })
      if (res.ok){
        alert("Rejected New category Request")
        const res=await fetch("http://127.0.0.1:5000/api/Admin_Approval_category_request") // reload the current page
        if (res.ok){
          const data=await res.json()
          this.success=true
          this.newCategories=data
        }
        
        else{
          this.success=false
          this.error_message="No pending new category requests"
        }
        
      }
      else{
        const errorData=await res.json()
        this.success=false
        this.errorMessage=errorData.errorMessage
      }
    },


    async UpdateCategoryRequest(id){
      const res=await fetch(`http://127.0.0.1:5000/api/categoryUpdateRequest/${id}`,{
        method: "put",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache",
          "Authentication-Token" : localStorage.getItem("Auth_token")
        },
      })
      if (res.ok){
        alert("approved update category Request")
        const res=await fetch("http://127.0.0.1:5000/api/categoryUpdateRequest") // reload the page
        if (res.ok){
          const data=await res.json()
          this.success=true
          this.updateCategories=data
        }
        
        else{
          this.success=false
          this.updatecategory_error_message="No pending category update requests"
        }
        
      }
      else{
        const errorData=await res.json()
        this.success=false
        this.errorMessage=errorData.errorMessage
      }
    },


    async RejectUpdateCategoryRequest(id){
      const res=await fetch(`http://127.0.0.1:5000/api/rejectCategoryUpdateRequest/${id}`,{
        method: "put",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache",
          "Authentication-Token" : localStorage.getItem("Auth_token")
        },
      })
      if (res.ok){
        alert("rejected the update category Request")
        const res=await fetch("http://127.0.0.1:5000/api/categoryUpdateRequest") // reload the page
        if (res.ok){
          const data=await res.json()
          this.success=true
          this.updateCategories=data
        }
        
        else{
          this.success=false
          this.error_message="No pending category update requests"
        }
        
      }
      else{
        const errorData=await res.json()
        this.success=false
        this.errorMessage=errorData.errorMessage
      }
    },



    


    async DeleteCategoryRequest(id){
      const res=await fetch(`http://127.0.0.1:5000/api/categoryDeleteRequest/${id}`,{
        method: "delete",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache",
          "Authentication-Token" : localStorage.getItem("Auth_token")
        },
      })
      if (res.ok){
        alert("approved delete category Request")
        const res=await fetch("http://127.0.0.1:5000/api/categoryDeleteRequest") // reload the page
        if (res.ok){
          const data=await res.json()
          this.success=true
          this.deleteCategories=data
        }
        
        else{
          this.success=false
          this.error_message="No pending category deletion requests"
        }
        
      }
      else{
        const errorData=await res.json()
        this.success=false
        this.errorMessage=errorData.errorMessage
      }
    },

    async RejectDeleteCategoryRequest(id){
      const res=await fetch(`http://127.0.0.1:5000/api/rejectCategoryDeleteRequest/${id}`,{
        method: "put",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache",
          "Authentication-Token" : localStorage.getItem("Auth_token")
        },
      })
      if (res.ok){
        alert("rejected the update category Request")
        const res=await fetch("http://127.0.0.1:5000/api/categoryDeleteRequest") // reload the page
        if (res.ok){
          const data=await res.json()
          this.success=true
          this.deleteCategories=data
        }
        
        else{
          this.success=false
          this.error_message="No pending category deletion requests"
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
    this.getallNewCategoryRequest()
    this.getallCategoryUpdateRequest()
    this.getallCategoryDeleteRequest()
  },
}
export default admin
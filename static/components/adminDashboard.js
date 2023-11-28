import userService from "./userService.js"
const admin = {
  template: `
  <div>
    <div v-if="successfirst"><h2>Welcome Back  {{ user.username }}</h2>

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
                    <button type="button" class="btn btn-success" style="background-color: rgb(76, 175, 80)" data-bs-toggle="modal" data-bs-target="#exampleModal" @click.prevent="showEditUser()" >
                      Edit Profile
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<br>
<h5>Pending Manager Signup Approvals</h5>
    <div v-if="users.length > 0" style="margin-top: 20px">
        
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
                            <button class="btn btn-success" style="background-color: rgb(76, 175, 80)" @click="ApproveSignUpRequest(user.id)">Approve</button>
                            <button class="btn btn-danger" style="background-color: rgb(244, 67, 54);" @click="RejectSignUpRequest(user.id)">Reject</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div v-else>
    <div class="px-3  py-2"> {{ Signup_error_message }}</div>
    </div>

    <h5>Pending New Category Approval</h5>
    <div v-if="newCategories.length > 0" style="margin-top: 20px">
        
        <div class="container text-auto mt-3 mb-3">
            <table class="table ml-0">
                <thead>
                    <tr>
                      <th>Category Name</th>
                      <th>Image</th>
                      <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr  v-for="category in newCategories">
                    <td>{{ category.category_name}}</td>
                    <td>{{ category.imagelink }}</td>
                        <td>
                        <button class="btn btn-success" style="background-color: rgb(76, 175, 80)" @click="ApproveNewCategory(category.category_id)">Approve</button>
                        <button class="btn btn-danger" style="background-color: rgb(244, 67, 54);" @click="RejectNewCategory(category.category_id)">Reject</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div v-else>
        <div class="px-3 py-2">{{ newCategory_error_message }}</div>
    </div>

    <h5>Pending Category Update Approval</h5>
    <div v-if="updateCategories.length > 0" style="margin-top: 20px">
        <div class="container text-auto mt-3 mb-3">
            <table class="table ml-0">
                <thead>
                  <tr>
                    <th>Category Name</th>
                    <th>Image</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                    <tr  v-for="category in updateCategories">
                    <td>{{ category.category_name}}</td>
                    <td>{{ category.imagelink }}</td>
                    <td>
                    <button class="btn btn-success" style="background-color: rgb(76, 175, 80)" @click="UpdateCategoryRequest(category.category_id)">Approve </button>

                    <button class="btn btn-danger" style="background-color: rgb(244, 67, 54);" @click="RejectUpdateCategoryRequest(category.category_id)">Reject </button>

                    </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div v-else>
        <div class="px-3 py-2">{{ updatecategory_error_message }}</div>
    </div>

    <h5>Pending Category Delete Approval</h5>
    <div v-if="deleteCategories.length > 0" style="margin-top: 20px">
        <div class="container text-auto mt-3 mb-3">
            <table class="table ml-0">
                <thead>
                    <tr>
                      <th>Category Name</th>
                      <th>Image</th>
                      <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr  v-for="category in deleteCategories">
                    <td>{{ category.category_name}}</td>
                    <td>{{ category.imagelink }}</td>
                        <td>
                        <button class="btn btn-success" style="background-color: rgb(76, 175, 80)" @click="DeleteCategoryRequest(category.category_id)">Approve</button>
                        <button class="btn btn-danger" style="background-color: rgb(244, 67, 54);" @click="RejectDeleteCategoryRequest(category.category_id)">Reject</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div v-else>
        <div class="px-3 py-2">{{ deleteCategory_error_message }}</div>
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
                      <button type="button" @click="updateAdmin" class="btn btn-success" style="background-color: rgb(244, 67, 54)">
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
      users: [],
      message: "",
      success: true,
      user: {},
      Signup_error_message: "",
      newCategory_error_message: "",
      updatecategory_error_message: "",
      deleteCategory_error_message: "",
      newCategories: [],
      updateCategories: [],
      deleteCategories: [],
      apiBaseUrl: "http://127.0.0.1:5000/api",
      error_message: "",
      successfirst:true
    }
  },
  methods: {
    async getallSignupRequest() {
      const res = await fetch(`${this.apiBaseUrl}/Admin_approval`, {
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("Auth_token")
        },
      })
      if (res.ok) {
        const data = await res.json()
        this.users = data

        //console.log("i am her", this.users.length)
        if (data.length > 0) {

          this.success = true
          this.users = data
          this.Signup_message = data.message
        }
        else {
          this.success = false
          this.Signup_error_message = "No pending manager sign-up requests."
        }
      }
      else {
        const errorData = await res.json()
        this.success = false
        this.errorMessage = errorData.errorMessage
      }
    },
    async getAdmin() {
      const data = await userService.methods.getUser()
      console.log(data)
      this.user = data
    },
    async updateAdmin() {
      const res = await fetch(`${this.apiBaseUrl}/user`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("Auth_token")
        },
        body: JSON.stringify(this.user),


      })
      console.log("rse", res.status)
      if (res.ok) {
        const data = await res.json()
        this.user = data
        this.getAdmin()
        this.$router.go(0)
      }
      else {
        const errorData = await res.json()
        this.success = false
        this.error_message = errorData.error_message
      }
    },

    async showEditUser() {
      console.log(" iam inside show")
      this.EditUser = this.user
      console.log(" iam inside show after")
    },



    async ApproveSignUpRequest(id) {
      const res = await fetch(`${this.apiBaseUrl}/Admin_approval/${id}`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache",
          "Authentication-Token": localStorage.getItem("Auth_token")
        },


      })
      if (res.ok) {
        alert("approved manager SignUp Request")
        // this.$router.go(0)

        const res = await fetch(`${this.apiBaseUrl}/Admin_approval`)
        if (res.ok) {
          const data = await res.json()
          this.success = true
          this.users = data
        }
        else {
          this.success = false
          this.message = "No pending manager sign-up requests."
        }

      }
      else {
        const errorData = await res.json()
        this.success = false
        this.errorMessage = errorData.errorMessage
      }


    },
    async RejectSignUpRequest(id) {

      const res = await fetch(`${this.apiBaseUrl}/Admin_reject/${id}`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache",
          "Authentication-Token": localStorage.getItem("Auth_token")
        },


      })
      if (res.ok) {
        alert("Rejected manager SignUp Request")
        const res = await fetch(`${this.apiBaseUrl}/Admin_approval`)
        if (res.ok) {
          const data = await res.json()
          this.success = true
          this.users = data
        }
        else {
          this.success = false
          this.message = "No pending manager sign-up requests."
        }
      }
      else {
        const errorData = await res.json()
        this.success = false
        this.errorMessage = errorData.errorMessage
      }


    },

    async getallNewCategoryRequest() {
      const res = await fetch(`${this.apiBaseUrl}/Admin_Approval_category_request`, {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache",
          "Authentication-Token": localStorage.getItem("Auth_token")
        },
      })
      if (res.ok) {
        // console.log("i am here in getallNewCategoryRequest", res.status)
        const data = await res.json()
        if (data.length > 0) {
          console.log("i am here in getallNewCategoryRequest too", data.length)
          this.success = true
          this.newCategories = data.filter(category => category.approve == false && category.updateRequest == false && category.deleteRequest == false)

        }
        else {
          this.success = false
          this.newCategory_error_message = "No pending new category requests"
        }

      }
      else {
        const errorData = await res.json()
        this.success = false
        this.errorMessage = errorData.errorMessage
      }
    },

    async getallCategoryUpdateRequest() {
      const res = await fetch(`${this.apiBaseUrl}/categoryUpdateRequest`, {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache",
          "Authentication-Token": localStorage.getItem("Auth_token")
        },
      })
      if (res.ok) {
        const data = await res.json()
        if (data.length > 0) {

          this.success = true
          this.updateCategories = data.filter(category => category.approve == true && category.updateRequest == true)
        }
        else {
          this.success = false
          this.updatecategory_error_message = "No pending category update  requests"
        }

      }
      else {
        const errorData = await res.json()
        this.success = false
        this.errorMessage = errorData.errorMessage
      }
    },

    async getallCategoryDeleteRequest() {
      const res = await fetch(`${this.apiBaseUrl}/categoryDeleteRequest`, {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache",
          "Authentication-Token": localStorage.getItem("Auth_token")
        },
      })
      if (res.ok) {
        const data = await res.json()
        if (data.length > 0) {

          this.success = true
          this.deleteCategories = data.filter(category => category.approve == true && category.deleteRequest == true)
        }
        else {
          this.success = false
          this.deleteCategory_error_message = "No pending category deletion  requests"
        }

      }
      else {
        const errorData = await res.json()
        this.success = false
        this.errorMessage = errorData.errorMessage
      }
    },


    async ApproveNewCategory(id) {
      const res = await fetch(`${this.apiBaseUrl}/Admin_Approval_category_request/${id}`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache",
          "Authentication-Token": localStorage.getItem("Auth_token")
        },
      })
      if (res.ok) {
        alert("approved New category Request")
        const res = await fetch(`${this.apiBaseUrl}/Admin_Approval_category_request`) // reload the page
        if (res.ok) {
          const data = await res.json()
          this.success = true
          this.newCategories = data
        }

        else {
          this.success = false
          this.error_message = "No pending new category requests"
        }

      }
      else {
        const errorData = await res.json()
        this.success = false
        this.errorMessage = errorData.errorMessage
      }
    },


    async RejectNewCategory(id) {
      const res = await fetch(`${this.apiBaseUrl}/Admin_Approval_category_request/${id}`, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache",
          "Authentication-Token": localStorage.getItem("Auth_token")
        },
      })
      if (res.ok) {
        alert("Rejected New category Request")
        const res = await fetch(`${this.apiBaseUrl}/Admin_Approval_category_request`) // reload the current page
        if (res.ok) {
          const data = await res.json()
          this.success = true
          this.newCategories = data
        }

        else {
          this.success = false
          this.error_message = "No pending new category requests"
        }

      }
      else {
        const errorData = await res.json()
        this.success = false
        this.errorMessage = errorData.errorMessage
      }
    },


    async UpdateCategoryRequest(id) {
      const res = await fetch(`${this.apiBaseUrl}/categoryUpdateRequest/${id}`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache",
          "Authentication-Token": localStorage.getItem("Auth_token")
        },
      })
      if (res.ok) {
        alert("approved update category Request")
        const res = await fetch(`${this.apiBaseUrl}/categoryUpdateRequest`) // reload the page
        if (res.ok) {
          const data = await res.json()
          this.success = true
          this.updateCategories = data
        }

        else {
          this.success = false
          this.updatecategory_error_message = "No pending category update requests"
        }

      }
      else {
        const errorData = await res.json()
        this.success = false
        this.errorMessage = errorData.errorMessage
      }
    },


    async RejectUpdateCategoryRequest(id) {
      const res = await fetch(`${this.apiBaseUrl}/rejectCategoryUpdateRequest/${id}`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache",
          "Authentication-Token": localStorage.getItem("Auth_token")
        },
      })
      if (res.ok) {
        alert("rejected the update category Request")
        this.getAdmin()
      //   const res = await fetch(`${this.apiBaseUrl}/categoryUpdateRequest`) // reload the page
      //   if (res.ok) {
      //     const data = await res.json()
      //     this.success = true
      //     this.updateCategories = data
      //   }

      //   else {
      //     this.success = false
      //     this.error_message = "No pending category update requests"
      //   }

      }
      else {
        const errorData = await res.json()
        this.success = false
        this.errorMessage = errorData.errorMessage
      }
    },






    async DeleteCategoryRequest(id) {
      const res = await fetch(`${this.apiBaseUrl}/categoryDeleteRequest/${id}`, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache",
          "Authentication-Token": localStorage.getItem("Auth_token")
        },
      })
      if (res.ok) {
        alert("approved delete category Request")
        const res = await fetch(`${this.apiBaseUrl}/categoryDeleteRequest`) // reload the page
        if (res.ok) {
          const data = await res.json()
          this.success = true
          this.deleteCategories = data
        }

        else {
          this.success = false
          this.error_message = "No pending category deletion requests"
        }

      }
      else {
        const errorData = await res.json()
        this.success = false
        this.errorMessage = errorData.errorMessage
      }
    },

    async RejectDeleteCategoryRequest(id) {
      const res = await fetch(`${this.apiBaseUrl}/rejectCategoryDeleteRequest/${id}`, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache",
          "Authentication-Token": localStorage.getItem("Auth_token")
        },
      })
      if (res.ok) {
        alert("rejected the update category Request")
        const res = await fetch(`${this.apiBaseUrl}/categoryDeleteRequest`) // reload the page
        if (res.ok) {
          const data = await res.json()
          this.success = true
          this.deleteCategories = data
        }

        else {
          this.success = false
          this.error_message = "No pending category deletion requests"
        }

      }
      else {
        const errorData = await res.json()
        this.success = false
        this.errorMessage = errorData.errorMessage
      }
    },






  },

  async mounted() {
    if (localStorage.getItem("Auth_token")) {
      const userid = localStorage.getItem("user_id")
      console.log("userid", userid)
      const res = await fetch(`${this.apiBaseUrl}/user`, {
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("Auth_token")
        },
      })
      if (res.ok) {
        const userdata = await res.json()
        console.log("userdata", userdata.id)
        if (userdata.roles.some(role => role.name == "Admin")) {
          this.success = true
          this.getallSignupRequest();
          this.getAdmin()
          this.getallNewCategoryRequest()
          this.getallCategoryUpdateRequest()
          this.getallCategoryDeleteRequest()
        }
        else {
          this.successfirst = false
          this.error_message = "You don't have permission to access this page."
        }
      }
      else {
        this.successfirst = false
        this.error_message = "You are not authorized to access this page. Please log in"
      }
    }
    else {
      this.successfirst = false
      this.error_message = "You are not authorized to access this page. Please log in"
    }
  },
}
export default admin
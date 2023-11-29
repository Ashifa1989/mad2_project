import userService from "./userService.js"
const profile = {
    template: `
    <div>
    <div v-if="success"> 
    <div class="container">
    <h1>Profile Page</h1>
    <div class="row">
      <div class="col-4">
        <div class="card">
          <img src="https://i.pinimg.com/originals/f9/75/81/f9758151b717582c500f0dcc33beca4f.png" class="card-img-top" alt="Profile Picture">
          <div class="card-body">
            <h5 class="card-title">{{ user.username }}</h5>
            <p class="card-text"> 
            <div>{{ user.email }}</div> </p>
            <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal" @click.prevent="showEditUser()" >
            Edit Profile
          </button>
          </div>
        </div>
      </div>
      <div class="col-8">
        <div class="list-group">
          <router-link to="/userOrder" class="list-group-item list-group-item-action active">
            Order History
          </router-link>
          <router-link to="/address" class="list-group-item list-group-item-action">
          Address List</router-link>
          <router-link to='/payment'  class="list-group-item list-group-item-action">Payment List</router-link>
        </div>
      </div>
    </div>
  </div>
    </div>
    <div v-else>{{ error_message }}</div>     

        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h1 class="modal-title fs-5" id="exampleModalLabel">Update User Details</h1>
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
                      <button type="button" @click="updateUser()" class="btn btn-success" style="background-color: rgb(76, 175, 80)">
                      Save</button>
                    </div>
                    <div v-if="!success">{{ error_message }}</div>
              </div>
          </div>
        </div>
        </div>

    </div>`,
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
        async updateUser() {
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
                // const data=await res.json()
                // this.EditUser = data
                this.$router.go(0)
            }
            else {
                const errorData = await res.json()
                this.error_message = errorData.error_message
            }
        },
        async getCustomer(){
            const data=await userService.methods.getUser()
            this.user=data
            
          },
        // async getUser() {
        //     const res = await fetch(`${this.apiBaseUrl}/user`, {
        //         headers: {
        //             "Content-Type": "application/json",
        //             "Authentication-Token": localStorage.getItem("Auth_token")
        //         },

        //     })
        //     console.log(res.status)
        //     if (res.status == 401) {
        //         const data = await res.json()
        //         console.log("no user found", data);
        //         this.success = false
        //         this.error_message = "not an autheticated user"
        //     }
        //     else if (res.ok) {
        //         const data = await res.json()
        //         this.user = data
        //         console.log(data)
        //     }
        //     else {
        //         const errorData = await res.json();
        //         console.log("no user found", errorData);

        //         this.success = false
        //         this.error_message = errorData.error_message
        //     }
        // },
        async showEditUser() {
            this.EditUser = this.user
        }
    },
    async mounted() {
        if(localStorage.getItem("Auth_token")){ 
         this.getCustomer()
        }
        else{
            this.success=false
            this.error_message="You are not authorized to access this page. Please log in"
        }
}
}

export default profile


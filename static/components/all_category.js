

const all_category = {
  template: `
    <div >
    <div v-if="categories.length>0">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">category Name</th>
            <th scope="col">ImageLInk</th>
            <th scope="col">Action</th>
            
          </tr>
        </thead>
        <tbody>
            <tr  v-if="success" v-for="category in categories">
              <td>{{ category.category_name}}</td>
              <td>{{ category.imagelink }}</td>
              <td>            
              <button type="button"  class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal" @click.prevent="setSelectedCategory(category)" >
                Update
              </button>
              </td>              
              <td><button class="btn btn-success"  @click.prevent="deleteCategory(category.category_id)">Delete</button></td>
              
            </tr>
            <tr v-else>
                {{ error_message }}
            </tr>
           
        </tbody>
        </table>
        </div>
        <div v-else><strong>"Currently, there are no categories available. You can get started by creating a new category."</strong></div> 
        
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h1 class="modal-title fs-5" id="exampleModalLabel">Add/update category</h1>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <div>
                      <label for="exampleFormControlInput1" class="form-label">Name</label>
                        <input type="text" class="form-control" v-model="cat.category_name">
                      </div>
                      <div>
                        <label class="form-label">ImageLInk:</label>
                        <input type="text" class="form-control" v-model="cat.imagelink">
                      </div>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                      <button type="button" @click="Create_update_category()" class="btn btn-success">Save</button>
                    </div>
                    <div v-if="success">{{ message }}</div>
                    <div v-else>{{ error_message }}</div>
              </div>
          </div>
        </div>
                        
      <button type="button"  class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal" @click.prevent="setcategory()" >
              Create Category
      </button>       
        
    </div>
    `,
  data() {
    return {
      categories: [{
        category_name: "",
        imagelink: "",
        category_id: ""

      }],
      cat: {
        category_name: "",
        imagelink: "",
        category_id: ""
      },
      success: true,
      error_message: "",
      message:"",
      
    }
  },
  methods: {
    async getCategories() {
      const response = await fetch("http://127.0.0.1:5000/api/category",{
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token" : localStorage.getItem("Auth_token")
        },
      });
      console.log(response)
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        this.categories = data.filter(category=>category.approve==true );
      }
      else {
        const errorData = await response.json()
        this.success = false
        this.error_message = errorData.error_message
      }
    },

    async setSelectedCategory(selCategory) {
      this.cat = selCategory;
    },
    async setcategory() {
      this.cat = {};
    },

    async deleteCategory(id) {
      const res = await fetch(`http://127.0.0.1:5000/api/category/${id}`, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token" : localStorage.getItem("Auth_token")
        },

      })
      if (res.ok) {
        const data=await res.json()
        console.log(data)
        this.message=data.message
        alert(this.message)
        this.$router.go(0)
        // if (data.deleteRequest == false){
        //   const response = await fetch("http://127.0.0.1:5000/api/category");
        //   if (response.ok) {
        //     const data = await response.json();
        //     this.categories = data.filter(category=>category.approve==true);
            
        //   }
        //   else {
        //     const errorData = await response.json()
        //     this.success = false
        //     this.error_message = errorData.error_message
        //   }
        // }
        // else {
        //   alert("please wait for admin approval")
        //   this.success=true
        //   this.message=data.message
        //   const productApprovalres=await fetch("/delete_category_approval_request")
        //       if (productApprovalres.ok){
        //       const productApprovaldata= await productApprovalres.json()
        //       console.log("sending request for approval", productApprovaldata)
        //       }
        //   const response = await fetch("http://127.0.0.1:5000/api/category");
        //   if (response.ok) {
        //     const data = await response.json();
        //     this.categories = data.filter(category=>category.approve==true);
        //     this.message=""
        //   } 
        //   else {
        //     const errorData = await response.json()
        //     this.success = false
        //     this.error_message = errorData.error_message
        //   } 
        // }  
      }
      else {}
        const errorData = await res.json();
        this.message = errorData.error_message;
      },
    


    async Create_update_category() {
      console.log(this.cat)
      if (this.cat.category_id > 0) {
        const res = await fetch(`http://127.0.0.1:5000/api/category/${this.cat.category_id}`, {
          method: "put",
          headers: {
            "Content-Type": "application/json",
            // "Cache-Control": "no-store, no-cache",
            "Authentication-Token" : localStorage.getItem("Auth_token")
          },
          body: JSON.stringify(this.cat)
        })
        if (res.ok) {
            const data=await res.json()
            this.success=true
            this.message=data.message
            alert(this.message)
            this.$router.go(0)
            // const response = await fetch("http://127.0.0.1:5000/api/category");
            // console.log(response)
            // if (response.ok) {
            //   const data = await response.json();
            //   console.log(data);
            //   this.categories = data.filter(category=>category.approve==true );
            // }
            // else {
            //   const errorData = await response.json()
            //   this.success = false
            //   this.error_message = errorData.error_message
            // } 
            
          // }
          // else {
          //   alert("category Updates initialized, please wait for admin approval")
          //   this.success=true
          //   this.message=data.message
          //   const productApprovalres=await fetch(`/update_category_approval_request/${this.cat.category_id }`)
          //       if (productApprovalres.ok){
          //         const productApprovaldata= await productApprovalres.json()
          //         console.log("sending request for approval", productApprovaldata)
                
          
          //         const response = await fetch("http://127.0.0.1:5000/api/category");
          //         if (response.ok) {
          //         const data = await response.json();
          //         this.categories = data.filter(category=>category.approve==true && category.updateRequest == false && category.deleteRequest==false);
          //         this.message=""
          //         }
          //         else {
          //           const errorData = await response.json()
          //           this.success = false
          //           this.error_message = errorData.error_message
          //         } 
          //       }
          //       else {
          //         const errorData = await res.json();
          //         this.error_message = errorData.error_message;
          //       }  
          // }
        }
        else {
          const errorData = await res.json();
          this.error_message = errorData.error_message;
        }  
       
      }
      else {
        const res = await fetch("http://127.0.0.1:5000/api/category", {
          method: "post",
          headers: {
            "content-type": "application/json",
            "Authentication-Token" : localStorage.getItem("Auth_token")
          },
          body: JSON.stringify(this.cat),
        })
        console.log(res.status)
        if (res.ok) {
          const data=await res.json()
          this.message=data.message
          alert(this.message)
          this.$router.go(0)
          // if (data.approve == true && data.updateRequest == false){
            // const response = await fetch("http://127.0.0.1:5000/api/category");
            // if (response.ok) {
            //   const data = await response.json();
            //   this.categories = data.filter(category=>category.approve==true );
            // }
            // else {
            //   const errorData = await response.json()
            //   this.success = false
            //   this.error_message = errorData.error_message
            // } 
          // }
        //   else if(data.approve === false && data.updateRequest == false) {
        //   console.log("i am here in else block of add category");

        //     alert("Addition of new category initialized, please wait for admin approval.")
        //     this.success=true
        //     this.message=data.message
        //     const productApprovalres=await fetch("/new_category_approval_request")
        //       if (productApprovalres.ok){
        //         const productApprovaldata= await productApprovalres.json()
        //         console.log("sending request for approval", productApprovaldata)
                
        //         const response = await fetch("http://127.0.0.1:5000/api/category");
        //         if (response.ok) {
        //         const data = await response.json();
        //         this.categories = data
        //         this.message=""
        //         }
        //         else {
        //           const errorData = await response.json()
        //           this.success = false
        //           this.error_message = errorData.error_message
        //         }   
        //       }
        //       else {
        //         const errorData = await res.json()
        //         this.success = false
        //         this.error_message = errorData.error_message
        //         console.log(this.error_message)
        //       }
         }
          else {
            const errorData = await res.json()
            this.success = false
            this.error_message = errorData.error_message
            console.log(this.error_message)
          
        }
      }
       
    }

  },
  mounted() {
    this.getCategories();
  }
}

export default all_category
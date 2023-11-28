

const all_category = {
  template: `
    <div>
    <div v-if="successfirst">
    <div v-if="categories.length>0">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Category Name</th>
            <th scope="col">Image Link</th>
            <th scope="col">Action</th>
            
          </tr>
        </thead>
        <tbody>
            <tr  v-if="success" v-for="category in categories">
              <td>{{ category.category_name}}</td>
              <td>{{ category.imagelink }}</td>
              <td>            
              <button type="button" class="btn btn-success" style="background-color: rgb(76, 175, 80)" data-bs-toggle="modal" data-bs-target="#exampleModal" @click.prevent="setSelectedCategory(category)" >
                Update
              </button>
              </td>              
              <td><button  class="btn btn-danger" style="background-color: rgb(244, 67, 54);"  @click.prevent="deleteCategory(category.category_id)">Delete</button></td>
              
            </tr>
            <tr v-else>
                {{ error_message }}
            </tr>
           
        </tbody>
        </table>
        </div>
        <div v-else><strong>"Currently, there are no categories available. You can get started by creating a new category."</strong></div> 
        <button type="button"  class="btn btn-success" style="background-color: rgb(76, 175, 80)" data-bs-toggle="modal" data-bs-target="#exampleModal" @click.prevent="setcategory()" >
              Create Category
        </button> 
      </div>
      <div v-else> {{ error_message }}</div> 


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
                        <label class="form-label">Image Link:</label>
                        <input type="text" class="form-control" v-model="cat.imagelink">
                      </div>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-dark" data-bs-dismiss="modal">Close</button>
                      <button type="button"class="btn btn-success" style="background-color: rgb(76, 175, 80)" @click="Create_update_category()" >Save</button>
                    </div>
                    <div v-if="success">{{ message }}</div>
                    <div v-else>{{ error_message }}</div>
              </div>
          </div>
        </div>
                        
            
       
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
      successfirst:true
      
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
        this.getCategories()
        console.log("getCategories called")
      }
      
      else {
        const errorData = await res.json();
        this.message = errorData.error_message;
      }
    },
    async Create_update_category() {
      console.log(this.cat)
      if (this.cat.category_id > 0) {
        const res = await fetch(`http://127.0.0.1:5000/api/category/${this.cat.category_id}`, {
          method: "put",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token" : localStorage.getItem("Auth_token")
          },
          body: JSON.stringify(this.cat)
        })
        if (res.ok) {
            const data=await res.json()
            this.success=true
            this.message=data.message
            alert(this.message)
            this.getCategories()
            
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
          this.getCategories()
          // this.$router.go(0)
          
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
    if(localStorage.getItem("Auth_token")){ 
      this.getCategories();
     }
    else{
      this.successfirst=false
      this.error_message="You are not authorized to access this page. Please log in"
     }
    
  }
}

export default all_category
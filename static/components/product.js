
const product = {
    template: `<div>
    <div v-if="successfirst">
    <div v-if="success"><strong> {{ message }}</strong></div>
    <div v-else><strong> {{ error_message }}</strong></div>
    <form >
        <div class="mb-3">
            <label for="productName" class="form-label">Product Name:</label>
            <input type="text" class="form-control" id="productName" placeholder="Name" v-model="product.product_name" required></input>
        </div>
        <div class="mb-3">   
            <label for="category_id" class="form-label" >Category:</label>
            <select v-model="product.Catagory_id" class="form-control" >
            <option disabled value="">category name</option>
            <option v-for="category in categories" :value="category.category_id" :key="category.category_id">{{ category.category_name }}</option>
            </select>
        </div>
        <div class="mb-3">   
            <label for="Description" class="form-label" >Description:</label>
            <input type="text" class="form-control"  id="Description" v-model="product.Description" placeholder="Description"></input>
        </div>
        <div class="mb-3">   
            <label for="price_per_unit" class="form-label" >Price per unit:</label>
            <input type="text" class="form-control"  id="price_per_unit" v-model="product.price_per_unit" placeholder="Price per unit"></input>
        </div>
        <div class="mb-3">
            <label for="quantity" class="form-label">Quantity:</label>
                <select class="form-select" id="quantity" v-model="product.quantity">
                    <option value="kg">kg</option>
                    <option value="L">L</option>
                    <option value="per unit">per unit</option>
                </select>
        </div>
        <div class="mb-3">   
            <label for="stock" class="form-label" >Stock:</label>
            <input type="text" class="form-control"  id="stock" v-model="product.Stock" placeholder="Product in stock"></input>
        </div>
        <div class="mb-3">   
            <label for="image_url" class="form-label" >Image url:</label>
            <input type="url" class="form-control"  id="Image_url" v-model="product.image_url" placeholder="Image url"></input>
        </div>
        <div class="mb-3">   
            <label for="manufacture_date" class="form-label" >Manufacture Date:</label>
            <input type="date" class="form-control"  id="manufacture_date" v-model="product.manufacture_date" placeholder="Manufacture Date"></input>
        </div>
        <div class="mb-3">   
            <label for="expairy_date" class="form-label" > Expairy Date:</label>
            <input type="date" class="form-control"  id="expairy_date" v-model="product.expairy_date" placeholder="Expiry Date"></input>
        </div>
        <button type="button"  @click="create_update_Product()" class="btn btn-success" style="background-color: rgb(76, 175, 80)">Save Product</button>
        
    </form>  
    </div>
    <div v-else>{{ error_message }}</div>
    </div>`,
    data() {
        return {
            product: {
                product_name: "",
                Catagory_id: 0,
                Description: "",
                price_per_unit: 10,
                stock: 100,
                image_url: "",
                manufacture_date: "",
                expairy_date: "",
                category_name: "",
                product_id: 0,

            },
            selectedproductId: 0,
            categories: "",
            success: true,
            error_message: "",
            message:"",
            apiBaseUrl: "http://127.0.0.1:5000/api",
            successfirst:true
        }
    },
    methods: {
        async getCategories() {
            const response = await fetch(`${this.apiBaseUrl}/category`,{
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token" : localStorage.getItem("Auth_token")
                  },
            });
            if (response.ok) {
                const data = await response.json();
                // console.log("approvedata",data)
                this.categories = data.filter(category=> category.approve==true);
                // console.log(this.categories)
            }
            else {
                const errorData =await response.json()
                this.error_message = errorData.error_message
            }
        },

        async getProductDetails() {
            
            this.selectedproductId = this.$route.params.id
            if (this.selectedproductId > 0) {
                //get product details from api using productId and assignb to this.product
                const res = await fetch(`${this.apiBaseUrl}/product/${this.selectedproductId}`,{
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-Token" : localStorage.getItem("Auth_token")
                      },
                })

                if (res.ok) {
                    const data = await res.json()
                    this.product = data
                    this.message=data.message    
                }
                else {
                    const errorData = res.json()
                    this.error_message = errorData.error_message
                }
            }
            else {
                this.product = {}
            }
        },
        async create_update_Product() {
            if (this.selectedproductId == 0) {
                const res = await fetch(`${this.apiBaseUrl}/product`, {
                    method: "post",
                    headers: {
                        "content-type": "application/json",
                        "Cache-Control": "no-store, no-cache",
                        "Authentication-Token" : localStorage.getItem("Auth_token")
                    },
                    body: JSON.stringify(this.product),
                })
                console.log(res)
                if (res.ok) {
                    this.$router.push('/all_product');
                }
                else {
                    const errorData = await res.json()
                    this.success = false
                    this.error_message = errorData.error_message
                }
            }
            else {
                console.log(this.selectedproductId)
                const res = await fetch(`${this.apiBaseUrl}/product/${this.selectedproductId}`, {
                    method: "put",
                    headers: {
                        "content-type": "application/json",
                        "Cache-Control": "no-store, no-cache",
                        "Authentication-Token" : localStorage.getItem("Auth_token")
                    },
                    body: JSON.stringify(this.product),
                })
                console.log(res)
                if (res.ok) {
                    this.success = true
                    this.$router.push('/all_product');
                }
                else {
                    const errorData = await res.json()
                    this.success = false
                    this.error_message = errorData.error_message

                }
            }
        },
        
    },
    mounted() {
        if(localStorage.getItem("Auth_token")){ 
            this.getProductDetails();
            this.getCategories()
          }
          else{
            this.successfirst=false
            this.error_message="You are not authorized to access this page. Please log in"
           }
      
        
    }
}

export default product
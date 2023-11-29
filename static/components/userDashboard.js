// import { tokenValidation } from "../mixins/tokenValidation";
const home = {
  template: `
  <div>
  <div v-if="successfirst">
  <form>
      <div class="search-bar container">
          <div class="row">
              <div class="col ">
                  <select v-model="searchQuery.category_name" class="form-control">
                      <option disabled value="">Category name</option>
                      <option v-for="category in categories" :value="category.category_name" :key="category.category_name">{{ category.category_name }}</option>
                  </select>
              </div>
              <div class="col">
                  <input type="number" class="form-control" placeholder="Min" v-model="searchQuery.min_price"></input>
              </div>
              <div class="col">
                  <input type="number" class="form-control" placeholder="Max" v-model="searchQuery.max_price"></input>
              </div>
              <div class="col">
                  <input type="text" class="form-control" placeholder="Product name" v-model="searchQuery.search_word"></input>
              </div>
              <div class="col">
                  <button class="btn btn-success" @click.prevent="searchProducts">Search</button>
              </div>
          </div>
      </div>
  </form>

  <p></p>
  <div class="row row-cols-1 row-cols-md-4 mb-4 g-4">
    <div v-if="success" v-for="product in products">
      <div class="col">
        <div class="card h-100">
          <img :src=" product.image_url " class="card-img-top" alt="...">
          <div class="card-body">
            
              <h5 class="card-title">{{ product.product_name }}</h5>
              <p class="card-text">{{ product.Description }} </p>
              <div> Price: Rm{{ product.price_per_unit }}/{{ product.quantity}} </div>

              <div style="color: red; padding-top: 30px;" v-if="product.Stock <=0">Out Of Stock</div>
              <div  style="padding-top: 30px;" v-else><button class="btn btn-success " @click.prevent="addtoCart(product)">Add to Cart</button></div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
    {{error_message}}
    </div>
  </div>
  </div>
    <div v-else>
    {{error_message}}
  </div>
      
  </div>`,

  data() {
    return {
      searchQuery: {
        category_name: '',
        min_price: null,
        max_price: null,
        manufacture_date: '',
        search_word: '',
      },
      products: [],
      categories: [],
      product: {
        product_id: 0,
        quantity: 1,
        product_name: "",
      },
      success: true,
      error_message: "",
       apiBaseUrl: "http://127.0.0.1:5000/api/",
       successfirst:true
      
    };
  },
  mounted() {
    if(localStorage.getItem("Auth_token")){ 
      this.getCategories();
      this.searchProducts();
     }
    else{
      this.successfirst=false
      this.error_message="You are not authorized to access this page. Please log in"
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
        this.categories = data.filter(category=>category.approve==true);
        
      }
      else {
        this.categories = []
      }
    //  }
  },


    async searchProducts() {
      const res = await fetch(`${this.apiBaseUrl}/product/search`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          // "Cache-Control": "no-store, no-cache"

        },
        body: JSON.stringify(this.searchQuery)
      })


      if (res.ok) {
        const data = await res.json()
        // console.log("data", data.length)
        if (data.length == 0) {
          
          this.success=false
          this.error_message="sorry!! no product found"
        }
        else {
          this.success=true
          this.products = data
          
        }
      }
      else {
        const errorData = await res.json()
        this.success=false
        this.error_message=errorData.error_message
      }
    },

    
    
    async addtoCart(product) {
      console.log(product.Stock)
      if(product.Stock == 0){
        this.success=false
        this.error_message="currently this product is out of stock"
      
      }
        else{
          this.success=true
        const res = await fetch(`${this.apiBaseUrl}/cart`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": localStorage.getItem("Auth_token")
          },
          body: JSON.stringify({product_id:product.product_id, quantity:1})
        })

        if (res.ok) {
          alert("Item added to cart")
          //this.$router.push("/cart")
        }
        else {
          console.log("something went wrong")
        }
      }
    }
}
}

export default home
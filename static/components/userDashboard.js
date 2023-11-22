// import { tokenValidation } from "../mixins/tokenValidation";
const home = {
  template: `
  <div>
  <form>
      <div class="search-bar container">
          <div class="row">
              <div class="col ">
                  <select v-model="searchQuery.category_name" class="form-control">
                      <option disabled value="">category name</option>
                      <option v-for="category in categories" :value="category.category_name" :key="category.category_name">{{ category.category_name }}</option>
                  </select>
              </div>
              <div class="col">
                  <input type="number" class="form-control" placeholder="min" v-model="searchQuery.min_price"></input>
              </div>
              <div class="col">
                  <input type="number" class="form-control" placeholder="max" v-model="searchQuery.max_price"></input>
              </div>
              <div class="col">
                  <input type="text" class="form-control" placeholder="product name" v-model="searchQuery.search_word"></input>
              </div>
              <div class="col">
                  <button class="btn btn-primary" @click.prevent="searchProducts">Search</button>
              </div>
          </div>
      </div>
  </form>

  <p></p>
  <div class="row row-cols-1 row-cols-md-4 g-4">
    <div v-if="success" v-for="product in products">
      <div class="col">
        <div class="card h-100">
          <img :src=" product.image_url " class="card-img-top" alt="...">
          <div class="card-body">
            <div>
              <h5 class="card-title">{{ product.product_name }}</h5>
              <p class="card-text">{{ product.Description }} </p>
              <div> Price: {{ product.price_per_unit }} </div>
              
            </div>
            <br></br>
              <button class="btn btn-primary" @click.prevent="addtoCart(product.product_id)">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
    {{error_message}}
    </div>
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
      
    };
  },
//   mixins: [
//     tokenValidation
// ],

  
  
  mounted() {
    this.getCategories();
    this.searchProducts();
    // this.validateToken();
  }
  ,
  methods: {
     
  

    async getCategories() {
      // const token=this.validateToken()
      // if (token){
      const response = await fetch("http://127.0.0.1:5000/api/category");
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
      const res = await fetch("http://127.0.0.1:5000/api/product/search", {
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

    // async show_cart_item() {
    //   const res = await fetch(`/api/cart/user/${this.$route.params.id}`)

    //   if (res.ok) {
    //     const data = await res.json()
    //     this.products = data
    //     console.log(data[0].price_per_unit)
    //   }
    //   else {
    //     const errorData = await res.json()
    //     this.success = false
    //     this.error_message = errorData.error_message
    //   }
    // },
    
    async addtoCart(id) {
      this.product.product_id = id
      this.product.quantity = 1
      const res = await fetch(`http://127.0.0.1:5000/api/cart`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("Auth_token")
        },
        body: JSON.stringify(this.product)
      })

      if (res.ok) {
        alert("Item added to cart")
        //this.$router.push("/cart")
      }
      else {
        console.log("something went wrong")
      }
    },
  },
}

export default home
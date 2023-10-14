
const home = {
    template: `<div>
      <form>
      <div class="search-bar">
        
        <select v-model="searchQuery.category_name">
          <option disabled value="">category</option>
            <option v-for="category in categories" :value="category.category_name" :key="category.category_name">
                {{ category.category_name }}
            </option>
            </select>
        <input type="number" class="form-control" placeholder="min" v-model="searchQuery.min_price"/>
        <input type="number" class="form-control" placeholder="max" v-model="searchQuery.max_price"/>
        <input type="text" class="form-control" placeholder="Search for products" v-model="searchQuery.search_word"/>
        <button class="btn btn-primary" @click.prevent="searchProducts">Search</button>
      </div>
      </form>
      <div v-if="success"  v-for="product in products"> 
    <p> {{ product.product_name }} </p>
    <p> {{ product.Description}} </p>
    <p> {{ product.price_per_unit }} </p>
    <p> {{ product.stock }} </p>
    <p> {{ product.image_url }} </p>
    <p> {{ product.manufacture_date }} </p>
    <p> {{ product.expairy_date }} </p>
    
    </div>
    <div v-else>
    {{ error_message }}
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
            products: [
                {
                    product_name: 'Product 1',
                    Description: 'Description for Product 1',
                    price_per_unit: 'Price for Product 1',
                    stock: 'Stock for Product 1',
                    image_url: 'Image URL for Product 1',
                    manufacture_date: 'Manufacture date for Product 1',
                    expairy_date: 'Expiry date for Product 1'
                },
            ],
            categories: [],
            success: true,
            error_message: ""
        };
    },
    mounted() {
        this.getCategories();
        this.all_product ();
    }
    ,
    methods: {
        async all_product () {
            
            const res = await fetch(`http://127.0.0.1:5000/api/product`)
            if (res.ok){
                const data= await res.json()
                this.products = data
                console.log(data)
                
            
            }
            else{
                const errorData = await res.json()
                this.success= false
                this.error_message = errorData.error_message
        }

    },
        async getCategories(){
            const response = await fetch("http://127.0.0.1:5000/api/category");
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                this.categories = data;
            }
            else {
                this.categories = []
            }
        },
        async searchProducts() {
            const res = await fetch("http://127.0.0.1:5000/api/product/search", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-store, no-cache"

                },
                body: JSON.stringify(this.searchQuery)
            })
            console.log("Response status code:", res.status);
            console.log("Response:", res); // Log the entire response

            if (res.ok) {
                const data = await res.json()
                this.products = data
            }
            else {
                const errorData = await res.json();

                this.success = false
                this.error_message = errorData.error_message
            }
        }
    },
}


export default home
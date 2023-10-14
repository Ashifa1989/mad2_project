const search = {
    template: `<div>
    <form>
      <div class="search-bar container"> 
      <div class="row row-cols-auto">       
        <div class="col">
            <select v-model="searchQuery.category_name" class="form-control">
            <option disabled value="">category name</option>
            <option v-for="category in categories" :value="category.category_name" :key="category.category_name">
                {{ category.category_name }}
            </option>
            </select>
        </div>
        <div class="col">
            <input type="number" class="form-control" placeholder="min" v-model="searchQuery.min_price"/>
        </div>
        <div class="col">
            <input type="number" class="form-control" placeholder="max" v-model="searchQuery.max_price"/>
        </div>
        <div class="col">
            <input type="text" class="form-control" placeholder="product name" v-model="searchQuery.search_word"/>
        </div>
        <div class="col">
            <button class="btn btn-primary" @click.prevent="searchProducts">Search</button>
        </div>
      </div>
      </div>
    </form>
    <div class="row row-cols-1 row-cols-md-4 g-4"> 
      <div v-if="success"  v-for="product in products"> 
        <div class="col">
          <div class="card">
            <img src="{{ product.image_url }}" class="card-img-top" alt="...">
            <div class ="card-body">
            <div>
                <h5 class="card-title">{{ product.product_name }}</h5>
                <p class="card-text">{{ product.Description}} </p>
                <div > Price: {{ product.price_per_unit }} </div>
                <a href="#" class="btn btn-primary">Add to cart</a>
                               
            </div>  
            </div>
          </div>
      </div>
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
        this.searchProducts();
    }
    ,
    methods: {

        async getCategories() {
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

export default search
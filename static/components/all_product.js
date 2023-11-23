const all_product = {
  template: `    
    <div>
    
    <div v-if="success">{{ message }}</div>
    <div class="container text-auto  mt-3">
      <div v-if="products.length >0">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Product Name</th>
              <th scope="col">Category</th>
              <th scope="col">Description</th>
              <th scope="col">Stock</th>
              <th scope="col">Price</th>
              <th scope="col">Image Link</th>
              <th scope="col">Manufacture Date</th>
              <th scope="col">Expiry Date</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody> 
              <tr v-if="success" v-for="product in products" :key="product.product_id">
                <td>{{ product.product_name }}</td>
                <td>{{ product.Catagory_id }}</td>
                <td>{{ product.Description }}</td>
                <td>{{ product.Stock }}</td>
                <td>{{product.price_per_unit}}</td>
                <td>{{product.image_url}}</td>
                <td>{{product.manufacture_date}}</td>
                <td>{{product.expairy_date}}</td>        
                <td>
                  <button class="btn btn-success" @click.prevent="openProductDetails(product.product_id)"> Update</button>
                </td>             
                <td>
                  <button class="btn btn-success"  @click.prevent="deleteProduct(product.product_id)" >Delete</button>
                </td>
              </tr>
              <tr v-else>
                {{ error_message }}
              </tr> 
          </tbody>
        </table>
      </div>
        <div v-else><strong>"Currently, there are no products to display. You can start by adding a product now."</strong></div> 
        <button type="button" class="btn btn-success mt-3" @click.prevent="openProductDetails(0)"> AddProduct</button>             
    </div>
        <button  @click="DownloadCSVFile">Download CSV</button>  
    </div>
    `,
  data() {
    return {
      products: [{
        product_name: "",
        Catagory_id: "",
        Description: "",
        price_per_unit: 10,
        Stock: 100,
        image_url: "",
        manufacture_date: "",
        expairy_date: "",


      }],
      Product: {},
      success: true,
      error_message: "",
      message: "",
      notifymessage,
      apiBaseUrl: "http://127.0.0.1:5000/api/"
    }
  },

  methods: {

    async getProducts() {

      const res = await fetch("http://127.0.0.1:5000/api/product",{
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token" : localStorage.getItem("Auth_token")
        },
      });
      console.log(res)
      if (res.ok) {
        const data = await res.json();
        this.products = data;
      }
      else {
        const errorData = await res.json()
        this.success = false
        this.error_message = errorData.error_message
      }
    },
    async deleteProduct(id) {
      const response = await fetch(`http://127.0.0.1:5000/api/product/${id}`, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
          // "Cache-Control": "no-store, no-cache",
          "Authentication-Token" : localStorage.getItem("Auth_token")
        },

      })
      if (response.ok) {
        this.message = "deleted the product successfully"
        alert(this.message)
        this.$router.go(0)
      
       }
    },
    async DownloadCSVFile(){
      const res=await fetch("/DownloadCSVFile")
      if(res.ok){
          const data= await res.json()
          console.log("details of celery job", data)
          window.location.href="/download-file"
          const notifyres=await fetch("/notify_manager_csv_download")
          const notifydata= await notifyres.json()
          this.notifymessage=notifydata.message
      }
  },
    async openProductDetails(id) {
      this.$router.push(`/product/${id}`)      
    },
    
  },
  mounted() {
    this.getProducts();
    
  }
}

export default all_product
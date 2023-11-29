const productInformation={
  template: `
  <div>
  <div class="container">
      <div class="row">
        <div class="col-2">
          
            <img :src="product.image_url"   class="card-img-top" >
            
        </div>
        <div class="col-5">
          <div class="info" style="float: center; width: 50%; text-align: center;">
            <h5 class="card-title">  {{ product.product_name }}</h5>
            <div class="card-text"> Description: {{ product.Description }} </div>
            <div class="card-text"> Manufacture Date: {{ product.manufacture_date}} </div>
            <div class="card-text"> Expiry Date: {{ product.expairy_date}}</div>
            <div class="card-text"> Price: Rm{{ product.price_per_unit }}/{{ product.quantity}} </div>
            <p style="color: red; padding-top: 30px;" v-if="product.Stock <=0">Out Of Stock</p>
            <p  style="padding-top: 30px;" v-else><button class="btn btn-success " @click.prevent="addtoCart(product)">Add to Cart</button></p>
          </div>
          
        </div>
      </div>
    </div>

</div>


</div>

  `,
  data (){
    return{
      product:{},
      apiBaseUrl: "http://127.0.0.1:5000/api"
      
    }
  },
  methods: {
    async productDetails(id){
      console.log(id)
      const res= await fetch(`${this.apiBaseUrl}/product/${id}`,{
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("Auth_token")
        },
      })
      if (res.ok){
        console.log("i am here inside fetch method")
        const data=await res.json()
        console.log(data)
        this.product=data
      }
    }
  },
  async mounted(){
    console.log("inside mounted")
    this.productDetails(this.$route.params.id)
  }
}
export default productInformation
import { useGetAddresses } from './addressService.js'
import { useGetPayments } from './paymentService.js';

const cart = {
  template: `
  <div class="container">
  <main>
    <div class="py-5 text-center">
      <h3>Below are items in your cart. Checkout?</h3>
    </div>

    <div class="row g-5">
      <div class="col-md-5 col-lg-4 order-md-last">
        <h4 class="d-flex justify-content-between align-items-center mb-3">
          <span class="text-primary">Your cart</span>
          <span class="badge bg-primary rounded-pill">{{ products.length }}</span>
        </h4>
        
        <ul class="list-group mb-3">
        <div v-if="success" v-for="product in products">
          <li class="list-group-item d-flex justify-content-between lh-sm">
            <div>
              <h6 class="my-0">{{product.product_name}}  </h6>
              <small class="text-body-secondary">Quantity: {{product.quantity}} </small>
              <br>
              <small class="text-body-secondary">Price per unit: {{product.price_per_unit}}</small>
            </div>
            <span class="text-body-secondary"> Rs. {{product.total_price}}</span>
          </li>
         </div> 
          <li class="list-group-item d-flex justify-content-between"> 
            <strong><span>Total price. Rs.  {{cart_total_amount}} </span></strong>
          </li>
        </ul>
      </div>


      <div class="col-md-7 col-lg-8">
        <h4 class="mb-3">Shipping address</h4>

        <div class="col-md-8">
          <select class="form-select" id="state" required  @change="setSelectedAddress($event)">
            <option value="">Select address</option>
            <option v-for="add in addresses" :value="add.address_id" :key="add.address_id">{{ add.street }}</option>
                    
          </select>
        </div>

        <div class="row g-3">
            <div class="col-8">
              <label for="city" class="form-label">City </label>
              <input type="text" class="form-control" id="city" placeholder="City" v-model="address.city">
            </div>

            <div class="col-md-5">
              <label for="country" class="form-label">State</label>
              <input type="text" class="form-control" id="state1" placeholder="State" v-model="address.state">
            </div>

            <div class="col-md-3">
              <label for="zip" class="form-label">Post code</label>
              <input type="text" class="form-control" id="postcode1" placeholder="" v-model="address.postal_code">
            </div>
        </div>
        
          <hr class="my-4">

          <h4 class="mb-3">Payment method</h4>
          <div class="col-md-8">
          <select class="form-select" id="state" required  @change="setSelectedPayments($event)">
            <option value="">Select address</option>
            <option v-for="pay in payments" :value="pay.payment_id" :key="pay.payment_id">{{ pay.type }}</option>
                    
          </select>
        </div>
        
        <div class="row gy-3">
            <div class="col-md-6">
              <label for="cc-number" class="form-label">Credit card number</label>
              <input type="text" class="form-control" id="cc-number" placeholder="" v-model="payment.card_number">
            </div>

            <div class="col-md-3">
              <label for="cc-expiration" class="form-label">Expiration</label>
              <input type="text" class="form-control" id="cc-expiration" placeholder="" v-model="payment.expiry_date">
              
            </div>

            <div class="col-md-3">
              <label for="cc-cvv" class="form-label">CVV</label>
              <input type="text" class="form-control" id="cc-cvv" placeholder="" v-model="payment.cvv">
              
            </div>
          </div>

          <hr class="my-4">
          <button class="w-30 btn btn-secondary btn-lg col-md-3" type="button" @click.prevent="countinue_shopping" >Continue shopping</button>
          <button class="w-70 btn btn-primary btn-lg col-md-8" type="button" @click.prevent="checkout">Checkout</button>
          
        
      </div>
    </div>
  </main>
</div>
`,
  data() {
    return {
      products: [{
        product_id: 0,
        product_name: "",
        image_url: "",
        quantity: 0,
        price_per_unit: 0,
        total_amount: 0,
        carts: [],
      }],
      success: true,
      cart_total_amount: 0,
      address: {},
      payment:{},
      error_message: "To add to your trolley, you'll need an account.",
      addresses: [],
      payments:[]
    }
  },

  methods: {
    setSelectedAddress(event){
      //console.log(this.address)
      const selectedAddId = event.target.value;
      this.address = this.addresses.filter((a)=> a.address_id == selectedAddId)[0]
      
      //console.log(this.address)
    },
    setSelectedPayments(event){
        const selectedpaymentId=event.target.value;
        this.payment = this.payments.filter((a) => a.payment_id == selectedpaymentId)[0]
    },
    async getCart() {
      const res = await fetch(`http://127.0.0.1:5000/api/cart`, {
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("Auth_token")
        },
      })
      //console.log(res.status)
      if (res.ok) {
        const data = await res.json()
        this.success = true
        this.products = data
        this.cart_total_amount = data.reduce((accum, item) => accum + item.total_price, 0)
      }
      else {
        const errorData = await res.json()
        this.success = false
        this.error_message = errorData.error_message
      }
    },
    async deleteCartItem(id) {
      console.log(id)
      const response = await fetch(`http://127.0.0.1:5000/api/cart/${id}`, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("Auth_token")
        },

      })
      if (response.ok) {
        console.log("cartitem deleted successfully")
        const response = await fetch(`http://127.0.0.1:5000/api/cart`);
        if (response.ok) {
          const data = await response.json();
          this.products = data
        }
      }
      else {
        const errorData = await response.json();
        this.message = errorData.error_message;
      }
    },
    async countinue_shopping() {
      this.$router.push('/search')
    },
    async checkout(){
     
      console.log("add_id",this.address.address_id)
      console.log("pay_id",this.payment.payment_id)
      const res = await fetch("http://127.0.0.1:5000/api/order", {
                    method: "post",
                    headers: {
                        "content-type": "application/json",
                        "Authentication-Token": localStorage.getItem("Auth_token")
                    },
                    body: JSON.stringify(this.address, this.payment )
                })
                console.log(res.status)
                if (res.ok) {
                    const data=await res.json()
                    id=data.order_id
                    this.$router.push('/order/${id}')

                    this.message = console.log("your order is successful.thank you for shopping with us ")
                }
                else {
                    const errorData = await res.json()
                    this.success = false
                    this.error_message = errorData.error_message
                }
    }
  },
  created(){
    this.getAddress = useGetAddresses
    this.getpayments= useGetPayments
  },
  async mounted() {
    this.getCart()
    this.addresses = await this.getAddress()
    this.payments= await this.getpayments()
  }
}

export default cart
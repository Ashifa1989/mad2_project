import { useGetAddresses } from './addressService.js'
import { useGetPayments } from './paymentService.js'

const cart = {
  template: `
  <div>
  <div v-if="successfirst">
  <div class="container">
    
        <div class="py-5 text-center">
            <h3>Below are items in your cart. Checkout?</h3>
        </div>

        <div class="row g-5">
            <div class="col-md-5 col-lg-4 order-md-last">

                <h4 class="d-flex justify-content-between align-items-center mb-3">
                    <span class="text-success">Your cart</span>
                    <span class="badge bg-success rounded-pill">{{ products.length }}</span>
                </h4>

                <ul class="list-group mb-3">
                    <div class="card" style="display: flex; flex-direction: column; align-items: left; justify-content: auto; height: 65vh;">
                      <div v-if="products.length>0">
                        <div v-if="success" v-for="product in products">
                            <li class="list-group-item d-flex justify-content-between lh-sm">
                                <div>
                                    <div><h5 class="my-0 "  
                                    <a  @click="fetchProduct(product.product_id)">
                                    {{product.product.product_name}} </a></h5>
                                    </div>
                                    <div ><small class="text-body-secondary">Quantity: {{product.quantity}} </small></div>
                                    <div>
                                      <button @click="decrementQuantity(product)">-</button>
                                        {{ product.quantity }}
                                      <button @click="incrementQuantity(product)">+</button>
                                    </div>
                                    <div><small class="text-body-secondary">Price per unit:RM {{product.price_per_unit}}</small></div>
                                    
                                
                                
                                </div>
                                <div>
                                <span class="text-body-secondary "> RM {{product.total_price}}</span>
                                
                                <div><a @click="deleteCartItem(product.cart_id)" class="delete-icon text-success">Remove</a></div>
                               
                                </div>
                            </li>
                        </div>

                        <div v-else>
                            <strong> {{ error_message }}</strong>
                            
                        </div>
                      </div>
                      <div v-else><strong>{{ error_message }}</strong></div>
                    </div>
                    <li class="list-group-item d-flex justify-content-between">
                        <strong><span>Total price: RM {{cart_total_amount}} </span></strong>
                    </li>
                </ul>
            </div>

            <div class="col-md-7 col-lg-8">
                <h4 class="mb-3">Shipping address</h4>

                <div class="col-md-8">
                    <select class="form-select" id="state" required @change="setSelectedAddress($event)">
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
                <div> <span style="color: black; margin-up:30px"> Do you want to add new Address?  <a href="/#/address" class="text-success"> click here </a></span> </div>

                <hr class="my-4">
                <h4 class="mb-3">Payment method</h4>
                <div class="col-md-8">
                    <select class="form-select" id="state" required @change="setSelectedPayments($event)">
                        <option value="">Select payment</option>
                        <option v-for="pay in payments" :value="pay.payment_id" :key="pay.payment_id">{{pay.card_number}}({{ pay.type }})</option>
                    </select>
                </div>

                <div class="row gy-3">
                    <div class="col-md-4">
                        <label for="cc-number" class="form-label">Credit card number</label>
                        <input type="text" class="form-control" id="cc-number" placeholder="" v-model="payment.card_number">
                    </div>

                    <div class="col-md-2">
                        <label for="cc-expiration" class="form-label">Expiration</label>
                        <input type="text" class="form-control" id="cc-expiration" placeholder="" v-model="payment.expiry_date">

                    </div>

                    <div class="col-md-2">
                        <label for="cc-cvv" class="form-label">CVV</label>
                        <input type="text" class="form-control" id="cc-cvv" placeholder="" v-model="payment.cvv">

                    </div>
                </div>
                <div> <span style="color: black; margin-up:30px"> Do you want to add new Payment Details?  <a href="/#/payment" class="text-success" > click here </a></span> </div>

                <hr class="my-4">
                <button class="w-30 btn btn-dark btn-lg col-md-3" type="button" @click.prevent="countinue_shopping">Continue shopping</button>
                <button class="btn btn-success btn-lg col-md-6" type="button" style="background-color: rgb(76, 175, 80)" @click.prevent="checkout">Checkout</button>

            </div>
        </div>
</div>
</div>
    <div v-else> {{ error_message }}</div>    
</div>
`,
  data() {
    return {
      products: [],
      success: true,
      cart_total_amount: 0,
      total_price:0,
      address: {},
      payment: {},
      error_message: "Your cart is empty!! Continue shopping to browse and search for items.",
      addresses: [],
      payments: [],
      message: "",
      product: {
        product_id: 0,
        quantity: 1,

      },
      apiBaseUrl: "http://127.0.0.1:5000/api/",
      successfirst:true
    }
  },

  methods: {
    setSelectedAddress(event) {
      //console.log(this.address)
      const selectedAddId = event.target.value;
      this.address = this.addresses.filter((a) => a.address_id == selectedAddId)[0]

      //console.log(this.address)
    },
    setSelectedPayments(event) {
      const selectedpaymentId = event.target.value;
      this.payment = this.payments.filter((a) => a.payment_id == selectedpaymentId)[0]
    },
    async getCart() {
      const res = await fetch(`${this.apiBaseUrl}/cart`, {
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("Auth_token")
        },
      })
      //console.log(res.status)
      if (res.ok) {

        if (res.status == 200) {
          const data = await res.json()
          console.log(data)
          this.success = true
          this.products = data
          this.cart_total_amount = data.reduce((accum, item) => accum + item.total_price, 0)
          this.message = data.message
        }
        else {
          // this.products = []
          this.success = false
          this.error_message = "Your cart is empty!! Continue shopping to browse and search for items."
        }
      }
      else {
        const errorData = await res.json()
        this.success = false
        this.error_message = errorData.error_message
      }
    },
    async deleteCartItem(id) {
      console.log(id)
      const response = await fetch(`${this.apiBaseUrl}/cart/${id}`, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("Auth_token")
        },
      })
      if (response.ok) {
        this.message = "cartitem deleted successfully"
        this.getCart();
        // this.$router.push('/cart')
      }
      else {
        const errorData = await response.json();
        this.message = errorData.error_message;
      }
    },
    async countinue_shopping() {
      this.$router.push('/home')
    },

    async checkout() {
      if (this.address.address_id == 0 || this.payment.payment_id == 0) {
        alert("Please select address and payment method");
        
      }

      //console.log("add_id", this.address.address_id)
      //console.log("pay_id", this.payment.payment_id)
      let ord = {
        "selectedaddress": this.address.address_id,
        "selectedpayment": this.payment.payment_id
      }

      console.log(ord);
      const res = await fetch(`${this.apiBaseUrl}/order`, {
        method: "post",
        headers: {
          "content-type": "application/json",
          "Authentication-Token": localStorage.getItem("Auth_token")
        },
        body: JSON.stringify(ord)
      })

      if (res.ok) {
        const data = await res.json()
        this.message = "your order is successful.thank you for shopping with us "
        let id = data.order_id
        console.log(data)
        this.$router.push(`/order/${id}`)
      }
      else {
        const errorData = await res.json()
        this.success = false
        this.error_message = errorData.error_message
      }
    },
    async incrementQuantity(product) {
          const updateCartResponse = await fetch(`${this.apiBaseUrl}/cart`, {
            method: "post",
            headers: {
              "Content-Type": "application/json",
              "Authentication-Token": localStorage.getItem("Auth_token")
            },
            body: JSON.stringify({ product_id: product.product_id, quantity: 1 })
          });

          if (updateCartResponse.ok) {
            console.log("successfully update the product quantity")
            // this.getCart();
            product.quantity++
            product.total_price=product.quantity*product.price_per_unit
            this.cart_total_amount = this.products.reduce((accum, item) => accum + item.total_price, 0)
            
          }
           else {
            this.success = false
            this.error_message="something went wrong !! please try again";
          }
        },
    async decrementQuantity(product) {
        if (product.quantity > 1) {
          // Update the cart with the new quantity
          const updateCartResponse = await fetch(`${this.apiBaseUrl}/cart`, {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              "Authentication-Token": localStorage.getItem("Auth_token")
            },
            body: JSON.stringify({ product_id: product.product_id, quantity: 1 })
          });

          if (updateCartResponse.ok) {
            //refresh cart using variable
            product.quantity --;
            product.total_price=product.quantity*product.price_per_unit
            this.cart_total_amount = this.products.reduce((accum, item) => accum + item.total_price, 0)
          }
          else {
            this.success = false
            this.error_message="something went wrong !! please try again";
          }
        }
        else {
          this.success = false
          this.error_message = "Quantity less than 1 decrement not allowed"
        }
    },
    async fetchProduct(id){
      this.$router.push(`/productInformation/${id}`)
        }
    
  
  },
  created() {
    this.getAddress = useGetAddresses
    this.getpayments = useGetPayments
    console.log('i am here')
  },
  async mounted() {
    if(localStorage.getItem("Auth_token")){ 
      this.getCart();
      this.addresses = await this.getAddress()

      this.payments = await this.getpayments()
      this.address.address_id = 0;
      this.payment.payment_id = 0;
    }
    else{
      this.successfirst=false
      this.error_message="You are not authorized to access this page. Please log in"
     }  
  }
}

export default cart
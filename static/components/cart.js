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

        <form class="needs-validation" novalidate>
          <div class="row g-3">
            <div class="col-8">
              <label for="address2" class="form-label">City </label>
              <input type="text" class="form-control" id="address2" placeholder="City" v-model="address.city">
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

          <div class="my-3">
            <div class="form-check">
              <input id="credit" name="paymentMethod" type="radio" class="form-check-input" checked required>
              <label class="form-check-label" for="credit">Credit card</label>
            </div>
            <div class="form-check">
              <input id="debit" name="paymentMethod" type="radio" class="form-check-input" required>
              <label class="form-check-label" for="debit">Debit card</label>
            </div>
            <div class="form-check">
              <input id="paypal" name="paymentMethod" type="radio" class="form-check-input" required>
              <label class="form-check-label" for="paypal">PayPal</label>
            </div>
          </div>

          <div class="row gy-3">
            <div class="col-md-6">
              <label for="cc-name" class="form-label">Name on card</label>
              <input type="text" class="form-control" id="cc-name" placeholder="" >
            </div>

            <div class="col-md-6">
              <label for="cc-number" class="form-label">Credit card number</label>
              <input type="text" class="form-control" id="cc-number" placeholder="" >
            </div>

            <div class="col-md-3">
              <label for="cc-expiration" class="form-label">Expiration</label>
              <input type="text" class="form-control" id="cc-expiration" placeholder="" >
              
            </div>

            <div class="col-md-3">
              <label for="cc-cvv" class="form-label">CVV</label>
              <input type="text" class="form-control" id="cc-cvv" placeholder="">
              
            </div>
          </div>

          <hr class="my-4">

          <button class="w-100 btn btn-primary btn-lg" type="submit">Continue to checkout</button>
        </form>
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
      error_message: "To add to your trolley, you'll need an account.",
      addresses: []
    }
  },

  methods: {
    setSelectedAddress(event){
      //console.log(this.address)
      let selectedAddId = event.target.value;
      this.address = this.addresses.filter((a)=> a.address_id == selectedAddId)[0]
      
      //console.log(this.address)
    },
    async getAddresses() {
      const res = await fetch(`http://127.0.0.1:5000/api/address`, {
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("Auth_token")
        },
      })
      //console.log(res.status)
      if (res.ok) {
        const data = await res.json()
        this.success = true
        this.addresses = data
      }
      else {
        const errorData = await res.json()
        this.success = false
        this.error_message = errorData.error_message
      }
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
    }
  },

  mounted() {
    this.getCart()
    this.getAddresses()
    //console.log(UserId)
  }
}

export default cart
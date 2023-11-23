const  userOrder = {
  template: `
<div>
  <h2>Order History</h2>
  <div v-for="order in orders">
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="card-title">Order ID: {{order.order_id}}</h5>
          <h6 class="card-subtitle mb-2 text-muted">Date: {{order.order_date}} </h6>
          <h7> 
          <div>Address Details : {{ order.address.street }} {{ order.address.city}} {{order.address.state}} {{order.address.postal_code}}</div>
          </h7>
        </div>
        <div class="card-body">
          <p class="card-text">Amount: {{order.total_price}}. Status: Shipped</p>
         
          <ul class="list-group">
            <div v-if="success" v-for="item in order.order_items" class="card">
              <li class="list-group-item">{{ item.product.product_name }} <b> {{  item.quantity  }}kg </b>
              <div> Unit Price:{{ item.price_per_unit }} 
               Total Price :{{ item.total_price}} </div>
              </li>
            </div>
          </ul>
        </div>
      </div>
  </div>
  </div>

</div>`,
  data() {
      return {
          orders: [{
              address:{}, 
              payment:{}
          }],
          message: "",
          success: true,
          error_message: "",
          apiBaseUrl: "http://127.0.0.1:5000/api/"
      }
  },

  methods: {
    async getAllOrder() {
      const res = await fetch(`${this.apiBaseUrl}/allOrder`, {
          headers: {
              "Content-Type": "application/json",
              "Authentication-Token": localStorage.getItem("Auth_token")
          },
      })
      if (res.ok) {
          const data = await res.json()
          this.success = true
          this.orders = data
          // console.log(orders)
          this.message = data.message
      }
      else {
          const errorData = await res.json()
          this.success = false
          this.error_message = errorData.error_message
      }
    }
      
      
  },
  mounted() {
      this.getAllOrder()
      
      
  },
}

export default userOrder





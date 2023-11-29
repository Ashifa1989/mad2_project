const order = {
    template: `
<div>
<div v-if="successfirst">
<h2>Order Summary</h2>
<div> Order Id : {{order.order_id}}</div>
<div>Address Details : {{ order.address.street }} {{ order.address.city}} {{order.address.state}} {{order.address.postal_code}}</div>
<div>Payment type : {{order.payment.type}} </div>
<div>Order date : {{order.order_date}} </div>

<div v-if="success" v-for="item in order.order_items" class="card">
  <div>{{ message }}</div>
  <div> Name:{{ item.product.product_name }}</div>
  <div> Price:{{ item.price_per_unit }}</div>
  <div> Quantity: {{  item.quantity  }}</div>
  <div> Total Price :{{ item.total_price}} </div>
</div>

</div>
<p><strong>Total Amount: RM{{ order.total_price }}</strong></p>
</div>
<div v-else> {{ error_message }}</div>

</div>`,
    data() {
        return {
            order: {
                address:{}, 
                payment:{}
            },
            message: "",
            success: true,
            error_message: "",
            apiBaseUrl: "http://127.0.0.1:5000/api/",
            successfirst:true
        }
    },

    methods: {
        async OrderLIst(id) {
            const res = await fetch(`${this.apiBaseUrl}/order/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("Auth_token")
                },
            })
            if (res.ok) {
                const data = await res.json()
                this.success = true
                this.order = data
                this.message = data.message
                
            }
            else {
                const errorData = await res.json()
                this.success = false
                this.error_message = errorData.error_message
            }
        },
        
    },
    mounted() {
        if(localStorage.getItem("Auth_token")){ 
            this.message = "your order is successful.thank you for shopping with us "
        this.OrderLIst(this.$route.params.id)
          }
        else{
            this.successfirst=false
            this.error_message="You are not authorized to access this page. Please log in"
        }
        
        
        
    },
}

export default order
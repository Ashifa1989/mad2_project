
const order = {
    template: `
 
   <div>
   hello order
    <div v-if="success">
       {{ message }}
    </div>
    <h2>Order Summary</h2>
    <div v-if="success" v-for="product in order_items" >
       <img :src=" product.image_url " class="card-img-top" alt="...">
       <div> Name:{{ product.product_name }}</div>
       <div> Price:{{ product.price_per_unit }}</div>
       <div>Quantity: {{  product.quantity  }}</div>
       
    </div>
    <div v-else>
       {{ error_message }}
    </div>
 </div>`,
    data() {
        return {
            order_items: [{
                product_name: "",
                image_url: "",
                product_id: 1,
                quantity: 0,
                price_per_unit: 0,
                // total_price: 0
            }],
            

            message: "",
            success: true,
            error_message: ""

        }
    },
    
    methods: {
        async OrderLIst(id) {
            const res = await fetch(`http://127.0.0.1:5000/api/order/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("Auth_token")

                },
            })
            if (res.ok) {
                const data = await res.json()
                this.success = true
                this.order_items = data

            }
            else {
                const errorData = await res.json()
                this.success = false
                this.error_message = errorData.error_message
            }
        },
        

        // async checkout() {
            
        //         const res = await fetch("http://127.0.0.1:5000/api/order", {
        //             method: "post",
        //             headers: {
        //                 "content-type": "application/json",
        //                 "Authentication-Token": localStorage.getItem("Auth_token")
        //             },
        //             body: JSON.stringify(this.order)
        //         })
        //         console.log(res.status)
        //         if (res.ok) {
        //             const data = await res.json()

        //             this.message = console.log("your order is successful.thank you for shopping with us ")
        //         }
        //         else {
        //             const errorData = await res.json()
        //             this.success = false
        //             this.error_message = errorData.error_message
        //         }
            
        // }
    },
    mounted() {
        this.OrderLIst()
        
    },
}

export default order
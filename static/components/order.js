const order = {
    template : `<div>
    <div v-if="success">
    {{ message }}
    </div>
    <div v-if="success" v-for="product in order" >

        <div> image;{{ product.image_url }}</div>
        <div> Name:{{ product.product_name }}</div>
        <div> price:{{ product.price_per_unit }}</div>
        <div>Quantity: {{  product.quantity  }}</div> 
        
    </div>
    <div v-else>
    {{ error_message }}
    
    </div>
    <button @click.prevent="AddItems" > countinue shopping </button>
    <div>
    <button @click.prevent="buyProduct" > Buy </button>
    </div>
    
    </div>`,
    data () {
        return {
        order : [{
            product_name : "",
            image_url: "",
            product_id: 1,
            quantity : 0,
            price_per_unit : 0,
            total_amount : 0
        }],
        message:"",
        success : true,
        error_message : "To add to your trolley, you'll need an account."
        
    }
    } ,   
    methods: {
        async OrderLIst(){
            const res =await fetch(`http://127.0.0.1:5000/api/order/1`)
            if (res.ok){
                const data = await res.json()
                this.success = true
                this.order= data
                
            }
            else{
                const errorData= await res.json()
                this.success = false
                this.error_message = errorData.error_message
            }
        },
        async buyProduct() {
            
                const res = await fetch("http://127.0.0.1:5000/api/order/1", {
                    method: "post",
                    headers: {
                        "content-type": "application/json",
                        // "Cache-Control": "no-store, no-cache"
                    },
                    // body: JSON.stringify(this.order)
                })
                console.log(res)
                if (res.ok) {
                    const data = await res.json()
                    this.success = true
                    this.message = console.log("your order is successful.thank you for shopping with us ")
                }
                else {
                    const errorData = await res.json()
                    this.success = false
                    this.error_message = errorData.error_message
                }
            }
        },
        
        
        mounted(){
            this.OrderLIst()
    },
}            
        
export default order
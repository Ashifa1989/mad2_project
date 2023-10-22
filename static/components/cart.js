const cart = {
    template : `<div>
    
    <div v-if="success" v-for="product in cart" >

        <div> image;{{ product.image_url }}</div>
        <div> Name:{{ product.product_name }}</div>
        <div> price:{{ product.price_per_unit }}</div>
        <div>Quantity: {{  product.quantity  }}</div> 
        
    </div>
    <div v-else>
    {{ error_message }}
    
    </div>
    <button @click.prevent="AddItems" > countinue shopping </button>
    <router-link to="/order/1" > 
    <button @click.prevent="OrderLIst" > order </button>
    </router-link>
    
    </div>`,
    data () {
        return {
        cart : [{
            product_name : "",
            image_url: "",
            product_id: 1,
            quantity : 0,
            price_per_unit : 0,
            total_amount : 0
        }],
        product:{},
        success : true,
        error_message : "To add to your trolley, you'll need an account."
        
    }
    } ,   
    methods: {
        async getCart(){
            const res =await fetch(`http://127.0.0.1:5000/api/cart/user`)
            if (res.ok){
                const data = await res.json()
                this.success = true
                this.cart= data
                console.log(data)
            }
            else{
                const errorData= await res.json()
                this.success = false
                this.error_message = errorData.error_message
            }
        },
        async AddItems(){
              
           this.$router.push('/search')
        }
        },
    mounted(){
        this.getCart()
    }
    
        
}        
export default cart
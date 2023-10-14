const cart = {
    template : `<div>
    <button @click.prevent="show_cart_item">Cart</button> 
    <div v-if="success">
    <h2> {{ products.product_name }}</h2>
    <h2> {{ products.price_per_unit }}</h2>
    <p>Total Amount: {{ products.total_amount  }}</p> 
    <p>Total Amount: {{ total_amount  }}</p> 
    
    <p>
      Quantity
      <input type="number" placeholder="number of items.." v-model=products.quantity>
    </p>
    
    
    <h3> {{$route.params.id}} </h3>
   
    
    </div>
    <div v-else>
        {{ error_message }}
    </div>
    
    </div>`,
    data () {
        return {
        products : [{
            product_name : "",
            quantity : 0,
            price_per_unit : 10,
            total_amount : 0
        }],
        success : true,
        errror_message : "To add to your trolley, you'll need an account."
        
    }
        


    }, 
    methods: {
        async show_cart_item(){
            const res = await fetch(`/api/cart/user/${this.$route.params.id}`)
            
            if (res.ok){
                const data= await res.json()
                this.products =data
                console.log(data )
            }
            else {
                const errorData= await res.json() 
                this.success = false
                this.errror_message= data.errror_message
            }
        }
    },
    computed: {
        total_amount(){
            const total = this.products.quantity * this.products.price_per_unit
            
            return total
        }
    }

}
export default cart
const product = {
    template :  `<div>
   
    <div>
    <button v-on:click.prevent="all_product">product</button>
    </div>
    <div  v-if="success" v-for="product in filteredProducts"> 
    <p> {{ product.product_name }} </p>
    <p> {{ product.Description}} </p>
    <p> {{ product.price_per_unit }} </p>
    <p> {{ product.stock }} </p>
    <p> {{ product.image_url }} </p>
    <p> {{ product.manufacture_date }} </p>
    <p> {{ product.expairy_date }} </p>
    </div>
    
    </div>`,
    data(){
        return{
            products :[{
                product_name : "apple",
                Description: "made in australia",
                price_per_unit : 10,
                stock: 100,
                image_url : "image_url",
                manufacture_date : "17-04-2023",
                expairy_date: "17-04-2023",
                category_name:""

            }],
            success : true,
            error_message : "",

        }
    },
    methods : {
        async all_product () {
            
            const res = await fetch(`http://127.0.0.1:5000/api/product`)
            if (res.ok){
                const data= await res.json()
                this.products = data
                console.log(data)
                
            
            }
            else{
                const errorData = await res.json()
                this.success= false
                this.error_message = errorData.error_message
        }

    }
},
    computed: {
        filteredProducts() {
            return this.products.length > 0 ? this.products : [];
    }
},
}


export default product
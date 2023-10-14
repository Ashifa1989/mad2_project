const category = {
    template : `<div>
    <div v-if="success">
        <figure v-for="category in categories">
            <img v-bind:src="category.imagelink">
            <figcaption> {{ category.category_name }} </figcaption>
        </figure>
        
        
    </div>
    

    <div v-else>
        <p> {{ error_message }} </p>
    </div>
    </div>`,

    data() {
        return {
            categories : [{
                category_name : "",
                imagelink : "",

            }],
            success : true,
            error_message : ""
           
        }
    },
    methods : {
        async get_all_category() {
    
            const res = await fetch("http://127.0.0.1:5000/api/category")
            if (res.ok){
                const data= await res.json()
                this.categories = data
            }
            else{
                const errorData = await res.json()
                this.error_message = errorData.error_message
            }

        },
    
},
}
export default category
const category = {
    template : `<div>
    <form >
        <div class="mb-3">
            <label for="categoryName" class="form-label">Category Name:</label>
            <input type="text" class="form-control" id="categoryName" v-model="categories.category_name" required></input>
        </div>
        <div class="mb-3">   
            <label for="imageLink" class="form-label" >Image Link:</label>
            <input type="text" class="form-control"  id="imageURL" v-model="categories.imagelink" placeholder="https://example.com/category-image.jpg"></input>
        </div>
        <div class="mb-3">
            <button class="btn btn-primary" @click.prevent="createCategory">CreateCategory</button>
        </div>
        
    </form>
    
    
    <div v-if="!success">
        <p> {{ error_message }} </p>
    </div>
    </div>`,

    data() {
        return {
            categories :{
                category_name : "",
                imagelink : "",

            },
            success : true,
            message : "successfully created the category",
            error_message : "",
           
        }
    },
    methods : {
        async getCategories() {
            const response = await fetch("http://127.0.0.1:5000/api/category");
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                this.categories = data;
            }
            else {
                this.categories = []
            }
        },
    },
    mounted(){
        this.getCategories()
    }
}
export default category
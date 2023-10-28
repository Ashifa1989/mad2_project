
const navbar ={
    template :`
    <div>
        
        <div class="container">
            <nav class="navbar navbar-expand-lg navbar-light bg-primary ">
                <div class="navbar-brand">
                    <div class="logo-container leaf">
                        <h2>Leaf Grocery Shop</h2>
                    </div>
                </div>
                
                
                </nav>
                 <div class="navbar-nav ml-auto sm-3">
                
                   <div>
                    <router-link to="/login" class="nav-link" style="float: right ; margin-right: 20px">Login</router-link>
                   <router-link to="/logout" class="nav-link" style="float: right ; margin-right: 20px">Logout</router-link>
                    
                    </div>
                    <router-view style="margin-top: 20px; float: center"></router-view>
                </div>
            

        </div>
    </div>
    `,
    
}
export default navbar
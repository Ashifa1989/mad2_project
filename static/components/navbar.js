
// const navbar ={
//     template :`
//     <div>
        
//         <div  class="container-flex">
//     <nav class="navbar navbar-expand-lg navbar-light bg-success">
//       <div class="logo-container leaf"></div>
//       <div class="navbar-brand" href="#">
//         <h2 style="color: rgb(0, 3, 3); margin-left: 5px;">Leaf Grocery Shop</h2>
//       </div>
//       <div class="container-flex"  >
//         <div class="navbar" id="navbarNavAltMarkup">
//           <div class="navbar-nav" v-if="isLoggedIn">
            
//             <router-link to="/logout" class="nav-link"
//               style="margin-left: 20px; margin-right: 20px; float: right;">Logout</router-link>
            


//             <router-link to="/cart" class="nav-link" style="margin-left: 20px; float: right;">Cart</router-link>
//             <router-link to="/all_product" class="nav-link"
//               style="margin-left: 20px; float: right;">Products Management</router-link>
//             <router-link to="/all_category" class="nav-link"
//               style="margin-left: 20px; float: right;">Category Management</router-link>
//             <router-link to="/search" class="nav-link"
//               style="margin-left: 20px; float: right;">Product</router-link>
//           </div>

//           <div class="navbar-nav" v-if="!isLoggedIn">
//             <router-link to="/login" class="nav-link"
//               style="margin-left: 20px; margin-right: 20px; float: right;">Login</router-link>
            
            
//             <router-link to="/signup" class="nav-link" style="margin-left: 20px; float: right;">Signup</router-link>
//             <router-link to="/signupManager" class="nav-link" style="margin-left: 20px; float: right;">signupManager</router-link>


            
//           </div>
//         </div>
//       </div> 
//     </nav>
//     </div>
//     </div>
//     `,
//     computed: {
//         isLoggedIn() {
//           return this.$store.state.isLoggedIn;
//         },
//       },
    
// }
// export default navbar
const admin={
  template:`
  <div>
    <div v-if="success" v-for="user in users">
      <div>{{ user.username}}</div>
      <div>{{ user.email }}</div>
      <div button @click="acceptSignIn">accept</div>
      <div button @click="rejectSignIn">reject</div>
      
  </div>
  `,
  data(){
    return{
      users:[],
      message:"",
    }
  },
  methods:{
    async getallSignupRequest(){
      res=await fetch("http://127.0.0.1:5000/api/Admin_approval")
      if (res.ok){
        const data=await res.json()
        this.users=data
      }
      else{
        this.message="there is no new manager signUp request"
      }
    }

  },
  mounted() {
    this.getallSignupRequest();
  },
}
export default admin
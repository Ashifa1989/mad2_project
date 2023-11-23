const apiBaseUrl= "http://127.0.0.1:5000/api/user"
const userService={
  methods: {
    async updateUser() {
        const res = fetch(apiBaseUrl, {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authentication-Token": localStorage.getItem("Auth_token")
            },
            body: JSON.stringify(this.user),

        })
        if (res.ok) {
            const data = await res.json()
            return data
            // this.user = data
            // this.getUser()
        }
        else {
            const errorData = await res.json()
            // this.error_message = errorData.error_message
            return errorData 
        }
    },
    async getUser() {
        const res = await fetch(apiBaseUrl, {
            headers: {
                "Content-Type": "application/json",
                "Authentication-Token": localStorage.getItem("Auth_token")
            },

        })
        console.log(res.status)
        if (res.status == 401) {
            const data = await res.json()
            console.log("no user found", data);
            this.success = false
            this.error_message = "not an autheticated user"
        }
        else if (res.ok) {
            const data = await res.json()
            return data
            // this.user = data
            // console.log(data)
        }
        else {
            const errorData = await res.json();
            console.log("no user found", errorData);

            // this.success = false
            // this.error_message = errorData.error_message
            return errorData
        }
    },

}
}
export default userService
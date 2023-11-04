const logout = {
    template: `
    <div>
    <div v-if="!success">
    {{error_message}}
    </div>
    </div>
    `,
    data() {
        return {
            error_message: "",
            success: true
        }
    },
    props: ["isLoggedIn"],
    methods: {
        async logout() {
            const res = await fetch("/logout")
            if (res.ok) {
                this.$emit('userLoggedOut')
                this.$router.push("/login")
            }
            else {
                this.success = false
                this.error_message = "something went wrong. could not logout the user"
            }
        },
        async userLoggedOut(){}
    },
    mounted() {
        this.logout()
    }
}

export default logout
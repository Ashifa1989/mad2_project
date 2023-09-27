from  flask_restful import Api, Resource, abort
# from  Flask_RESTful import Api, Resource
api = Api(prefix="/api")

user = {
    "username" : "ashifa",
    "password" : "1234"
}

class UserApi(Resource):
    def get(self, id=None):
        if id == 1 :
            abort(400, message="this user is restricted")
        return user
    
api.add_resource(UserApi, "/users/<int:id>")

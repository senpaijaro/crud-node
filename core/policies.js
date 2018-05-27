module.exports.policies = {
	"User": {
		"add_user" : ["userPolicy"],
		"checkLogin": ["loginRequiredRequest"]
	}
}
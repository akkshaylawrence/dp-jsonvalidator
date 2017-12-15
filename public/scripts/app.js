function checkData() {
	var data = document.getElementById("data").value;
	var result = document.getElementById("result");
	var error = document.getElementById("error");
	var mydiv = document.getElementById("right");
	const ajv = new Ajv({
		allErrors: true
	});
	var schema = {
		type: "object",
		properties: {
			smaller: {
				type: "number"
			},
			larger: {
				type: "number"
			}
		},
		required: ["smaller", "larger"]
	};
	var validData = {};
	try {
		validData = JSON.parse(data);
		console.log(validData);
		const validate = ajv.compile(schema);
		var valid = ajv.validate(schema, validData); // true
		console.log(valid);
		if (valid) {
			result.className -= " fail";
			result.className += " success";
			result.innerHTML = "JSON is valid!";
			error.innerHTML = "";
		} else {
			result.className -= " success";
			result.className += " fail";
			result.innerHTML = "JSON Invalid";
			for (i in validate.errors) {
				var errorp = document.createElement("p");
				errorp.innerHTML = validate.errors[i].message;
				mydiv.appendChild(errorp);
			}
		}
	} catch (e) {
		result.className -= " success";
		result.className += " fail";
		result.innerHTML = "Error";
		error.innerHTML = e;
	}
}
// Valid data for testing
// {
//   "smaller": 5,
//   "larger": 7
// }
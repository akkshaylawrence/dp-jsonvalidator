"use strict";

function either(first, second) {
	return typeof first === "undefined" ? second : first;
}

function error(label, message) {
	throw new Error(label + " " + message);
}

function applyValue(schema, key, defaultValue) {
   schema[key] = either(schema[key], defaultValue);
}

function setValueForSchema(schema) {
   if (schema.done) {
      return schema;
   }


	switch (schema.type) {
		case "number":
			applyValue(schema, "min", Number.MIN_VALUE);
			applyValue(schema, "max", Number.MAX_VALUE);
			applyValue(schema, "float", false);
			applyValue(schema, "convertByForce", true);
			applyValue(schema, "isRequired", false);

			schema.done = true;
			break;

		case "string":
			applyValue(schema, "min", 0);
			applyValue(schema, "max", Number.MAX_VALUE);
			applyValue(schema, "pattern", null);
			applyValue(schema, "convertByForce", true);
			applyValue(schema, "isRequired", false);

			schema.done = true;
			break;

		case "boolean":
			applyValue(schema, "convertByForce", true);
			applyValue(schema, "isRequired", false);

			schema.done = true;
			break;

		case "object":
			applyValue(schema, "isRequired", false);

			schema.done = true;
			break;

		case "array":
			applyValue(schema, "min", 0);
			applyValue(schema, "max", Number.MAX_VALUE);
			applyValue(schema, "isRequired", false);

			schema.done = true;
			break;

		default:
			throw new Error("unknown type in schema");
	}
}

function validateBoolean(label, value, schema) {
	setDefaultValueForSchema(schema);

	if (schema.isRequired && typeof value === "undefined") {
		error(label, "is required");
	}

	if (schema.convertByForce) {
		value = !!value;
	}

	return value;
}

function validateNumber(label, value, schema) {
	setValueForSchema(schema);

	if (schema.isRequired && typeof value === "undefined") {
		error(label, "is required");
	}

	if (schema.convertByForce) {
		if (schema.float) {
			value = parseFloat(value);
		} else {
			value = parseInt(value, 10);
		}
	}

	if (!_.isNumber(value)) {
		error(label, "is not a number");
	}

	if (!(schema.min <= value && value <= schema.max)) {
		error(label, "is not valid");
	}

	return value;
}

function validateString(label, value, schema) {
   var isString, strLen;

   setValueForSchema(schema);

   if (schema.isRequired && typeof value === "undefined") {
      error(label, "is required");
   }

   isString = _.isString(value);

   if (schema.convertByForce && !isString) {
      value += "";
   }

   if (isString) {
      strLen = value.length;

      if (!(schema.min <= strLen && strLen <= schema.max)) {
         error(label, "is not proper.");
      }
   }

   return value;
}

function validateObject(label, obj, schema) {
	var isUndefined;

	setValueForSchema(schema);

	isUndefined = typeof obj === "undefined";

	if (schema.isRequired && isUndefined) {
		error(label, "is required");
	}

	if (isUndefined) {
		return obj;
	}

	if (!_.isPlainObject(obj)) {
		error(label, "is not an object");
	}

	var isSchemaPropEmpty = true;
	_.forEach(schema.properties, function (target, field) {
		isSchemaPropEmpty = false;
		obj[field] = select(field, obj[field], target);
	});

	if (!isSchemaPropEmpty) {
		_.forEach(obj, function (target, field) {
			obj[field] = select(field, obj[field], schema.properties[field]);
		});
	}
	return obj;
}

function select(label, value, schema) {
   if (!schema) {
      error(label, "not recognized.");
   }

   switch (schema.type) {
      case "number":
         return validateNumber(label, value, schema);
      case "boolean":
         return validateBoolean(label, value, schema);
      case "string":
         return validateString(label, value, schema);
      case "object":
         return validateObject(label, value, schema);
      default:
         error(label, "schema type is invalid");
   }
}

function validate(json, schema) {
	if (_.isPlainObject(json)) {
		return validateObject("root", json, schema);
	} else {
		throw new Error("Not a valid json");
	}
}
class Assert {
    constructor() {}
    /**
     * Asserts that the given value is a instance of the given instanceable type
     * @param {any} value
     * @param {InstanceType<any>} instanceTarget
     * @throw if the given value is not an instance of the given type.
     */
    instance(value, instanceTarget) {
        if (!(value instanceof instanceTarget)) {
            throw new Error(
                `${value} is not an instance of ${instanceTarget.name}`
            );
        }
    }
    /**
     * Assert that the given value matches the given type (remember objects and arrays are the type 'object')
     * @param {any} value
     * @param {string} typestring
     * @throws if value is not the matching type
     */
    type(value, typestring) {
        const value_type = (typeof value).toLowerCase();
        if (value_type !== typestring.toLowerCase()) {
            throw new TypeError(`${value} failed type assertion!`);
        }
    }
    /**
     * Assert that the given value exists and is not undefined.
     * @param {any} value
     * @throws if value is undefined
     */
    exists(value) {
        if (value === undefined) {
            throw new Error(`${value} does not exist!`);
        }
    }

    /**
     * Asserts that an object has the expected keys, generally don't use this unless it's a very large complex object...
     * @param {Object} value - the object to validate
     * @param {Record<string, string>} shape - expected shape, e.g. { name: "string", age: "number" }
     */
    has_shape(value, shape) {
        const errors = [];
        for (const key of Object.keys(shape)) {
            if (!Object.hasOwn(value, key)) {
                errors.push(`missing prop "${key}"`);
                continue;
            }

            const expectedType = shape[key];
            const actualValue = value[key];
            const actualType = typeof actualValue;

            if (actualType !== expectedType) {
                errors.push(
                    `prop "${key}" expected type "${expectedType}" but got "${actualType}"`
                );
            }
        }

        if (errors.length > 0) {
            throw new Error(`Shape validation failed: ${errors.join("; ")}`);
        }
    }

    /**
     * Asserts that the value exists and is not null.
     * @param {any} value
     * @throws if value is undefined or null
     */
    not_null(value, message = `${value} does not exist!`) {
        if (value === undefined || value === null) {
            throw new Error(message);
        }
    }
    /**
     * Confirms the given value is one of the expected values
     * @param {any} value
     * @param  {...any} expectedValues
     * @throws if value is contained inside any of the given expected values
     */
    one_of(value, ...expectedValues) {
        if (expectedValues.includes(value) === false) {
            throw new Error(
                `value:${value} is not in ${expectedValues.join(",")}`
            );
        }
    }

    /**
     * @param {number} value
     * @param {number} targetNumber
     * @throws if given value is not a number, or is not at greater then or equal to the given targetNumber
     */
    at_least(value, targetNumber) {
        if (typeof value !== "number") {
            throw new Error(`value:${value} is not a number type!`);
        }
        if (value < targetNumber) {
            throw new Error(`value:${value} is not at least ${targetNumber}`);
        }
    }

    /**
     * @param {number} value
     * @param {number} targetNumber
     * @throws if given value is not a number, or is not less than the given targetNumber
     */
    at_most(value, targetNumber) {
        if (typeof value !== "number") {
            throw new Error(`value:${value} is not a number type!`);
        }
        if (value > targetNumber) {
            throw new Error(`value:${value} is not at least ${targetNumber}`);
        }
    }

    /**
     * @param {number} value
     * @throws if the given value is NaN or Infinite
     */
    not_NAN(value) {
        if (typeof value !== "number") {
            throw new Error(`value:${value} is not a number type!`);
        }
        if (!Number.isFinite(value)) {
            throw new Error(`value:${value} is NaN or Infinite!`);
        }
    }

    /**
     * @param {any[]} value
     * @throws if the given value is not an array
     */
    array(value) {
        if (!Array.isArray(value)) {
            throw new Error(`${value} is not a Array!`);
        }
    }
}

export default new Assert();

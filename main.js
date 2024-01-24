// @ts-check

/**
 * @type {HTMLFormElement | null}
 */
const form_nullable = document.querySelector("#user-input");

/**
 * @type {Array<HTMLInputElement> | null}
 */
const sides_nullable = get_all_sides(3);

/**
 * @type {HTMLElement | null}
 */
const display_nullable = document.querySelector("#display");

/**
 * @readonly
 * @enum {number}
 */
const TriangleType = {
    OSTROKATNY: 0,
    PROSTOKATNY: 1,
    ROZWARTOKATNY: 2,
};

if (form_nullable && sides_nullable && display_nullable) {
    const form = /** @type {HTMLFormElement} */ (form_nullable);
    const sides = /** @type {Array<HTMLInputElement>} */ (sides_nullable);
    const display = /** @type {HTMLElement} */ (display_nullable);

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        check_geometry(sides, display);
    });
} else {
    console.error("Requied elements missing!");
}

/**
 * @param {Array<HTMLInputElement>} sides 
 * @param {HTMLElement} display 
 */
function check_geometry(sides, display) {
    clear_display(display);

    /**
     * @type {Array<number> | null}
     */
    const geometry_values_nullable = get_geometry_sides(sides);
    if (!geometry_values_nullable) {
        // Sides are not numbers!
        const error_message = document.createElement('p');
        error_message.className = "errmsg";
        error_message.innerText = "Jeden lub kilka boków nie jest liczbami!";

        display.append(error_message);

        return;
    }
    const geometry_values = /** @type {Array<number>} */ (/** @type {unknown} */ (geometry_values_nullable));

    if (!check_triangle(geometry_values)) {
        // Triangle is impossible to create using those sides!
        const error_message = document.createElement('p');
        error_message.className = "errmsg";
        error_message.innerText = `Trójkąt jest niemożliwy to utworzenia z boków ${geometry_values[0]}, ${geometry_values[1]}, ${geometry_values[2]}!`;

        display.append(error_message);

        return;
    }

    const message0 = document.createElement('p');
    message0.className = "msg";
    message0.innerText = `Trojkąt jest możliwy to utworzenia z boków ${geometry_values[0]}, ${geometry_values[1]}, ${geometry_values[2]}`;
    display.appendChild(message0);


    const triangle_type = get_triangle_type(geometry_values);
    let texify_triangle_type;
    if (triangle_type == TriangleType.OSTROKATNY) {
        texify_triangle_type = "ostrokątny";
    } else if (triangle_type == TriangleType.PROSTOKATNY) {
        texify_triangle_type = "prostokątny";
    } else {
        texify_triangle_type = "rozwartokątny";
    }

    const image = document.createElement('img');
    image.className = "triangle-image";
    if (triangle_type == TriangleType.OSTROKATNY) {
        image.src = "assets/ostrokatny.webp";
    } else if (triangle_type == TriangleType.PROSTOKATNY) {
        image.src = "assets/prostokatny.webp";
    } else {
        image.src = "assets/rozwartokatny.png";
    }
    display.appendChild(image);

    const message1 = document.createElement('p');
    message1.className = "msg";
    message1.innerText = `Jest to trójkąt ${texify_triangle_type}`;
    display.appendChild(message1);


    const field = calculate_field(geometry_values);
    const message2 = document.createElement('p');
    message2.className = "msg";
    message2.innerText = `Pole wynosi: ${field.toFixed(2)}u\xB2`;
    display.appendChild(message2);
}

/**
 * @param {HTMLElement} display 
 */
function clear_display(display) {
    while(display.firstChild) {
        display.removeChild(display.firstChild);
    }
}

/**
 * Returns values of TriangleTypes
 * 
 * @param {Array<number>} sides 
 * @returns {TriangleType}
 */
function get_triangle_type(sides) {
    const a = sides[0];
    const b = sides[1];
    const c = sides[2];

    let result = TriangleType.OSTROKATNY;

    if (a ** 2 + b ** 2 == c ** 2) {
        result = TriangleType.PROSTOKATNY;
    } else if (a ** 2 + b ** 2 < c ** 2) {
        result = TriangleType.ROZWARTOKATNY;
    }

    return result;
}


/**
 * Calculate field of triangle
 * SATEFY: Expects to triangle to be possible to create
 * 
 * @param {Array<number>} geometry_values 
 * @returns {number} 
 */
function calculate_field(geometry_values) {
    const a = geometry_values[0];
    const b = geometry_values[1];
    const c = geometry_values[2];
    const obwod = a + b + c;
    const half_obwod = obwod / 2;
    const field = Math.sqrt(half_obwod * (half_obwod - a) * (half_obwod - b) * (half_obwod - c));
    return field;
}

/**
 * Checks whenether a triangle is possible to create
 * Function checks only 3 first elements of sides
 * @param {Array<number>} sides 
 * @returns {boolean}
 */
function check_triangle(sides) {
    const a = sides[0];
    const b = sides[1];
    const c = sides[2];
    return c < b + a;
}

/**
 * @param {Array<HTMLInputElement>} sides 
 * @returns {Array<number> | null}
 */
function get_geometry_sides(sides) {
    /**
     * @type {Array<number>}
     */
    const values = [];
    for (let i = 0; i < sides.length; i++) {
        /**
         * @type {HTMLInputElement}
         */
        const side = sides[i];

        if (side.value.trim().length == 0) {
            return null;
        }

        /**
         * @type {number}
         */
        const value = Number(side.value.trim());

        if (isNaN(value)) {
            return null;
        }

        values.push(value);
    }

    values.sort((a, b) => a - b);
    return values;
}

/**
 * Returns all sides user inputs of geometry
 * Return value is array type of HTML input elements
 * Function returns null whenether one of sides could not be found
 * 
 * @param {number} sides
 * @returns {Array<HTMLInputElement> | null}
 */
function get_all_sides(sides) {
    /**
     * @type {Array<HTMLInputElement>}
     */
    const result = [];
    for (let i = 0; i < sides; i++) {
        /**
         * @type {HTMLInputElement | null}
         */
        const side_nullable = document.querySelector(`#side${i + 1}`);
        if (side_nullable) {
            const side = /** @type {HTMLInputElement} */ (side_nullable);
            result.push(side);
        } else {
            return null;
        }
    }

    return result;
}
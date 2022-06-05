/* GENERAL RESOURCES */
const errorMessage = 'Algo salió mal. Tal vez el tipo o nombre de algún pokemón está mal escrito.';
const errorMessageStyle = `background-color: lightgray; color: red`;
const outputStyle = `color: darkorange`;
const URL = 'https://pokeapi.co/api/v2';





/* Exercise 1 */
// Solution
function multiply(x, y) {
	if (x === 0 || y === 0) return 0;
	return x/(1/y);
}





/* Exercise 2 */
// Solution A
async function pokemonsPerType(type) {
	try {
		let res = await fetch(`${URL}/type/${type}`);
		let data = await res.json();
		console.log(`%c • La cantidad de pokemons de tipo ${type.toUpperCase()} son:`, outputStyle, data.pokemon.length);
	} catch (e) {
		console.log(`%c ${errorMessage}`, errorMessageStyle);
	}
}
// Solution B
async function pokemonsOfTwoTypes(type1, type2) {
	let emptyAnswer = '«no hay pokemons de ambos tipos»';
	try {
		const res = await Promise.all([
			fetch(`${URL}/type/${type1}`),
			fetch(`${URL}/type/${type2}`)
		]);
		const data = await Promise.all(res.map(r => r.json()));
		const [pokemonGroup1, pokemonGroup2] = data.map(d => d.pokemon.map(p => p.pokemon.name));
		const intersection = pokemonGroup1.filter(p => pokemonGroup2.includes(p));

		console.log(`%c • Los pokemons de tipo ${type1.toUpperCase()} y ${type2.toUpperCase()} son:`, outputStyle, intersection.length ? intersection.join(', ') : emptyAnswer);
	} catch (e) {
		console.log(`%c ${errorMessage}`, errorMessageStyle);
	}
}
// Solution C
async function pokemonNumber(name) {
	try {
		const res = await fetch(`${URL}/pokemon/${name}`);
		const data = await res.json();
		console.log(`%c • El número de ${name.toUpperCase()} es:`, outputStyle, data.id);
	} catch (e) {
		console.log(`%c ${errorMessage}`, errorMessageStyle);
	}
}
// Solution D
async function pokemonBaseStats(number) {
	try {
		const res = await fetch(`${URL}/pokemon/${number}`);
		const data = await res.json();
		console.log(`%c • Las estadísticas base de ${data.name.toUpperCase()} son:`, outputStyle,);
		console.table(data.stats.map(s => {
			return {...s, stat: s.stat.name};
		}));
	} catch (e) {
		console.log(`%c ${errorMessage}`, errorMessageStyle);
	}
}
// Solution E
async function pokemonsOrderedBy(pokemonsId, order) {
	const compareFun = {
		name: (a, b) => a.name.localeCompare(b.name),
		weight: (a, b) => a.weight - b.weight,
		types: (a, b) => a.types.localeCompare(b.types)
	}
	if (!(order in compareFun)) return console.log(`%c ${errorMessage}`, errorMessageStyle);

	try {
		const res = await Promise.all(pokemonsId.map(id => fetch(`${URL}/pokemon/${id}`)));
		const data = await Promise.all(res.map(r => r.json()));
		const pokemonsGroup = data.map(p => {
			let { name, weight, types } = p;
			types = types.map(t => t.type.name).join(', ');
			return { name, weight, types };
		});
		console.table(pokemonsGroup.sort(compareFun[order]));
	} catch (e) {
		console.log(`%c ${errorMessage}`, errorMessageStyle);
	}
}
// Solution F
async function pokemonHasType(id, type) {
	try {
		const res = await fetch(`${URL}/pokemon/${id}`);
		const data = await res.json();
		const types = data.types.map(t => t.type.name);
		console.log(`%c • ${data.name.toUpperCase()} es de tipo ${type.toUpperCase()}?`, outputStyle, types.includes(type));
	} catch (e) {
		console.log(`%c ${errorMessage}`, errorMessageStyle);
	}
}





/* Exercise 3 */
function checkPassword(str) {
	const password = str.split('');
	const specialCharacters = '!@#$%ˆ&*-_+=?'.split('');
	const onlySpecialChar = password.filter(c => specialCharacters.includes(c));
	const amountOfSpecialChar = onlySpecialChar.length;

	function isSpecialChar(c) { return specialCharacters.includes(c); }

	const checks = [
		() => password.length >= 16,																			// tiene al menos 16 caracteres
		() => password.some(c => c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122),								// tiene minúsculas
		() => password.some(c => c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90),								// tiene mayúsculas
		() => password.every((c, i, p) => c !== p[i-1]),										// no tiene letras, números ni caracteres especiales iguales consecutivos
		() => password.filter(c => c.charCodeAt(0) >= 48 && c.charCodeAt(0) <= 57).length >= 4,					// tiene al menos 4 números
		() => amountOfSpecialChar >= 2,																			// tiene al menos 2 caracteres especiales
		() => new Set(onlySpecialChar).size === amountOfSpecialChar,											// no tiene caracteres especiales repetidos
		() => password.every((c, i, p) => isSpecialChar(c) ? !isSpecialChar(p[i-1]) : true),	// no tiene caracteres especiales diferentes consecutivos
		() => password.every(c => c.charCodeAt(0) !== 48),														// no tiene 0
		() => password.every(c => c.charCodeAt(0) !== 32)														// no tiene espacios
	];

	//return checks.every(test => test()); // Solución para el ejercicio 3
	return checks.map(test => test()) // Solución para el ejercicio 5
}





/* Exercise 4 */
function arrayStats(arr) {
	const evenNumbersPercentage = arr.filter(n => n % 2 === 0).length / arr.length * 100;
	const oddsNumbersPercentage = arr.filter(n => n % 2 !== 0).length / arr.length * 100;
	const numbersGreaterThan1000Percentage = arr.filter(n => n > 1000).length / arr.length * 100;
	const max = Math.max(...arr);
	const average = arr.reduce((a, b) => a + b, 0) / arr.length;
	const min = Math.min(...arr);

	console.log(`%c • La cantidad de elementos del array es:`, outputStyle, arr.length);
	console.log(`%c • El balance porcentual de pares e impares respectivamente es: `, outputStyle, `${evenNumbersPercentage} %     ${oddsNumbersPercentage} %`);
	console.log(`%c • El porcentaje de números mayores a 1000 es: `, outputStyle, `${numbersGreaterThan1000Percentage} %`);
	console.log(`%c • El menor y mayor número respectivamente son: `, outputStyle, `${min}     ${max}`);
	console.table({
		maximo: {numero: Math.max(...arr), porcentaje: `100 %`},
		promedio: {numero: average, porcentaje: `${average / max * 100} %`},
		minimo: {numero: Math.min(...arr), porcentaje: `${min / max * 100} %`}
	});
}





/* Exercise 5 */
const passwordInput = document.getElementById('pw');
passwordInput.addEventListener('keyup', event => {
	const password = event.target.value;
	const result = checkPassword(password);
	result.forEach((r, i) => {
		const output = document.getElementById(`cond${i+1}`);
		const cond = output.innerHTML.slice(0, -1);
		output.innerHTML = r ? `${cond} ✔` : `${cond} ✖`;
		output.style.color = r ? 'green' : 'red';
	});
})





/* Exercise 6 */
const pokemonInput = document.getElementById('pokemon');
const btn = document.getElementById('btn');
btn.addEventListener('click', event => {
	event.preventDefault();
	const pokemon = pokemonInput.value;
	updatePokeData(pokemon);
});

async function updatePokeData(pokemon) {
	try {
		const res = await fetch(`${URL}/pokemon/${pokemon}`);
		const {name, id, types, weight, height, sprites} = await res.json();
		document.getElementById('name').innerHTML = name;
		document.getElementById('id').innerHTML = id;
		document.getElementById('types').innerHTML = types.map(t => t.type.name).join(', ');
		document.getElementById('weight').innerHTML = weight;
		document.getElementById('height').innerHTML = height;
		document.getElementById('sprites').src = sprites.front_default;
		document.getElementById('sprites').alt = name + '_sprite';
	} catch (e) {
		console.log(`%c ${errorMessage}`, errorMessageStyle);
	}
}


































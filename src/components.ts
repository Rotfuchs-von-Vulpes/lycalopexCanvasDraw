interface HTMLNode {
	children?: HTMLElement[] | string[];
	atributes?: [string, string][]
}

function formatStr(str: string) {
	return str[0].toUpperCase() + str.slice(1);
}

function createEl(
	tag: keyof HTMLElementTagNameMap,
	{ children, atributes }: HTMLNode
): HTMLElement | HTMLInputElement {
	let el = document.createElement(tag);

	if (children) el.append(...children);
	if (atributes) atributes.forEach(att => {
		el.setAttribute(...att);
	});

	return el;
}

export function createInputEl(
	type: string,
	value: string,
	name: string,
	callBack: (el: HTMLInputElement, event?: Event) => void,
	att?: [string, string][]
): HTMLElement {
	let inputEl = createEl('input', {
		atributes: [['type', type], ['value', value]]
	}) as HTMLInputElement;

	if (callBack) {
		if (type == 'button') {
			inputEl.addEventListener('click', () => callBack(inputEl));
		} else {
			inputEl.addEventListener('change', event => {
				callBack(inputEl, event);
			});
		}
	}

	if (att) att.forEach((([ att, value ]) => inputEl.setAttribute(att, value)));

	let divEll = createEl('div', {
		atributes: [[ 'class', 'input' ]],
		children: [
			createEl('label', {
				children: [ name ],
			}),
			createEl('br', {}),
			inputEl,
		],
	});

	return divEll;
}

export function createOptions(
	label: string,
	values: string[],
	onChange: (el: HTMLInputElement, event: Event) => void
): HTMLElement {
	function returnValue(value: string, index: number): [string, string][] {
		if (index === 0) {
			return [['value', value], ['select', '']];
		} else {
			return [['value', value]];
		}
	}

	let selectEl = createEl('select', {
		atributes: [
			['id', 'input' +
			label
				.split(' ')
				.map(formatStr)
				.join('')],
		],
		children: [
			...values.map((value, i) => createEl('option', {
				atributes: returnValue(value, i),
				children: [ formatStr(value) ],
			})),
		]
	}) as HTMLInputElement;

	selectEl.addEventListener('change', (event) => {
		onChange(selectEl, event);
	});

	let divEl = createEl('div', {
		atributes: [['class', 'input']],
		children: [
			createEl('label', {
				children: [ label ],
			}),
			createEl('br', {}),
			selectEl,
		]
	});

	return divEl;
}

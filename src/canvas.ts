import { Point, createPoint, Figure, Style as LineStyle, Mouse, Keyboard, Style } from './utils';
import { createLineFigure, createPathFigure, createRectangleFigure, figureType } from './graphics';

interface CanvasScreen {
	el: HTMLCanvasElement;
	screen: Point;
	figures: Figure[];
	ghostFigure: Figure;
	style: LineStyle;
	setStyle: (style: Style) => void;
	addFigure: (type: figureType) => void;
	render: () => void;
	click: () => void;
	stopDrawing: () => void;
	keydom: () => void;
}

export default function createACanvas(ctxEl: HTMLCanvasElement, mouse: Mouse, keyboard: Keyboard): CanvasScreen {
	const ctx = ctxEl.getContext('2d') as CanvasRenderingContext2D;
	const keys = keyboard.keys;

	return {
		el: ctxEl,
		screen: createPoint(ctxEl.width, ctxEl.height),
		figures: [],
		ghostFigure: createPathFigure(),
		style: {
			color: 'black',
			lineWidth: 1,
			lineCap: 'butt',
			lineJoin: 'miter',
			milterLimit: 10,
		},
		setStyle(style) {
			this.style = { ...this.style, ...style };
			this.ghostFigure.style = { ...this.style };
		},
		addFigure(type) {
			switch (type) {
				case figureType.path:
					this.ghostFigure = createPathFigure(this.style);
					break;
				case figureType.line:
					this.ghostFigure = createLineFigure(this.style);
					break;
				case figureType.rectangle:
					this.ghostFigure = createRectangleFigure(this.style);
			}
		},
		render() {
			ctx.fillStyle = 'white';
			ctx.fillRect(0, 0, this.screen.x, this.screen.y);
		
			this.figures.forEach((figure) => {
				figure.draw(ctx);
			});
		
			this.ghostFigure.drawGhost(ctx, mouse.position);
		
			if (mouse.mode === 'nothing' && !keys.has('a')) {
				ctx.fillStyle = 'red';
				ctx.beginPath();
				ctx.arc(mouse.position.x, mouse.position.y, 10, 0, 6, false);
				ctx.fill();
			}
		},
		click() {
			if (mouse.mode == 'drawing') {
				if (this.ghostFigure.addPoint(mouse.position)) this.stopDrawing();
			}
			this.render();
		},
		stopDrawing() {
			if (this.ghostFigure.points.length > 1) {
				this.figures.push({ ...this.ghostFigure });
				this.ghostFigure = createPathFigure({ ...this.style });
				this.render();
			}
		},
		keydom() {
			if (keys.has('Enter')) {
				this.stopDrawing();
				mouse.mode = 'nothing';
			} else if (keys.has('Backspace')) {
				this.ghostFigure.points.pop();
			}
		}
	}
}

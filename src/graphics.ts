import { Point, Style, Figure, GenericFigure } from './utils';

export enum figureType {
	line,
	path,
	rectangle,
	elipse,
}

const defaultStyle: Style = {
	color: '#00000',
	lineWidth: 1,
	lineCap: 'butt',
	lineJoin: 'miter',
};

function createGenericFigure(style: Style, points: Point[]): GenericFigure {
	return {
		style,
		points,
		setStyle(ctx) {
			ctx.strokeStyle = this.style.color ?? 'black';
			ctx.lineWidth = this.style.lineWidth ?? 1;
			ctx.lineCap = this.style.lineCap ?? 'butt';
			ctx.lineJoin = this.style.lineJoin ?? 'miter';
			ctx.miterLimit = this.style.milterLimit ?? 10;
		},
		tracePath() {},
		drawGhost(ctx, end) {
			if (this.points.length === 0) return;

			ctx.strokeStyle = 'black';
			ctx.lineWidth = 1;
			ctx.lineCap = 'butt';
			ctx.lineJoin = 'miter';
			ctx.setLineDash([2, 3]);

			this.tracePath(ctx);
			ctx.lineTo(end.x, end.y);
			ctx.stroke();

			ctx.fillStyle = 'white';
			ctx.setLineDash([]);

			let unpainted = true;
			for (let point of this.points) {
				if (
					unpainted &&
					end.x > point.x - 4 &&
					end.x < point.x + 4 &&
					end.y > point.y - 4 &&
					end.y < point.y + 4
				) {
					ctx.fillStyle = 'red';
					ctx.fillRect(point.x - 2, point.y - 2, 4, 4);
					ctx.fillStyle = 'white';
					unpainted = false;
				} else {
					ctx.fillRect(point.x - 2, point.y - 2, 4, 4);
				}
				ctx.strokeRect(point.x - 2, point.y - 2, 4, 4);
			}
		},
		draw(ctx) {
			this.setStyle(ctx);
			this.tracePath(ctx);
			ctx.stroke();
			ctx.closePath();
		},
	}
}

export function createPathFigure(
	style: Style = defaultStyle,
	points: Point[] = []
): Figure {
	let closed;

	if (points.length) {
		closed =
			points[0].x === points[0].y &&
			points[points.length - 1].x === points[points.length - 1].y;
		if (closed) points.pop();
	}

	return {
		...createGenericFigure(style, points),
		closed,
		addPoint(point: Point) {
			let lastPoint = this.points[0];

			if (
				this.points.length > 2 &&
				point.x === lastPoint.x &&
				point.y === lastPoint.y
			) {
				this.closed = true;
				return true;
			} else {
				this.points.push({ ...point });
				return false;
			}
		},
		tracePath(ctx: CanvasRenderingContext2D) {
			ctx.beginPath();
			for (let point of this.points) {
				ctx.lineTo(point.x, point.y);
			}
			if (this.closed) ctx.closePath();
		}
	};
}

export function createLineFigure(
	style: Style = {
		color: '#00000',
		lineWidth: 1,
		lineCap: 'butt',
		lineJoin: 'miter',
	},
	points: Point[] = []
): Figure {
	return {
		...createGenericFigure(style, points),
		addPoint(point: Point) {
			this.points.push({ ...point });

			return this.points.length >= 2;
		},
		tracePath(ctx: CanvasRenderingContext2D) {
			ctx.beginPath();
			ctx.moveTo(points[0]?.x, points[0]?.y);
			ctx.lineTo(points[1]?.x, points[1]?.y);
		},
	};
}

export function createRectangleFigure(
	style: Style = {
		color: '#00000',
		lineWidth: 1,
		lineCap: 'butt',
		lineJoin: 'miter',
	},
	points: Point[] = []
): Figure {
	return {
		...createGenericFigure(style, points),
		addPoint(point: Point) {
			this.points.push({ ...point });

			return this.points.length >= 2;
		},
		tracePath(ctx: CanvasRenderingContext2D) {
			ctx.beginPath();
			ctx.moveTo(points[0]?.x, points[0]?.y);
			ctx.lineTo(points[1]?.x, points[0]?.y);
			ctx.lineTo(points[1]?.x, points[1]?.y);
			ctx.lineTo(points[0]?.x, points[1]?.y);
			ctx.closePath();
		},
		drawGhost(ctx, end) {
			if (this.points.length === 0) return;

			ctx.strokeStyle = 'black';
			ctx.lineWidth = 1;
			ctx.lineCap = 'butt';
			ctx.lineJoin = 'miter';
			ctx.setLineDash([2, 3]);

			ctx.beginPath();
			ctx.moveTo(points[0]?.x, points[0]?.y);
			ctx.lineTo(end.x, points[0]?.y);
			ctx.lineTo(end.x, end.y);
			ctx.lineTo(points[0]?.x, end.y);
			ctx.closePath();
			ctx.stroke();

			ctx.fillStyle = 'white';
			ctx.setLineDash([]);

			let unpainted = true;
			for (let point of this.points) {
				if (
					unpainted &&
					end.x > point.x - 4 &&
					end.x < point.x + 4 &&
					end.y > point.y - 4 &&
					end.y < point.y + 4
				) {
					ctx.fillStyle = 'red';
					ctx.fillRect(point.x - 2, point.y - 2, 4, 4);
					ctx.fillStyle = 'white';
					unpainted = false;
				} else {
					ctx.fillRect(point.x - 2, point.y - 2, 4, 4);
				}
				ctx.strokeRect(point.x - 2, point.y - 2, 4, 4);
			}
		},
	};
}

interface OneDollarOptions {
  score: number;
  parts: number;
  step: number;
  angle: number;
  size: number;
}

interface GestureResult {
  name: string;
  score: number;
}

class OneDollar {
  private options: OneDollarOptions;
  private templates: { name: string; points: [number, number][] }[];

  constructor(options: OneDollarOptions) {
    this.options = options;
    this.templates = [];
  }

  add(name: string, points: [number, number][]): void {
    this.templates.push({ name, points: this.processPoints(points) });
  }

  check(points: [number, number][]): GestureResult | boolean {
    if (points.length < 2) return false;

    const processedPoints = this.processPoints(points);
    let bestMatch = { name: '', score: 0 };
    let bestScore = -1;

    for (const template of this.templates) {
      const score = this.comparePoints(processedPoints, template.points);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = { name: template.name, score };
      }
    }

    return bestScore >= this.options.score ? bestMatch : false;
  }

  private processPoints(points: [number, number][]): [number, number][] {
    // Resample points to have a fixed number of points
    let processed = this.resample(points);
    
    // Scale to a standard size
    processed = this.scale(processed);
    
    // Translate to origin
    processed = this.translate(processed);
    
    return processed;
  }

  private resample(points: [number, number][]): [number, number][] {
    const interval = this.pathLength(points) / (this.options.parts - 1);
    const resampled: [number, number][] = [points[0]];
    let D = 0;

    for (let i = 1; i < points.length; i++) {
      const d = this.distance(points[i - 1], points[i]);
      if (D + d >= interval) {
        const qx = points[i - 1][0] + ((interval - D) / d) * (points[i][0] - points[i - 1][0]);
        const qy = points[i - 1][1] + ((interval - D) / d) * (points[i][1] - points[i - 1][1]);
        resampled.push([qx, qy]);
        points.splice(i, 0, [qx, qy]);
        D = 0;
      } else {
        D += d;
      }
    }

    while (resampled.length < this.options.parts) {
      resampled.push([...points[points.length - 1]]);
    }

    return resampled;
  }

  private scale(points: [number, number][]): [number, number][] {
    const minX = Math.min(...points.map(p => p[0]));
    const maxX = Math.max(...points.map(p => p[0]));
    const minY = Math.min(...points.map(p => p[1]));
    const maxY = Math.max(...points.map(p => p[1]));
    
    const size = this.options.size;
    const scaleX = size / (maxX - minX);
    const scaleY = size / (maxY - minY);
    
    return points.map(([x, y]): [number, number] => [
      x * scaleX,
      y * scaleY
    ]);
  }

  private translate(points: [number, number][]): [number, number][] {
    const centroid = this.getCentroid(points);
    return points.map(([x, y]): [number, number] => [
      x - centroid[0],
      y - centroid[1]
    ]);
  }

  private pathLength(points: [number, number][]): number {
    let length = 0;
    for (let i = 1; i < points.length; i++) {
      length += this.distance(points[i - 1], points[i]);
    }
    return length;
  }

  private distance(p1: [number, number], p2: [number, number]): number {
    const dx = p2[0] - p1[0];
    const dy = p2[1] - p1[1];
    return Math.sqrt(dx * dx + dy * dy);
  }

  private getCentroid(points: [number, number][]): [number, number] {
    const x = points.reduce((sum, p) => sum + p[0], 0) / points.length;
    const y = points.reduce((sum, p) => sum + p[1], 0) / points.length;
    return [x, y];
  }

  private comparePoints(points1: [number, number][], points2: [number, number][]): number {
    let totalDistance = 0;
    for (let i = 0; i < points1.length; i++) {
      totalDistance += this.distance(points1[i], points2[i]);
    }
    return 1 - (totalDistance / (points1.length * this.options.size));
  }
}

export default OneDollar;

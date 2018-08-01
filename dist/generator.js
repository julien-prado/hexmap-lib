import { Hex } from "./Hex";
import { NoiseLayer, ProfiledLayer } from "./layer/";
import { Options } from "./Options";
export class Generator {
    constructor(options) {
        this.layers = [];
        this.options = new Options(options);
    }
    async generate() {
        if (this.options.profile) {
            const layer = new ProfiledLayer(this.options.width, this.options.height, this.options.profile);
            this.layers.push(layer);
            await layer.tesselate();
        }
        else {
            this.layers.push(new NoiseLayer(this.options.seed, this.options.noiseImpact * 0.5));
        }
        for (let d = 1; d <= this.options.depth; d++) {
            this.layers.push(new NoiseLayer(this.options.seed + d, this.options.noiseImpact * d));
        }
        const mapData = [];
        for (let i = 0; i < this.options.width; i++) {
            for (let j = 0; j < this.options.height; j++) {
                const hex = new Hex(i, j);
                hex.height = this.getUV(i, j) + this.options.landSea;
                mapData.push(hex);
            }
        }
        return mapData;
    }
    getUV(u, v) {
        return this.layers.reduce((accu, curr, index) => {
            return accu + curr.getUV(u, v) / Math.pow(2, index + 1);
        }, 0);
    }
}
//# sourceMappingURL=Generator.js.map
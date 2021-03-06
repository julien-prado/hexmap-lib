import * as Alea from "alea";
import * as SimplexNoise from "simplex-noise";
export class NoiseLayer {
    /**
     *
     * @param size
     * @param resolution
     * @param seed
     * @param profile
     */
    constructor(seed, noiseImpact) {
        this.noiseImpact = noiseImpact;
        this.simplex = new SimplexNoise(Alea(seed));
    }
    /**
     * Retourne la valeur pour les coordonnées U et V du layer
     * @param u
     * @param v
     */
    getUV(u, v) {
        return this.simplex.noise2D(u * this.noiseImpact, v * this.noiseImpact);
    }
}
//# sourceMappingURL=noiseLayer.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const geom_1 = require("@bluemath/geom");
const Alea = require("alea");
const SimplexNoise = require("simplex-noise");
class NurbsGenerator {
    constructor(seed, profile) {
        this.simplex = new SimplexNoise(Alea(seed));
        this.nurbs = [];
        this.presetProfile = this.generatePresetProfile(profile);
    }
    nurbsGenerator(x, y, p, size, func) {
        var controlPoints = [
            [
                [0, func(4 * x, 4 * y), 0],
                [0, func(4 * x, 4 * y + p), 1],
                [0, func(4 * x, 4 * y + 2 * p), 2],
                [0, func(4 * x, 4 * y + 3 * p), 3],
                [0, func(4 * x, 4 * y + 4 * p), 4]
            ],
            [
                [1, func(4 * x + p, 4 * y), 0],
                [1, func(4 * x + p, 4 * y + p), 1],
                [1, func(4 * x + p, 4 * y + 2 * p), 2],
                [1, func(4 * x + p, 4 * y + 3 * p), 3],
                [1, func(4 * x + p, 4 * y + 4 * p), 4]
            ],
            [
                [2, func(4 * x + 2 * p, 4 * y), 0],
                [2, func(4 * x + 2 * p, 4 * y + p), 1],
                [2, func(4 * x + 2 * p, 4 * y + 2 * p), 2],
                [2, func(4 * x + 2 * p, 4 * y + 3 * p), 3],
                [2, func(4 * x + 2 * p, 4 * y + 4 * p), 4]
            ],
            [
                [3, func(4 * x + 3 * p, 4 * y), 0],
                [3, func(4 * x + 3 * p, 4 * y + p), 1],
                [3, func(4 * x + 3 * p, 4 * y + 2 * p), 2],
                [3, func(4 * x + 3 * p, 4 * y + 3 * p), 3],
                [3, func(4 * x + 3 * p, 4 * y + 4 * p), 4]
            ],
            [
                [4, func(4 * x + 4 * p, 4 * y), 0],
                [4, func(4 * x + 4 * p, 4 * y + p), 1],
                [4, func(4 * x + 4 * p, 4 * y + 2 * p), 2],
                [4, func(4 * x + 4 * p, 4 * y + 3 * p), 3],
                [4, func(4 * x + 4 * p, 4 * y + 4 * p), 4]
            ]
        ];
        var knots = [0, 0, 0, 0, 0.5, 1, 1, 1, 1];
        var degree = 3;
        var bSplineSurface = new geom_1.nurbs.BSplineSurface(degree, degree, knots, knots, controlPoints);
        var nurbsSurface = bSplineSurface.tessellatePoints(size);
        return function (u, v) {
            return nurbsSurface.getN(u, v, 1);
        };
    }
    /**
    *getNurbsFunction
    */
    getNurbsFunction(layer, width, height, size) {
        if (!this.nurbs[layer]) {
            this.nurbs[layer] = [];
        }
        if (!this.nurbs[layer][width]) {
            this.nurbs[layer][width] = [];
        }
        if (!this.nurbs[layer][width][height]) {
            if (layer > 0) {
                var p = Math.pow(2, layer);
                this.nurbs[layer][width][height] = this.nurbsGenerator(width * p, height * p, p, size, (x, y) => { return this.simplex.noise2D(x, y); });
            }
            else {
                this.nurbs[layer][width][height] = this.nurbsGenerator(width, height, 1, size, (x, y) => { return this.presetProfile[x][y]; });
            }
        }
        return this.nurbs[layer][width][height];
    }
    /**
    *generatePresetProfile
    */
    generatePresetProfile(profile) {
        var coef = [];
        var presetProfile = [];
        for (var i = 0; i < profile.length; i++) {
            for (var j = 0; j < profile[i].length; j++) {
                var p = profile[j][i];
                for (var x = 0; x < 5; x++) {
                    if (!presetProfile[i * 4 + x]) {
                        coef[i * 4 + x] = [];
                        presetProfile[i * 4 + x] = [];
                    }
                    for (var y = 0; y < 5; y++) {
                        if (!presetProfile[i * 4 + x][j * 4 + y]) {
                            coef[i * 4 + x][j * 4 + y] = 1;
                            presetProfile[i * 4 + x][j * 4 + y] = p[y][x];
                        }
                        else {
                            coef[i * 4 + x][j * 4 + y]++;
                            presetProfile[i * 4 + x][j * 4 + y] += p[y][x];
                        }
                    }
                }
            }
        }
        for (var i = 0; i < coef.length; i++) {
            for (var j = 0; j < coef[i].length; j++) {
                presetProfile[i][j] = presetProfile[i][j] / coef[i][j];
            }
        }
        return presetProfile;
    }
}
exports.NurbsGenerator = NurbsGenerator;
//# sourceMappingURL=NurbGenerator.js.map
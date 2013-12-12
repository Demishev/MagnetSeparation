var constants = {
    a : 1,
    hi: 48,  //TODO naming!!!!!
    Vnf: 1,
    dr: 1,

    liquidVelocity: {
        x: 0,
        y: 0,
        z: 1
    },

    eta: 65,
    b  : 0.04,

    C: 10 // (this.eta * this.Vnf) / (12* Math.PI * this.eta * this.b)
};


var externalField = {
    parallelField: function (p) {
        return {
            x: 0,
            y: 0,
            z: p.z / 100
        }
    },
    perpendicularField: function (p) {
        return {
            x: -p.x,
            y: -p.y,
            z: -p.z
        }
    }
};


var vectorSquare = function(vector, p) {
        return Math.pow(vector(p).x, 2) + Math.pow(vector(p).y, 2) + Math.pow(vector(p).z, 2);
};

var grad = function (scalar, p, field) {
    return {
        x: (scalar(field, {x: p.x + constants.dr, y: p.y, z: p.z}) - scalar(field, p)) / constants.dr,
        y: (scalar(field, {x: p.x, y: p.y + constants.dr, z: p.z}) - scalar(field, p)) / constants.dr,
        z: (scalar(field, {x: p.x, y: p.y, z: p.z + constants.dr}) - scalar(field, p)) / constants.dr
    };
};



var calculateVelocity = function(field, p) {
    return {
        x: constants.C * grad(vectorSquare, p, field).x + constants.liquidVelocity.x,
        y: constants.C * grad(vectorSquare, p, field).y + constants.liquidVelocity.y,
        z: constants.C * grad(vectorSquare, p, field).z + constants.liquidVelocity.z
    }
};

var vectorModule = function(v) {
    return Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2) + Math.pow(v.z, 2));
};


var isFrictionHeld = function(field, p) {
    while (p.z < 0 && vectorModule(p) > constants.a) {
        var v = calculateVelocity(field, p);
        var dt = constants.dr / vectorModule(v);

        p.x += v.x * dt;
        p.y += v.y * dt;
        p.z += v.z * dt;
        console.log(v);
        console.log(dt);
        console.log(p);
    }
    return vectorModule(p) <= constants.a;
};


const fs = require('fs')
const lockFile = require('lockfile');
const constants = require('./constants');
var execFileSync = require("child_process").execFileSync;
var spawnSync = require("child_process").spawnSync;
//const { param } = require('../routes/api');
const crypto = require("crypto");


module.exports = function () {

    //creates an array of parameters to pass to the exe
    this.createParamString = function (params) {

        let paramString = [];

        if (params.hasOwnProperty("seq_sep")) {
            paramString.push("-s", params.seq_sep);
        }
        if (params.hasOwnProperty("illformed")) {
            paramString.push("--illformed", params.illformed);
        }
        if (params.hasOwnProperty("no_hydrogen")) {
            paramString.push("-n");
        }
        if (params.hasOwnProperty("keep_water")) {
            paramString.push("-w");
        }
        console.log(params.isRin);
        if (params.isRin === true) {
            paramString.push("rin");
            console.log(params.isRin);
            if (params.hasOwnProperty("policy")) {
                paramString.push("--policy", params.policy);
            }
            if (params.hasOwnProperty("hydrogen_bond")) {
                paramString.push("--hydrogen-bond", params.hydrogen_bond);
            }
            if (params.hasOwnProperty("vdw_bond")) {
                paramString.push("--vdw-bond", params.vdw_bond);
            }
            if (params.hasOwnProperty("ionic_bond")) {
                paramString.push("--ionic-bond", params.ionic_bond);
            }
            if (params.hasOwnProperty("pication_bond")) {
                paramString.push("--pication-bond", params.pication_bond);
            }
            if (params.hasOwnProperty("pipistack_bond")) {
                paramString.push("--pipistack-bond", params.pipistack_bond);
            }
            if (params.hasOwnProperty("h_bond_angle")) {
                paramString.push("--h-bond-angle", params.h_bond_angle);
            }
            if (params.hasOwnProperty("pication_angle")) {
                paramString.push("--pication-angle", params.pication_angle);
            }
            if (params.hasOwnProperty("pipistack_normal_normal")) {
                paramString.push("--pipistack-normal-normal", params.pipistack_normal_normal);
            }
            if (params.hasOwnProperty("pipistack_normal_centre")) {
                paramString.push("--pipistack-normal-centre", params.pipistack_normal_centre);
            }

        } else if (params.isCmap === true) {
            paramString.push("cmap");
            if (params.hasOwnProperty("type")) {
                paramString.push("--type", params.type);
            }
            if (params.hasOwnProperty("distance")) {
                paramString.push("--distance", params.distance);
            }

        }
        return paramString;
    }

    //creates the .pdb input file and passes it to the .exe with parameters, then deletes the created files
    this.createRIN = function (content, res, pdbname, paramString) {

        //pdbname = pdbname.split('.').slice(0, -1).join('.');

        const id = crypto.randomBytes(16).toString("hex");

        //creates a pdb file at the specified path
        console.log('\tCreating ' + id + "-" + pdbname + '...');

        try {
            fs.writeFileSync(constants.PATH_TO_INPUT + id + "-" + pdbname, content);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                response: "Internal Error",
                data: {
                    code: 500,
                    message: "Error writing the contents of the input file",
                }
            });
            console.log('End');
            return;
        }
        console.log('\tCreated ' + id + "-" + pdbname);

        //concatenates the various parameters
        let paths = ["-i", constants.PATH_TO_INPUT + id + "-" + pdbname, '-o', constants.PATH_TO_OUTPUT + id + "-" + pdbname + '.xml', "-l", "./" + id + ".txt"];
        let params = paths.concat(paramString);

        console.log('\tArgs pass to exe: ' + params);

        //pass everything to the exe and execute 
        console.log('\tRunning exe...');

        try {
            result = execFileSync(constants.PATH_TO_RING, params);
        } catch (error) {
            console.log(error);
            res.status(400).json({
                response: "Bad request",
                data: {
                    code: 400,
                    message: error.message
                }
            });
            console.log('End');
            return;
        }

        console.log('\tExecuted successfully');

        //inserts the output of the exe into xmldoc
        try {
            var xmldoc = fs.readFileSync(constants.PATH_TO_OUTPUT + id + "-" + pdbname + '.xml');
        } catch (error) {
            console.log(error);
            res.status(500).json({
                response: "Internal Error",
                data: {
                    code: 500,
                    message: error.message
                }
            });
            console.log('End');
            return;
        }

        try {
            var log = fs.readFileSync("./" + id + ".txt");
        } catch (error) {
            console.log(error);
            res.status(500).json({
                response: "Internal Error",
                data: {
                    code: 500,
                    message: error.message
                }
            });
            console.log('End');
            return;
        }

        // delete the files created
        console.log('\tDeleting residual files...');
        try {
            fs.unlinkSync(constants.PATH_TO_INPUT + id + "-" + pdbname);
            console.log('\tDeleted ' + id + "-" + pdbname);

            fs.unlinkSync(constants.PATH_TO_OUTPUT + id + "-" + pdbname + '.xml');
            console.log('\tDeleted ' + id + "-" + pdbname + '.xml');

            fs.unlinkSync("./" + id + ".txt");
            console.log('\tDeleted main.txt in logs directory');

        } catch (error) {
            console.log(error);
            res.status(500).json({
                response: "Internal Error",
                data: {
                    code: 500,
                    message: error.message
                }
            });
            console.log('End');
            return;
        }

        //send result
        console.log('End');
        res.status(200).json({
            response: "Success",
            data: {
                code: 200,
                message: "Execution completed successfully",
                log: log.toString(),
                xml: xmldoc.toString()
            }
        });
        return;

    }
}

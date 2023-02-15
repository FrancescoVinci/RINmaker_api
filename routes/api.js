const express = require('express');
const router = express.Router();
const https = require('https')
const PostFromName = require('../models/PostFromName');
const PostFromContent = require('../models/PostFromContent');
const constants = require('../includes/constants');
const { response } = require('express');
require('../includes/function.js')();


//returns an xml of the specified .pdb
router.post('/requestxml/fromname', async (req, res) => {

    let date = new Date().toLocaleString();

    console.log('[/requestxml/fromname]:Incoming request ' + date);
    
    console.log(req.body.pdbname)

    const post = new PostFromName({
        pdbname: req.body.pdbname,
        no_hydrogen: req.body.no_hydrogen,
        keep_water: req.body.keep_water,
        seq_sep: req.body.seq_sep,
        illformed: req.body.illformed,
        isRin: req.body.isRin,
        isCmap: req.body.isCmap,
        policy: req.body.policy,
        hydrogen_bond: req.body.hydrogen_bond,
        vdw_bond: req.body.vdw_bond,
        ionic_bond: req.body.ionic_bond,
        pication_bond: req.body.pication_bond,
        pipistack_bond: req.body.pipistack_bond,
        h_bond_angle: req.body.h_bond_angle,
        pication_angle: req.body.pication_angle,
        pipistack_normal_normal: req.body.pipistack_normal_normal,
        pipistack_normal_centre: req.body.pipistack_normal_centre,
        type: req.body.type,
        distance: req.body.distance
    });

    const regexpPDB = /^[\w\-_\s]+.pdb$/;
    const regexpCIF = /^[\w\-_\s]+.cif$/;

    if (!post.pdbname.match(regexpPDB) && !post.pdbname.match(regexpCIF)) {
        return res.status(400).json({
            response: "Bad request",
            data: {
                code: 400,
                message: "File extension not present"
            }
        });
    }

    post.validate()

        .then( () => {

            let paramString = createParamString(req.body);


            https.get("https://files.rcsb.org/view/" + post.pdbname, r => {
                var size = r.headers['content.length'];

                if (size > 52428800) {
                    console.log('File size exceeds the maximum limit');
                    res.status(400).json({
                        response: "Bad request",
                        data: {
                            code: 400,
                            message: 'File size exceeds the maximum limit'
                        }
                    });
                    console.log('End');
                } else {
                    console.log('\tRequest submitted to rcbs.org');
                    console.log(`\tStatus code: ${r.statusCode}`);

                }

                let data = '';

                if (r.statusCode === 404) {
                    console.log('\tFile does not exist in rcbs.org');
                    res.status(404).json({
                        response: "Not found",
                        data: {
                            code: 404,
                            message: "The file you are looking for does not exist"
                        }
                    });
                    console.log('End');
                } else if (res.statusCode === 200) {
                    console.log('\tGetting file from rcbs.org');
                    r.setEncoding('utf8');
                    r.on('data', chunk => {
                        data += chunk;
                    });
                    r.on('end', () => {
                        console.log("ok");
                        console.log('\tFile obtained correctly');
                        createRIN(data, res, post.pdbname, paramString);
                    });
                }
            }).on('error', err => {
                console.log(err.message);
                res.status(500).json({
                    response: "Internal error",
                    data: {
                        code: 500,
                        message: 'Error retrieving file from files.rcsb.org'
                    }
                });
                console.log('End');
                return;
            }).end();


            /*const request = https.request(options, r => {
                var size = r.headers['content.length'];

                if (size > 52428800) {
                    console.log('File size exceeds the maximum limit');
                    res.status(400).json({
                        response: "Bad request",
                        data: {
                            code: 400,
                            message: 'File size exceeds the maximum limit'
                        }
                    });
                    console.log('End');
                } else {

                    console.log('\tRequest submitted to rcbs.org');
                    console.log(`\tStatus code: ${r.statusCode}`);

                    r.on('error', error => {
                        console.log(error);
                        res.status(500).json({
                            response: "Internal error",
                            data: {
                                code: 500,
                                message: 'Error retrieving file from files.rcsb.org'
                            }
                        });
                        console.log('End');
                        return;
                    });

                    let str = '';

                    if (r.statusCode == 404) {
                        console.log('\tFile does not exist in rcbs.org');
                        res.status(404).json({
                            response: "Not found",
                            data: {
                                code: 404,
                                message: "The file you are looking for does not exist"
                            }
                        });
                        console.log('End');
                    } else if (r.statusCode == 200) {
                        console.log('\tGetting file from rcbs.org');
                        r.setEncoding('utf8');
                        r.on('data', chunk => {
                            str += chunk;
                        })
                            .on('end', function () {
                                console.log('\tFile obtained correctly');
                                createRIN(str, res, post.pdbname, paramString);
                            });
                    }
                }
            });

            request.on('error', error => {

            });

            request.end();*/
        })
        .catch(error => {
            console.log(error);
            res.status(400).json({
                response: 400,
                data: {
                    code: 400,
                    message: error.errors
                }
            });
            console.log('End');
        });
});

//returns an xml of the specified .pdb from content
router.post('/requestxml/fromcontent', async (req, res) => {

    let date = new Date().toLocaleString();

    console.log('[/requestxml/fromcontent]:Incoming request ' + date);

    const post = new PostFromContent({
        content: req.body.content,
        pdbname: req.body.pdbname,
        no_hydrogen: req.body.no_hydrogen,
        keep_water: req.body.keep_water,
        seq_sep: req.body.seq_sep,
        illformed: req.body.illformed,
        isRin: req.body.isRin,
        isCmap: req.body.isCmap,
        policy: req.body.policy,
        hydrogen_bond: req.body.hydrogen_bond,
        vdw_bond: req.body.vdw_bond,
        ionic_bond: req.body.ionic_bond,
        pication_bond: req.body.pication_bond,
        pipistack_bond: req.body.pipistack_bond,
        h_bond_angle: req.body.h_bond_angle,
        pication_angle: req.body.pication_angle,
        pipistack_normal_normal: req.body.pipistack_normal_normal,
        pipistack_normal_centre: req.body.pipistack_normal_centre,
        type: req.body.type,
        distance: req.body.distance
    });

    const regexpPDB = /^[\w\-_\s]+.pdb$/;
    const regexpCIF = /^[\w\-_\s]+.cif$/;

    if (!post.pdbname.match(regexpPDB) && !post.pdbname.match(regexpCIF)) {
        return res.status(400).json({
            response: "Bad request",
            data: {
                code: 400,
                message: "File extension not present"
            }
        })
    }

    post.validate()
        .then(async () => {

            let paramString = await createParamString(req.body);

            console.log('\tGetting file from the content field');
            createRIN(post.content, res, post.pdbname, paramString);
        })
        .catch(error => {
            console.log(error.errors);
            res.status(400).json({
                response: "Bad request",
                error: {
                    code: 400,
                    message: error.errors
                }
            });
            console.log('End');
        });
});

module.exports = router;

const mongoose = require('mongoose');
const regexpINT = /^\+?\d+$/;


//create a json schema for xml requests by content and specifies the type of fields.
//Also attaches functions for validation.
const PostSchemaFromContent = mongoose.Schema({
    content: {
        type: String,
        required: [true, "content property is required"]
    },
    pdbname: {
        type: String,
        required: [true, "pdbname property is required"]
    },
    no_hydrogen: {
        type: Boolean
    },
    keep_water: {
        type: Boolean,
    },
    seq_sep: {
        type: Number,
        validate: {
            validator: function (v) {
                return regexpINT.test(v);
            },
            message: props => "seq_sep property takes only positive integers"
        },
        min: [0, "seq_sep takes only positive integers"],
        max: [20, "seq_sep takes only positive integers less than 20"]
    },
    illformed: {
        type: String,
        enum: ["fail", "kall", "kres", "sres"],
    },
    isRin: {
        type: Boolean,
        required: [true, "isRin property is required"]
    },
    isCmap: {
        type: Boolean,
        required: [true, "isCmap property is required"]
    },
    policy: {
        type: String,
        enum: ["all", "multiple", "one"],
    },
    hydrogen_bond: {
        type: Number,
        min: [0, "hydrogen_bond takes only positive floats"],
        max: [20, "hydrogen_bond takes only positive floats less than 20"]
    },
    vdw_bond: {
        type: Number,
        max: [20, "vdw_bond takes only floats less than 20"]
    },
    ionic_bond: {
        type: Number,
        min: [0, "ionic_bond takes only positive floats"],
        max: [20, "ionic_bond takes only positive floats less than 20"]
    },
    pication_bond: {
        type: Number,
        min: [0, "pication_bond takes only positive floats"],
        max: [20, "pication_bond takes only positive floats less than 20"]
    },
    pipistack_bond: {
        type: Number,
        min: [0, "pipistack_bond takes only positive floats"],
        max: [20, "pipistack_bond takes only positive floats less than 20"]
    },
    h_bond_angle: {
        type: Number,
        min: [0, "h_bond_angle takes only positive numbers"],
    },
    pication_angle: {
        type: Number,
        min: [0, "pication_angle takes only positive numbers"],
    },
    pipistack_normal_normal: {
        type: Number,
        min: [0, "pipistack_normal_normal takes only positive numbers"],
    },
    pipistack_normal_centre: {
        type: Number,
        min: [0, "pipistack_normal_centre takes only positive numbers"],
    },
    type: {
        type: String,
        enum: ["ca", "cb"],
    },
    distance: {
        type: Number,
        min: [0, "distance takes only positive numbers"],
        max: [20, "distance takes only positive numbers less than 20"],
    }
});

module.exports = mongoose.model('PostFromContent', PostSchemaFromContent);
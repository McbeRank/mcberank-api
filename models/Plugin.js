const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const slug = require('slug');

var Schema = new mongoose.Schema({
	slug: { type: String, lowercase: true, unique: true },
	name: String,
	version: { type: String, default: 'unknown' },
	servers: { type: Number, default: 0 },
});

Schema.plugin(uniqueValidator, { message: 'is already taken' });

Schema.methods.slugify = function () {
	this.slug = encodeURIComponent(this.name) + '-' + encodeURIComponent(this.version);
};

Schema.pre('validate', function (next) {
	if (!this.slug) this.slugify();

	next();
});

Schema.methods.countReferencedServer = async function () {
	this.servers = await mongoose
		.model('Server')
		.countDocuments({ plugins: { $in: this } })
		.exec();
	await this.save();
};

module.exports = mongoose.model('Plugin', Schema);

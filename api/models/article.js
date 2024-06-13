const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
_id: mongoose.Schema.Types.ObjectId,
title: String,
description: String,
imgUrl: String,
content: String,
sourceUrl: String,
author: String,
createdAt: Date
});

module.exports = mongoose.model('Article', articleSchema);
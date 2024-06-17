const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Article = require('../models/article');

// ALL
router.get('/', (req, res, next) => {
  const page = req.query.p || 0;
  const articlesPerPage = 9;
  Article.find()
  .sort({createdAt: - 1})
  .skip( page * articlesPerPage)
  .limit(articlesPerPage)
  .exec()
  .then(docs => {
    // console.log(docs);
      res.status(200).json(docs);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});

//TOP 10
router.get('/top', (req, res, next) => {
  Article.find().limit(10).sort({createdAt: -1})
  .exec()
  .then(docs => {
    // console.log(docs);
    res.status(200).json(docs);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
  
});

// find by category
router.get('/category/:category', (req, res, next) => {
  //  const category = req.params.category;
   Article.find({category: req.params.category}).sort({createdAt: -1})
   .exec()
   .then(doc => {
    // console.log("From database", doc);
    if(doc) {
      res.status(200).json(doc)
      console.log(doc);
    } else {
      res.status(404).json({
        message: 'No valid entry found for this id'
      });
    }
   }).catch(err => 
    {
      console.log(err);
      res.status(500).json({error: err});
    }  
  );
});

// Search Endpoint
router.get('/search/:q', (req, res, next) => {
   Article.find(
    {
      
      "$or": [
       {title: {$regex:req.params.q}},
       {description: {$regex:req.params.q}},
       {content: {$regex:req.params.q}},
       {content2: {$regex:req.params.q}},
       {content3: {$regex:req.params.q}},
      ]
      
    }).sort({createdAt: -1})
   .exec()
   .then(doc => {
    // console.log("From database", doc);
    if(doc) {
      res.status(200).json(doc)
      // console.log(doc);
    } else {
      res.status(404).json({
        message: 'No valid entry found for this id'
      });
    }
   }).catch(err => 
    {
      console.log(err);
      res.status(500).json({error: err});
    }  
  );
});


router.get('/:articleId', (req, res, next) => {
  const id = req.params.articleId;
 Article.findById(id)
 .exec()
 .then(doc => {
  // console.log("From database", doc);
  if(doc) {
    res.status(200).json(doc)
  } else {
    res.status(404).json({
      message: 'No valid entry found for this id'
    });
  }
 }).catch(err => 
  {
    console.log(err);
    res.status(500).json({error: err});
  }  
);
});
router.patch('/:articleId', (req, res, next) => {
    const id = req.params.articleId;
    const updateOps = {}
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
    Article.findOneAndUpdate({ _id: id }, {$set: updateOps})
    .exec()
    .then(result=>{
      // console.log(result);
      res.status(200).json(result)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    })
    ;
    res.status(200).json({
      message: 'Updated article',
    });
});

router.delete('/:articleId', (req, res, next) => {
  const id = req.params.articleId
  Article.findOneAndDelete({ _id: id })
  .exec()
  .then(result => {
    res.status(200).json(result)
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    })
  });
});
router.post('/', (req, res, next) => {
  const article = new Article({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    description: req.body.description,
    content: req.body.content,
    content2: req.body.content2,
    content3: req.body.content3,
    category: req.body.category,
    imgUrl: req.body.imgUrl,
    img2Url: req.body.img2Url,
    sourceUrl: req.body.sourceUrl,
    author: req.body.author
  });
  article
  .save()
  .then(result => {
    console.log(result);
    res.status(201).json({
      message: 'Article was created',
      createdArticle: result
    });
  })
  .catch(err=>{
    console.log(err);
    res.status(500).json({
      error: err
    })
  });
 
});

module.exports = router;
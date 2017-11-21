var express = require('express')
var app = express();
var path = require('path')
app.use(express.static(__dirname + '/'));

var getJSON = require('get-json');
var mongoose = require('mongoose');
var movie = mongoose.model('Movie', {
  id: String,
  title: String,
  titles: Array,
  image: String,
  types: Array,
  year: String,
  director: String,
  writers: Array,
  actors: Array,
  audience: String,
  description: String,
  long_description: String,
  countries: Array,
  languages: Array,
  companies: Array,
  time: String,
  imdb_rate: String
});

app.get('/api/getdblist',function(req,res) {
  Admin = mongoose.mongo.Admin;
  var allDatabases = [];
  /// create a connection to the DB    
  var connection = mongoose.createConnection(
    'mongodb://@ds115166.mlab.com:15166/mstfbiccer2');
  connection.on('open', function() {
    // connection established
    new Admin(connection.db).listDatabases(function(err, result) {
        console.log('listDatabases succeeded');
        // database list stored in result.databases
        allDatabases = result.databases;
        res.status(200)
          .send(allDatabases);
    });
  });
});
app.get('/api/setdata', function (req, res) {
  mongoose.connect('mongodb://@ds115166.mlab.com:15166/'+req.query.dbmdl, { useMongoClient: true, promiseLibrary: global.Promise });
  if (req.query.url != "" && req.query.dbmdl != "") {
    getJSON(req.query.url, function (error, response) {
      for (var i = 0; i < response.length; i++) {
        var data = new movie({
          id: response[i].id,
          title: response[i].title,
          titles: response[i].titles,
          image: response[i].image,
          types: response[i].types,
          year: response[i].year,
          director: response[i].director,
          writers: response[i].writers,
          actors: response[i].actors,
          audience: response[i].audience,
          description: response[i].description,
          long_description: response[i].long_description,
          countries: response[i].countries,
          languages: response[i].languages,
          companies: response[i].companies,
          time: response[i].time,
          imdb_rate: response[i].imdb_rate
        });
        data.save(function (err) {
          if (err) {
            console.log(err);
          }
        });
      }
      res.status(200)
        .send('Kayıt Başarıyla Gerçekleşti.');
        
    })
  } else {
    res.status(400)
      .send('Eksik veri gönderildi.')
  }
});
app.get('/api/insertdata', function (req, res) {
  mongoose.connect('mongodb://localhost/'+req.query.dbmdl, { useMongoClient: true, promiseLibrary: global.Promise });
  if (req.query.insdata != "") {
        response = JSON.parse(req.query.insdata);
        var data = new movie({
          id: response.id,
          title: response.title,
          titles: response.titles,
          image: response.image,
          types: response.types,
          year: response.year,
          director: response.director,
          writers: response.writers,
          actors: response.actors,
          audience: response.audience,
          description: response.description,
          long_description: response.long_description,
          countries: response.countries,
          languages: response.languages,
          companies: response.companies,
          time: response.time,
          imdb_rate: response.imdb_rate
        });
        data.save(function (err) {
          if (err) {
            console.log(err);
          }
        });
      res.status(200)
        .send('Kayıt Başarıyla Gerçekleşti.');
  } else {
    res.status(400)
      .send('Eksik veri gönderildi.')
  }
});
app.get('/api/get', function (req, res) {
  if (req.query.key != "" && req.query.value != "" && req.query.dbmdl != "") {
		mongoose.connect('mongodb://@ds115166.mlab.com:15166/'+req.query.dbmdl, { useMongoClient: true, promiseLibrary: global.Promise });
    var query={};
    query[req.query.key]=new RegExp('.*'+req.query.value+'.*');
    movie.find(query).exec(function (err, doc) {
       res.status(200)
        .send(doc);
        
    });
    
  }else if(req.query.dbmdl != ""){
    mongoose.connect('mongodb://@ds115166.mlab.com:15166/'+req.query.dbmdl, { useMongoClient: true, promiseLibrary: global.Promise });
    movie.where("id").exec(function (err, doc) {
      
       res.status(200)
        .send(doc);
        
    });
   
  }

});
app.get('/api/deletedata', function (req, res) {
  
    if (req.query.id != "" && req.query.dbmdl != "") {
      mongoose.connect('mongodb://@ds115166.mlab.com:15166/'+req.query.dbmdl, { useMongoClient: true, promiseLibrary: global.Promise });
      var query={};
      query["id"]=new RegExp(req.query.id);
      movie.remove(query).exec(function (err, doc) {
         res.status(200)
          .send(doc); 
      }); 
    }
  
  });
app.listen(process.env.PORT || 3000, function(){
  console.log('listening on');
});



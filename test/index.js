var mongoose = require('mongoose'),
      _                 = require('lodash'),
      Kitten         = require('./kitten');
mongoose.connect('mongodb://localhost:27017/spike');

function setup(done){
    Kitten.remove(done);
}

describe('Slugin', function(){
    describe('When saving a single kitten named Mittens', function(){
        before(setup);

        before(function(done){
            var mittens = new Kitten({name : 'Mittens'});
            mittens.save(done);
        });

        it('Should save the kitten to the database with a slug based on the kitten name', function(done){
            Kitten.findOne({slug_base : 'mittens'}, function(e,k){
                (e===null).should.be.true;
                k.slug.should.eql('mittens');
                done();
            });
        });
    });

    describe('When saving two kittens named mittens in serial', function(){
        var kittens = null;
        before(setup);
        before(function(done){
            new Kitten({name : 'Mittens'}).save(function(e){
                if(e) return done(e);
                new Kitten({name : 'Mittens'}).save(done);
            });
        });
        before(function(done){
            Kitten.find({name: 'Mittens'}, function(e,docs){
                kittens = docs;
                done(e);
            });
        });

        it('should have two kittens in the collection', function(){
            kittens.should.have.length(2);
        });
        it('one kitten should have a slug of "mittens"', function(){
            _.where(kittens, {slug: 'mittens'}).should.have.length(1);
        });
        it('one kitten should have a slug of "mittens-{num}"', function(){
            _.filter(kittens, function(k){ return (/mittens-\d+/).test(k.slug);});
        });
    });
});
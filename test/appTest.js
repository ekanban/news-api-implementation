let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();
let expect = chai.expect;
let sinon = require('sinon');

chai.use(chaiHttp);

describe('Books', function(){
    before(function() {
        return this.spy = sinon.spy(app, 'render');
      });
      after(function() {
        return this.spy.restore();
      });

  describe('/GET route', function(){

      it('it should have OK status 200', (done) => {
        chai.request(app)
            .get('/')
            .end((err, res) => {
                  res.should.have.status(200);
                  res.type.should.equal("text/html")
              done();
            });
      });

      it('should render the "landing" view', function() {
        expect(this.spy.getCall(0).args[0]).to.be.eql('landing');
      });
  
  });

  describe('/apiCall POST route', function(){
      it('should have OK status 200', (done) => {
        chai.request(app)
            .post('/apiCall')
            .type('form')
            .send({
                'country': 'in',
                'category': 'sports',
                'keyword': 'tendulkar'
            })
            .end((err, res) => {
                res.should.have.status(200);
              done();
            });
      });

      it('should have application/json type', (done) => {
      chai.request(app)
          .post('/apiCall')
          .type('form')
          .send({
              'country': '',
              'category': '',
              'keyword': 'a'
              // Specifically using these parameters because they'll always fetch some data and not run into the 'No results found' error.
          })
          .end((err, res) => {
                res.type.should.equal('application/json');
            done();
          });
    });

    it('should send error message when duplicate parameters used within 30 seconds', (done) => {
        chai.request(app)
            .post('/apiCall')
            .type('form')
            .send({
                'country': '',
                'category': '',
                'keyword': 'a'
                // Using the same parameters as in the previous request. See the test above.
            })
            .end((err, res) => {
                expect(res.text).to.contain("You cannot use same parameters if you have already used these parameters within the last 30 seconds.");
                res.type.should.equal('text/html');
                done();
            });
      });

    // // Test case to check whether app allows duplicate parameters after 30 seconds

    //   it('should allow duplicate parameters after 30 seconds', (done) => {
    //     //   Wait for 30 seconds to make the API call using same parameters as above.
    //       setTimeout(function(){
    //         chai.request(app)
    //         .post('/apiCall')
    //         .type('form')
    //         .send({
    //             'country': '',
    //             'category': '',
    //             'keyword': 'a'
    //         })
    //         .end((err, res) => {
    //             res.should.have.status(200);
    //             res.type.should.equal('application/json');
    //             done();
    //         });
    //       }, 31000)
    //   });

  

      it('should send error message when all parameters are empty', (done) => {
        chai.request(app)
            .post('/apiCall')
            .type('form')
            .send({
                'country': "",
                'category': '',
                'keyword': ''
            })
            .end((err, res) => {
                  expect(res.text).to.contain('Required parameters are missing. Please set any of the following parameters and try again: sources, q, language, country, category.');
                  res.type.should.equal('text/html');
              done();
          })
      });

      it('should send error message when no results found', (done) => {
        chai.request(app)
            .post('/apiCall')
            .type('form')
            .send({
                'country': 'ussss',
                'category': 'business',
                'keyword': 'apple'
            })
            .end((err, res) => {
                expect(res.text).to.contain('No results found');
                res.type.should.equal('text/html');
                done();
            });
      });

  })
});
const express = require('express');
let app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000

let candidates = [];
let totalCandidates = 0;

let voters = new Set();

app.get('/', (req, res) => {
    res.render('App');
});

app.get('/AddCandidates', (req,res) => {
    res.render('AddCandidates', {candidate : candidates});
});

app.get('/Vote', (req, res) => {
    res.render('Vote', {candidate: candidates, message: ""});
});

app.get('/Report', (req, res) => {
    res.render('Report', {result: candidates});
});

app.get('/PollResult', (req, res) => {
    function compare( a, b ) {
        if ( a.votes > b.votes ){
          return -1;
        }
        if ( a.votes < b.votes ){
          return 1;
        }
        return 0;
      }      
    candidates.sort(compare);
    let highest = 0;
    let runner = 1;
    console.log(candidates);
    let result = [];
    result.push({ ID: candidates[highest].ID, name: candidates[highest].name, votes: candidates[highest].votes});
    result.push({ ID: candidates[runner].ID, name: candidates[runner].name, votes: candidates[runner].votes});
    res.render('PollResult', {candidate: result});
});

app.post('/addNew', (req, res) => {
    candidates.push({ ID: req.body.studentid, name: req.body.studentname, votes: 0});
    totalCandidates++;
    res.render('AddCandidates', {candidate: candidates});
});

app.post('/totalVotes', (req, res) => {
    // console.log(req.body.studentid);
    if(voters.has(req.body.studentid)) {
        res.render('Vote', {candidate: candidates, message: "Already Voted."});
    }
    else {
        voters.add(req.body.studentid);
        for(let i=0; i<totalCandidates; i++) {
            if(candidates[i].ID == req.body.vote) {
                candidates[i].votes++;
            }
        }
        res.render('Vote', {candidate: candidates, message: "You voted successfully"});
    }
});

app.listen(PORT, ()=> { console.log(`Server is running on http://localhost:${PORT}`)});

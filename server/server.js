const express = require('express');
const cors = require('cors');
const axios = require('axios')

var app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use(cors({
    origin: '*'
}));


var coeff = {
    "ST" : {
        passing: 10,
        shooting: 46,
        defense: 0,
        dribbling: 29,
        pace: 10,
        physical:5,
        goalkeeping: 0
    },
    "CF" :{
        passing: 24,
        shooting: 23,
        defense: 0,
        dribbling: 40,
        pace: 13,
        physical:0,
        goalkeeping: 0
    },
    "LW" :{
        passing: 24,
        shooting: 23,
        defense: 0,
        dribbling: 40,
        pace: 13,
        physical:0,
        goalkeeping: 0
    },
    "RW" :{
        passing: 24,
        shooting: 23,
        defense: 0,
        dribbling: 40,
        pace: 13,
        physical:0,
        goalkeeping: 0
    },
    "CAM" :{
        passing: 34,
        shooting: 21,
        defense: 0,
        dribbling: 38,
        pace: 7,
        physical:0,
        goalkeeping: 0
    },
    "CM" :{
        passing: 43,
        shooting: 12,
        defense: 10,
        dribbling: 29,
        pace: 0,
        physical:6,
        goalkeeping: 0
    },
    "LM" :{
        passing: 43,
        shooting: 12,
        defense: 10,
        dribbling: 29,
        pace: 0,
        physical:6,
        goalkeeping: 0
    },
    "RM" :{
        passing: 43,
        shooting: 12,
        defense: 10,
        dribbling: 29,
        pace: 0,
        physical:6,
        goalkeeping: 0
    },
    "CDM" :{
        passing: 28,
        shooting: 0,
        defense: 40,
        dribbling: 17,
        pace: 0,
        physical:15,
        goalkeeping: 0
    },
    "LWB" :{
        passing: 19,
        shooting: 0,
        defense: 44,
        dribbling: 17,
        pace: 10,
        physical:10,
        goalkeeping: 0
    },
    "RWB" :{
        passing: 19,
        shooting: 0,
        defense: 44,
        dribbling: 17,
        pace: 10,
        physical:10,
        goalkeeping: 0
    },
    "LB" :{
        passing: 19,
        shooting: 0,
        defense: 44,
        dribbling: 17,
        pace: 10,
        physical:10,
        goalkeeping: 0
    },
    "RB" :{
        passing: 19,
        shooting: 0,
        defense: 44,
        dribbling: 17,
        pace: 10,
        physical:10,
        goalkeeping: 0
    },
    "CB" :{
        passing: 5,
        shooting: 0,
        defense: 64,
        dribbling: 9,
        pace: 2,
        physical:20,
        goalkeeping: 0
    },
    "GK" :{
        passing: 0,
        shooting: 0,
        defense: 0,
        dribbling: 0,
        pace: 0,
        physical:0,
        goalkeeping: 100
    }
}

function calculateOverallRating(positionCoeff, playerInfo){
    var overallRating = 0;
    for (param in positionCoeff){
        overallRating += positionCoeff[param]*playerInfo.metadata[param];
    }
    return Math.round(overallRating/100);
}

app.get('/api/coefficients/:position', function (req, res) {
    const { position } = req.params;
    if(coeff[position]) {
      res.json(coeff[position]);
    } else {
      res.status(404).json({ message: `There is no such position as ${position} ` });
    }
});


app.get('/api/player/:id', async (req, res)=>{
    try {
        const { id } = req.params;
        const response = await axios.get(`https://z519wdyajg.execute-api.us-east-1.amazonaws.com/prod/players/${id}`);
        const test = await axios.get(`https://z519wdyajg.execute-api.us-east-1.amazonaws.com/prod/players`);
        console.log(test.data.length);
        const playerInfo = response.data;
        var playerRatingInfo = {}
        playerRatingInfo["id"] = playerInfo["id"];
        playerRatingInfo["firstname"] = playerInfo.metadata.firstName;
        playerRatingInfo["lastname"] = playerInfo.metadata.lastName;
        playerRatingInfo["overallRatingPos"] = {};
        var positionCoeff;
        var positions = playerInfo.metadata.positions; 
        for (let i=0; i< positions.length; i++){
            positionCoeff = coeff[positions[i]];
            playerRatingInfo["overallRatingPos"][positions[i]] = calculateOverallRating(positionCoeff, playerInfo);
        }
        res.json(playerRatingInfo);
    } catch (error) {
        res.status(500).json({ message:  error.message});
    }

});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
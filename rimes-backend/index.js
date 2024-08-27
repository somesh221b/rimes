const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const generateSecretKey = () => {
    const secretKey = crypto.randomBytes(32).toString('hex');
    return secretKey;
};

const secretKey = generateSecretKey();
app.post('/generate-token', (req, res) => {
    const user = {
        userName:  "rimes",
        password:  "rimes@132"
    }
    jwt.sign({ user }, secretKey, { expiresIn: '300s' }, (err, token) => {
        res.json({
            token
        })
    })
})


const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (typeof token != 'undefined') {
        const bearer = token.split(" ");
        const Token = bearer[1]
        req.token = Token;
        next()
    } else {
        res.send({
            message: 'Token is not valid'
        })
    }
};

app.post('/verify-token', verifyToken, (req, res) => {
    jwt.verify(req.token, secretKey, (err, authData) => {
        if (err) {
            res.send({ result: "invalid token" })
        } else {
            res.json({
                message: 'profile accessed...',
                authData
            })
        }
    })
});
function sumLargeNumbers(input1, input2) {    
    const num1 = input1.toString();
    const num2 = input2.toString();

    const maxLength = Math.max(num1.length, num2.length);

    const paddedNum1 = num1.padStart(maxLength, '0');
    const paddedNum2 = num2.padStart(maxLength, '0');

    let carry = 0; 
    let result = '';

    for (let i = maxLength - 1; i >= 0; i--) {
        const digit1 = parseInt(paddedNum1[i]);
        const digit2 = parseInt(paddedNum2[i]);
        const sum = digit1 + digit2 + carry;

        const newDigit = sum % 10;
        carry = Math.floor(sum / 10);

        result = newDigit + result;
    }

    if (carry > 0) {
        result = carry + result;
    }

    return result;
}

app.post('/sum-algorithm',(req,res)=>{    
    const input1 = req.body.input1;
    const input2 =  req.body.input2;
    let result = sumLargeNumbers(input1, input2);
    res.send(result)
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')
// require('dotenv').config()
const app = express()

app.use(cors());
app.use(express.json())

const connection = mysql.createConnection(process.env.DATABASE_URL)

app.get('/', (req, res) => {
    res.send('Hello world!!')
})



// app.get('/users', (req, res) => {
//     connection.query(
//         'SELECT * FROM User',
//         function (err, results, fields) {
//             res.send(results)
//         }
//     )
// })





app.post('/users', (req, res) => {
    connection.query(
        'INSERT INTO `User` (`user_id`, `username`, `gmail`, `password`) VALUES (?, ?, ?, ?)',
        [req.body.user_id, req.body.username, req.body.gmail, req.body.password],
         function (err, results, fields) {
            if (err) {
                console.error('Error in POST /users:', err);
                res.status(500).send('Error adding user');
            } else {
                res.status(200).send(results);
            }
        }
    )
})








app.put('/users', (req, res) => {
    connection.query(
        'UPDATE `users` SET `fname`=?, `lname`=?, `username`=?, `password`=?, `avatar`=? WHERE id =?',
        [req.body.fname, req.body.lname, req.body.username, req.body.password, req.body.avatar, req.body.id],
         function (err, results, fields) {
            res.send(results)
        }
    )
})

app.delete('/users', (req, res) => {
    connection.query(
        'DELETE FROM `users` WHERE id =?',
        [req.body.id],
         function (err, results, fields) {
            res.send(results)
        }
    )
})

app.listen(process.env.PORT || 3000, () => {
    console.log('CORS-enabled web server listening on port 3000')
})






app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    // const sql = "SELECT * FROM user WHERE username = ?";
    connection.query("SELECT * FROM user WHERE username = ?", [username], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: 'Username not found' });
      }
  
      const user = results[0];
      if (user.password === password) {
        return res.status(200).json({ message: 'Login success', user });
      } else {
        return res.status(401).json({ message: 'Incorrect password' });
      }
    });
  });


  app.get('/getdata/:user_id', (req, res) => {
    const user_id = req.params.user_id;
    console.log(user_id);
    connection.query(
        'SELECT * FROM UserIncome WHERE user_id = ?',
        [user_id],
        function (err, results, fields) {
            if (err) {
                console.error(err);
                res.status(500).send('Database error');
            } else {
                console.log("dataUser",results);
                res.send(results);
            }
        }
    );
});






app.post('/addincome', (req, res) => {
    const { user_id, amount, tax_withhold, income_type, type_value } = req.body;
    console.log("ส่ง income",req.body);

    connection.query(
      'INSERT INTO UserIncome (user_id, amount, tax_withhold, income_type, type_value) VALUES (?, ?, ?, ?, ?)',
      [user_id, amount, tax_withhold, income_type, type_value],
      function (err, results, fields) {
        if (err) {
          console.error(err);
          res.status(500).send('Database error');
        } else {
          console.log(results);
          res.send(results);
        }
      }
    );
  });
  







  app.get('/users/:id', (req, res) => {
    const id = req.params.id;
    connection.query(
        'SELECT * FROM user WHERE user_id = ?', [id],
        function (err, results, fields) {
            console.log(results)
            res.send(results)
        }
    )
})

// export async function POST(request) {
//     try {
//       const { username, password } = await request.json();
//       const db = mysqlPool.promise();
  
//       const [Checkuser] = await db.query("SELECT * FROM user WHERE username = ?", [username]);
  
  
//       if (Checkuser.length === 0) {
//         return NextResponse.json({ error: "Username or password is incorrect" }, { status: 401 });
//       }
  
//       const user = Checkuser[0];
  
  
//       console.log("c + ",user.user_id)
  
//       const isPasswordCorrect = (password === user.password);
  
  
  
  
//       if (!isPasswordCorrect) {
//         return NextResponse.json({ error: "Username or password is incorrect" }, { status: 401 });
//       }
  
  
//       return NextResponse.json({
//         Sentstatus: true,
//         message: "successful",
//         userId: user.user_id,
//         username: user.username
//       }, { status: 200 });
  
//     } catch (error) {
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }
//   }


// export the app for vercel serverless functions
module.exports = app;

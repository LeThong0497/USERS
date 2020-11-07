var express=require('express');
var app=express();
app.listen(4000, function(){
  console.log("Listening on port 4000");
});

app.set("view engine","ejs");
app.set("views","./views");

var AWS=require('aws-sdk');
var bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

// var awsConfig={
//     "region": "",
//     "acces" "skeyId":"",
//     "secret" "AccessKey":""
// };
AWS.config.update(awsConfig);

var docClient=new AWS.DynamoDB.DocumentClient();
//get all
app.get('/',function(req,res){
  let params={
    TableName : "USERS"
  };
   
    docClient.scan(params,(err,data)=>{
        if(err){
            res.end(JSON.stringify({err : "Lỗi không truy xuất được dữ liệu!"}));
        }else{
         res.render('trangchu',{data:data});
        }
    });
});

//get page add
app.get('/User/add',function(req,res){
  res.render('add');
});

//thêm
app.post('/addUser',function(req,res){
  const { phone, email, fullname, password } =req.body;

  let params={
    TableName :"USERS",
    Item:
     {
      PhoneNumber:phone,
      Email:email,
      FullName:fullname,
      PassWord:password
    }
  };

  docClient.put(params,function(err,data){
    if(err)
    {
      res.render({
        Message : "failed to add item"

      });
    }
    else
    {
     const  {Items}=data;
      res.redirect('/');
    }
  });
});

//xóa
app.get('/delete/:PhoneNumber',function(req,res){

  let params={
    TableName :"USERS",
   Key:{
     "PhoneNumber": req.params.PhoneNumber
   }
  };

  docClient.delete(params,function(err,data){
    if(err)
    {
      res.render({
        Message : "failed to delete item"
      });
    }
    else
    {
      res.redirect('/');
    }
  });
});

// get page update 
app.get('/update/:PhoneNumber',function(req, res){
  let params = {
      TableName: "USERS",
      Key: {
        PhoneNumber: req.params.PhoneNumber
        }
  };
  docClient.get(params, function (err, data) {
      if (err) {
        res.send("users::fetchOneByKey::error - " + JSON.stringify(err, null, 2));
      } else {
         
          res.render('update', { data: data});
      }
    });

});
//cap nhat
app.post('/updateUser', function (req, res) {
  const { phone, email, fullname, password } =req.body; 
   const params = {
      TableName: 'USERS',
      Key: {
        PhoneNumber:phone
      },
      UpdateExpression: "set  Email = :email , FullName = :fullname, PassWord = :password",
      ExpressionAttributeValues: {
          
         // ":phone": phone,
          ":email": email,
          ":fullname": fullname,
          ":password": password

      },
      ReturnValues: "UPDATED_NEW"
  };
  docClient.update(params, (err, data) => {
      if (err) {
          res.send("users::save::error - " + JSON.stringify(err, null, 2));
      } else {
          res.redirect('/');
      }
  });
});

//xóa ds đã chọn
app.get('/deleteAll',function(req,res){
  const { phone, email, fullname, password,check } =req.body; 


  let params={
    TableName :"USERS",
   Key:{
     "PhoneNumber": req.params.PhoneNumber
   }
  };

  docClient.delete(params,function(err,data){
    if(err)
    {
      res.render({
        Message : "failed to delete item"
      });
    }
    else
    {
      res.redirect('/');
    }
  });
});
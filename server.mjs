import express from "express";
import mongoose from "mongoose";
import Cors from "cors";
import MessageContentModel  from "./model/dbMessages.mjs";
import loginContents from "./model/dbLog.mjs";
import bycript from "bcrypt";
import chatContent from "./model/dbChat.mjs";


import Pusher from "pusher";
import dbMessages from "./model/dbMessages.mjs";
const pusher = new Pusher({
    appId: "1747354",
    key: "89e7c6c80abcceb3d383",
    secret: "71476f7bbd884d9890e3",
    cluster: "eu",
    useTLS: true
  });

  const pusher2 = new Pusher({
    appId: "1764773",
    key: "4bf11ef876d967bc1dd9",
    secret: "bb0064399344361481aa",
    cluster: "eu",
    useTLS: true
  }); 

const hashPassword = async(password) =>{
  try{
    const saltRounds = 10;

    const hashedPassword = await bycript.hash(password, saltRounds);
    console.log("hashed password", hashedPassword);
    return hashedPassword;
  }catch(error){
    console.log(error);
  }
}

const createkey = async(name) =>{
  try{ 
    const saltRounds= 1;

    let hashedPassword = await bycript.hash(name, saltRounds);
    hashedPassword = hashedPassword.slice(-4);
    console.log("created key", hashedPassword);
    return hashedPassword;
  }catch(error){
    console.log(error);
  }
}


mongoose.set('strictQuery', false);

const app = express();
const port = process.env.PORT || 9000;

app.use(express.json());
app.use(Cors());
//database
const connectionDbUrl = "mongodb+srv://f:Filippo1.@cluster0.nn1vaf7.mongodb.net/";


mongoose.connect(connectionDbUrl);
const db = mongoose.connection;
db.once( "open", function() {
    console.log("db connected");

    const msgCollection = db.collection("messagecontents");
    const changeStream = msgCollection.watch();

    changeStream.on("change", (change) =>{
        console.log(change);
        if(change.operationType === "insert"){
            const record = change.fullDocument; 
            pusher.trigger("messages", "inserted", {
            'name': record.name,
            'message': record.message
            });
        }else{
            console.log("not trigger pusher");
        }
       
        
    });

    const chtCollection = db.collection("chatcontents");
    const changeStreamm = chtCollection.watch();

    changeStreamm.on("change", (change) =>{
        console.log(change);
        if(change.operationType === "insert"){
            const record2 = change.fullDocument; 
            pusher2.trigger("channels", "inserted", {
            'name': record2.name,
            });
        }else{
            console.log("not trigger pusher");
        }
       
        
    });
});
db.on("error", function(error) {
    console.error("Errore nella connessione al database:", error);
});

app.get('/api',(req,res) => {
    res.status(200).send("benvenuto sul Server");
})

app.post("/api/v1/messages", async (req, res) => {
    try {
      const dbMessage = req.body;
      console.log(dbMessage);
      const createdMessage = await MessageContentModel.create(dbMessage);
      console.log(createdMessage);
      res.status(201).send(createdMessage);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  });

app.post("/api/v1/canali", async (req, res) => {
  try{
    const {partecipanti, name} = req.body;
    console.log(partecipanti);
    const me = partecipanti[0];
    const you = partecipanti[1];

    console.log(me);
    console.log(you);

    const user = await loginContents.findOne({key: me.toString()});
    const user2 = await loginContents.findOne({key: you.toString()});

    console.log(user);
    console.log(user2);

    partecipanti[0] = user.username;
    partecipanti[1] = user2.username;

    const dbMessages = {
      partecipanti,
      name
    };

    const createdMessage = await chatContent.create(dbMessages);
    res.status(201).send(createdMessage);
  }catch(error){
    console.error(error);
    res.status(500).send(error);
  }
})

  app.post('/api/v1/messages/sync', async (req, res) => {
    try {

      const {nameChat} = req.body;
      console.log(req.body);

      if (!nameChat) {
        return res.status(400).send("Il campo nameChat è richiesto.");
    }

      const data = await MessageContentModel.find({chatName: nameChat });
      console.log(data);
      res.status(200).send(data);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  });

  app.post('/api/v1/canali/sync', async (req, res) => {
    try {
     
      const { name } = req.body;
      console.log(name);
      // Utilizzando la ricerca diretta nell'array partecipanti
      const data = await chatContent.find({ partecipanti: name });
  
      res.status(200).send(data);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  });
  
  

  app.post("/api/v1/signup", async (req, res) => {
    try {
      const dblog = req.body;

      if(dblog.passwordConfirm === dblog.password){
        dblog.password = await hashPassword(dblog.password);
        dblog.key = await createkey(dblog.key);
        const createdlog = await loginContents.create(dblog);
        res.status(201).send(createdlog);
      }else{
        res.status(400).json({
          message: "password uguali"
        })
      }
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  });

  app.post("/api/v1/login", async (req, res) => {
    const { email, password } = req.body; // Estrai email e password dall'oggetto req.body
  
    try {
      const user = await loginContents.findOne({ email });
  
      if (!user) {
        return res.status(401).json({
          message: 'Credenziali non valide'
        });
      }
  
      // Verifica la correttezza della password
      // (Assumendo che ci sia una funzione compare per confrontare le password)
      const isPasswordValid = await bycript.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Credenziali non valide' });
      }
  
      // Genera il token di autenticazione
      //const token = generateToken(user);
      const username = user.username;
      const key = user.key;
      res.json({username, key});
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  });
  

app.listen(port, ()=>{
    console.log('server start on port: ' + port);
})


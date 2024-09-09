import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

dotenv.config({ path: "./.env" });
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

app.use(express.static(path.join(__dirname, "public"))); //loc of static assets

app.set("view engine", "ejs"); //to render index page

app.get("/", (req, res) => {
  fs.readdir("./files", (err, files) => {
    console.log(files);
    res.render("index", { files: files });
  });
});

app.post("/create", (req, res) => {
  fs.writeFile(
    `./files/${req.body.title.split(" ").join("")}.txt`,
    req.body.details,
    (err) => {
      res.redirect("/");
    }
  );
});

app.get("/file/:filename", (req, res) => {
  fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, filedata) => {
    res.render("show", { filename: req.params.filename, filedata: filedata });
  });
});

app.get("/edit/:filename", (req, res) => {
  fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, filedata) => {
  
    res.render("edit", { filename: req.params.filename, filedata: filedata });
  
  });
});

app.post("/edit", (req, res) => {
  console.log(req.body);
  fs.rename(
    `./files/${req.body.previous}`,
    `./files/${req.body.new}`,
    (err) => {
      console.log(err);
      if(!err){
      res.redirect("/");
      }else{
        res.render("error");
      }
    }
  );
});

app.get("/notimplemented", (req, res) => {
  return next(new Error("not implemented"));
});

//geh
app.use((err, req, res, next) => {
  console.log("stack", err.stack);
  res.status(500).send("not imp");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("app is running at : ", process.env.PORT || 3000);
});

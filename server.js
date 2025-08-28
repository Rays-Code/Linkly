import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { nanoid} from 'nanoid';
import { connectDB } from './services/db.js';
import { URL } from './models/URL.js';

const app = express();

app.use(express.json());
dotenv.config();

app.use(cors({
  origin: ["https://linkly.fit", "https://www.linkly.fit"],
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true
}));

connectDB();

app.post("/api/shorten", async (req, res) => {
    const { longURL } = req.body;

    if (!longURL) {
      return res.status(400).json({ error: "longURL is required" });
    }

    const shortId = nanoid(6);
    const shortURL = `${process.env.BASE_URL}/${shortId}`

    await URL.create({
        longURL: longURL,
        shortURL: shortURL,
        clicksHistory: [
            { label: "Jan", clicks: 0 },
            { label: "Feb", clicks: 0 },
            { label: "Mar", clicks: 0 },
            { label: "Apr", clicks: 0 },
            { label: "May", clicks: 0 },
            { label: "Jun", clicks: 0 },
            { label: "Jul", clicks: 0 },
            { label: "Aug", clicks: 0 },
            { label: "Sep", clicks: 0 },
            { label: "Oct", clicks: 0 },
            { label: "Nov", clicks: 0 },
            { label: "Dec", clicks: 0 },
        ] 
    });

    res.json({
        message: "URL shortened successfully",
        shortURL: shortURL
    });
});

app.post("/api/analytics", async (req, res) => {
    const shortURL = req.body.shortURL;

    if(!shortURL){
        return res.status(400).json({error: "shortURL is required"});
    }

    const isShortURLExists = await URL.findOne({ shortURL: shortURL });
    
    if(isShortURLExists === null){
        return res.status(404).json({message: "URL not found"});
    }

    res.status(200).json({
        message: "Analytics fetched successfully",
        clicksHistory: isShortURLExists.clicksHistory
    })   
});

app.get("/:shortURLId", async (req, res) => {

    const isURL = await URL.findOne({ 
        shortURL: { $regex: req.params.shortURLId }
    });
    
    if(isURL === null){
        return res.status(404).json({message: "URL not found"});
    }

    const currentMonth = new Date().getMonth();

    isURL.clicksHistory[currentMonth].clicks++
    await isURL.save();
    res.redirect(isURL.longURL);
})

app.listen(process.env.PORT || 3000, () => console.log('Server is running...'));

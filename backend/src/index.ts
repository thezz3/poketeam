import express from "express";
import cors from "cors";

import {db} from "./FirebaseInit.js";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { analyzeTeam } from "./analyzeteam.js";

const app = express();
const port = 8080;

app.use(express.json());
app.use(cors({origin: "http://localhost:3000"}));

interface Team {
    name: string;
    pokemon: string[];
}

app.get("/", async (req, res) => {
    res.send("Pokemon Team Builder API");
});

app.get("/teams", async (req, res) => {
    console.log("GET /teams called");
    try {
        const teamCollection = collection(db, "team");
        const teamDocs = await getDocs(teamCollection);
        const docs: Team[] = [];
        teamDocs.forEach((doc) => {
            docs.push(doc.data() as Team);
        });
        res.send(docs);
    } catch (error) {
        console.error("Error in GET /teams:", error);
        res.status(500).send("Error getting teams");
    }
});

app.post("/teams", async (req, res) => {
    try {
        const teamRef = collection(db, "team");
        const teamBody = req.body;
        await addDoc(teamRef, teamBody);
        res.status(200).send("Successfully Created Team");
    } catch (e) {
        console.error("Error in POST /teams:", e);
        res.status(500).send("Error creating team");
    }
});

app.post("/analyze", async (req, res) => {
    try {
        const pokemonTeam = req.body.team; 
        const analysis = analyzeTeam(pokemonTeam);
        res.json(analysis);
    } catch (error) {
        console.error("Error in POST /analyze:", error);
        res.status(500).send("Error analyzing team");
    }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
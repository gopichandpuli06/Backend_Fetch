//import express from "express";
//import bodyParser from "body-parser"
//import { v4 as uuidv4 } from "uuid"

const express = require("express");
const bodyParser = require("body-parser");
const uid = require("uuid");

const app = express()
const port = 4500
app.use(bodyParser.json());

const receiptDB = {}

/// post request for /receipts/process
app.post("/receipts/process", (req, res) =>{
    try{
        const data = req.body;
        const receiptId = uid.v4();
        //passing the data to calculate the points and rendering the points
        const points = calculatePoints(data);

        //store the points and id in the memory
        receiptDB[receiptId] = {
            receipt: data,
            points: points,
        };

        res.status(201).json({ id: receiptId });
    }catch (error){
        res.status(400).json({ error: 'Invalid JSON data' });
    }
})

//get request for /receipts/{id}/points
app.get("/receipts/:id/points", (req, res) =>{
    try{
        const receiptId = req.params.id;
        if(receiptDB[receiptId]){
            const points = receiptDB[receiptId].points;
            res.json({points: points});
        }else{
            res.status(404).json({error: "Receipt not found"});
        }
    }catch(error){
        res.status(400).json({ error: 'Invalid JSON data' });
    }
})

function calculatePoints(receipt){
    let points = receipt.retailer.replace(/[^a-zA-Z0-9]/g, '').length; //One point for every alphanumeric character in the retailer name.
    const total = parseFloat(receipt.total);
    if(Number.isInteger(total)){ //check if the total is integer if it is yes then add 50 points
        points +=50; //50 points if the total is a round dollar amount with no cents.
    }

    if(total % 0.25 === 0){
        points += 25; //25 points if the total is a multiple of 0.25.
    }

    let noItems = receipt.items.length;
    points += Math.floor(noItems/2) *5; //5 points for every two items on the receipt.

    //If the trimmed length of the item description is a multiple of 3, multiply the price by 0.2 and round up to the nearest integer. The result is the number of points earned.
    receipt.items.forEach((item) =>{
        const descLength = item.shortDescription.trim().length;
        if (descLength % 3 === 0){
            const itemPoints = Math.ceil(parseFloat(item.price) * 0.2);
            points += itemPoints;
        }
    })

    const purchaseDate = new Date(receipt.purchaseDate);
    const purchaseDay = purchaseDate.getDate();
    if( purchaseDay % 2 !== 0){
        points += 6;  //6 points if the day in the purchase date is odd.
    }

    const purchaseTime = receipt.purchaseTime.split(':');
    const purchaseHour = parseInt(purchaseTime[0]);
    const purchaseMinute = parseInt(purchaseTime[1]);

    if((purchaseHour === 14 && purchaseMinute > 0) || (purchaseHour === 15)){
        points += 10; //10 points if the time of purchase is after 2:00pm and before 4:00pm.
    }

    return points;
}


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
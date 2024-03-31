const PORT = 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()

const schedule = [];

app.get('/',(req,res) => {
    res.json('Welcome to my test API')
})

app.get('/news',(req,res) => {
    axios.get('https://www.formula1.com/en/racing/2024.html')
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);
            
            $("a[data-roundtext]").each(function () {
                const round = $(this).attr('data-roundtext')
                const location = $(this).find('.event-place').text().trim();
                const date = $(this).find('.start-date').text().trim() + " - " + $(this).find('.end-date').text().trim() + ", " + $(this).find('.month-wrapper').text().trim();
                const url = "https://www.formula1.com/" + $(this).attr('href')
                schedule.push({
                    round,
                    location,
                    date,
                    url
                })
            })
            res.json(schedule)
        }).catch((err) => {
            console.error("Error fetching data:", err);
            res.status(500).json({ error: 'An error occurred while fetching data' });
        })
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))
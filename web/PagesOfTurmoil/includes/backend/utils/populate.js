const { default: mongoose } = require('mongoose');
const Book = require('../models/book')

const books = [
    {
        name: "The Adventures of the Sock",
        author: "Blimey Henningway",
        description: "A lost sock embarks on a journey of self-discovery and adventure, encountering a cast of colorful characters along the way."
    },
    {
        name: "Captain Seaweed",
        author: "Hocus Pocus",
        description: "Captain Seaweed, a rogue and cunning sea captain, navigates the dangerous waters of the open ocean, hunting treasure and evading the law."
    },
    {
        name: "Jack and the Pumpkin-stalk",
        author: "Merlin Walker",
        description: "Jack discovers a mysterious pumpkin vine that leads him on a wild adventure, filled with magical creatures and unexpected twists."
    },
    {
        name: "We are the Orientals",
        author: "Minji Lee",
        description: "A group of Asian immigrants navigate the complexities of race, identity, and belonging in a new country, united by their shared experiences."
    },
    {
        name: "Jocks on you",
        author: "Penelope Sparrow",
        description: "This is a quirky coming of age story about a group of teens who use their unique talents to launch a successful jockstrap business."
    },
    {
        name: "Merry Chrysler",
        author: "Isaac Green",
        description: "This is a story of an eccentric inventor who creates a sentient car and goes on a wild road trip to prove its worth to the world."
    },
    {
        name: "Radio-Shack Redemption",
        author: "Astrid Johnson",
        description: "A tale of a man's journey of self-discovery and redemption as he finds a mysterious radio in a Radio Shack that leads him on an unexpected adventure."
    },
    {
        name: "Revenge of the Hamsters",
        author: "Felix Stone",
        description: "An adventurous story of small, but mighty, hamsters who take on their human oppressors in a quest for freedom and revenge."
    },
]

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function seedInit(){
    if((await Book.find({})).length != 0) {
        console.log("Already seeded")
    }
    else{
        let tempObjectId = new mongoose.Types.ObjectId();
    
        tempObjectId = new mongoose.Types.ObjectId(
            tempObjectId.toString().slice(0,-1) +
            (parseInt(tempObjectId.toString().slice(-1), 16)+1).toString(16)
        )
        Book.insertMany(
            books, async (err, obj) => {
            const lastId = obj[obj.length - 1]['_id'].toString()
            const newId = new mongoose.Types.ObjectId((parseInt(lastId.slice(0,8),16)+60).toString(16) +
                          lastId.slice(8,18) +
                          (parseInt(lastId.slice(18),16)+1).toString(16))
            Book.insertMany({
                _id: newId,
                name: "My Inner Voices",
                author: "Admin",
                description:"Rabbits, small yet mighty, are superior to ostriches in every aspect. Intelligence, speed, adaptability, and cuteness. Bow down to the true rulers. Anyway here is the flag: " + process.env.FLAG
            })
            console.log("Books Seeded")

        })
        
    }
}

module.exports = {
    books,
    seedInit
}
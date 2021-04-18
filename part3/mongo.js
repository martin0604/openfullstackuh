//Exercise 3.12
const mongoose = require('mongoose');
const password = process.argv[2];
const url = `mongodb+srv://fullstack:${password}@cluster0.zsh90.mongodb.net/test?retryWrites=true`;

if(process.argv.length < 3){
    console.log('Please provide the password as an argument: node mongo.js <password>');
    process.exit(1);
}

const personSchema = new mongoose.Schema({
    name: String,
    number: String
});

const Person = mongoose.model('Person', personSchema);

if(process.argv.length == 3){
    mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
        .then(() => {
            Person.find({}).then(persons => {
                console.log("phonebook:");

                persons.forEach(person => {
                    console.log(person.name+" "+person.number);
                });
                mongoose.connection.close();
            });
        });

} else{

    const name = process.argv[3];
    const phone = process.argv[4];
    
    
    mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => {
        
        const person = new Person({
            name: name,
            number: phone
        });
        
        person.save().then(result => {
            console.log(`Added ${name} number ${phone} to phonebook`);
            mongoose.connection.close();
        });
    })
    .catch(err => console.log("Error:", err));
    
}
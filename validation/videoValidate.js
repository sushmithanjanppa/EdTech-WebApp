module.exports={
    checkTitle(title){
        if(typeof(title)==='undefined') throw "Please enter a valid input for title";
        if(typeof(title) !== 'string') throw 'You must provide string value for title';
        if(title.trim().length === 0) throw "title cannot be blank";
    }
}
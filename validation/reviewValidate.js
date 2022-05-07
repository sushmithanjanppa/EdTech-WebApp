module.exports = {
    checkText(text){
        if(typeof(text)==='undefined') throw "Please provide a review";
        if(typeof(text)!='string') throw "Review must be a string";
        text = text.trim();
        if(text.length===0) throw "Empty review, Please provide a review";
    },

    checkRating(rating){
        if(typeof(rating)==='undefined') throw "Please provide a rating";
        if(rating.trim().length===0) throw "Must provide a rating";
        rating = Number.parseInt(rating);
        if(typeof(rating)!='number') throw 'Rating should be a number';
        if(rating>5 || rating<0) throw 'Rating must be between 0-5';
    },
}
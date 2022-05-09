module.exports = {
    checkName(name){
        if(typeof(name)==='undefined') throw "Please enter a valid input for name";
        if(typeof(name) !== 'string') throw 'You must provide string value for name';
        if(name.trim().length === 0) throw "Name cannot be blank";
    },

    checkDesc(desc){
        if(typeof(desc)==='undefined') throw "Please enter a valid input for Description";
        if(typeof(desc) !== 'string') throw 'You must provide string value for Description';
        if(desc.trim().length === 0) throw "Description cannot be blank";
    },

    checkVid(vid){
        if(typeof(vid)==='undefined') throw "Please enter a valid input for video 1";
        if(typeof(vid)!=='string') throw 'Please enter a valid input for video 2';
        if(vid.trim().length===0) throw "Video id cannot be blank";
    },

    checkBranch(br){
        if(typeof(br)==='undefined') throw "Please select a brnach";
        if(typeof(br)!=='string') throw 'Invalid branch';
        br = br.trim();
        if(br.length===0) throw "Invalid branch";
        if(br!='CS' && br!='NONCS') throw "Invalid branch";
    }
}  
class APIFeatures{
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString ;
    }

    sort(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(" ");
            this.query = this.query.sort(sortBy);
        } else{
            this.query = this.query.sort("dateCreation");
        }
        return this ;
    }

    paginate(){
        const limit = 20 ;
        const page = this.queryString.page * 1 || 1;
        const skip = (page -1) * limit ;
        this.query = this.query.skip(skip).limit(limit); 

        return this ;


    }
}

module.exports = APIFeatures ;
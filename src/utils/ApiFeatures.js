class ApiFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    };

    filter () {
        const queryObj = { ...this.queryString }; /** Destructing */
        const excludedFields = [ 'page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        /**1b. Advanced Filtering for gte, gt, lte, lt mongoose filters*/
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        /**Find Document in database */
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    };

    sort() {
        if (this.queryString.sort) {
            let sortBy = this.queryString.sort.split(',').join(" ");
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-created_at -createdAt');
        };
        return this;
    };

    limit() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(" ");
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        };
        return this;
    };

    paginate () {
        let page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        return this;
    };
}; 

module.exports = ApiFeatures;
const Default_page = 1
const Default_limit = 0;

function getPagination(query){
    const page = Math.abs(query.page) || Default_page;
    const limit = Math.abs(query.limit) || Default_limit;
    const skip = (page - 1) * limit;

    return {
        skip,
        limit
    }

}

module.exports = {
    getPagination
}
const RouteNotFound = (req, res) => res.status(404).json({message:'Route does not exist'})

module.exports =RouteNotFound

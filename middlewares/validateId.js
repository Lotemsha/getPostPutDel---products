//Lotem Sharir , Ameed Halabi

function validateId(req, res, next) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "id is required" });
  }

  if (isNaN(id)) {
    return res.status(400).json({ message: "id must be a number" });
  }

  next();
}

module.exports = validateId;


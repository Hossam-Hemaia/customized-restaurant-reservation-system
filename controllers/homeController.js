exports.getHomePage = async (req, res, next) => {
  try {
    res.render("home", { hasError: false });
  } catch (err) {
    console.log(err);
  }
};

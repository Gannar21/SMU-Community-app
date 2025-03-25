const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
      next(); // Proceed if the user is an admin
    } else {
      return res.status(403).json({ message: "You do not have admin access" });
    }
  };
  
  // Example of using the isAdmin middleware on admin routes:
  app.use("/api/admin", isAdmin);
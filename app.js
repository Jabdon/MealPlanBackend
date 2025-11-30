const fs = require("fs");
const express = require("express");
const AppError = require("./Utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const { json } = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const compression = require("compression");

// Route initiation
const mealRouter = require("./routes/mealRoutes");
const userRouter = require("./routes/userRoutes");
const ingredientRouter = require("./routes/ingredientRoutes");

const app = express();

// 1) Global Middleware

// set security HTTPS
app.use(helmet());
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

const limiter = rateLimit({
  max: 100,
  windows: 60 * 60 * 1000,
  message: "Too many request from this IP, please try again in an hour",
});

app.use("/api", limiter);
app.use(helmet());

// body parser
app.use(express.json());

// Clean : Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against xss
app.use(xss());

// prevent parameter pollution
app.use(hpp());

app.use(compression());
// routes
app.use("/api/v1/meals", mealRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/ingredients", ingredientRouter);

// Error
app.all(/.*/, (req, res, next) => {
  next(new AppError("Cannot find page", 404));
});

app.use(globalErrorHandler);

module.exports = app;

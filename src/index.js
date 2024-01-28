const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { ServerConfig, Logger } = require("./config");
const apiRoutes = require("./routes");
const { rateLimit } = require("express-rate-limit");

const app = express();
const limiter = rateLimit({
  windowMs: 2 * 60 * 1000,//window size 2 minutes
  max: 4,//4 req per window
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);
//using proxy for flight service
app.use(
  "/flightsService",
  createProxyMiddleware({
    target: ServerConfig.FLIGHT_SERVICE,
    changeOrigin: true,
    pathRewrite: { "^/flightsService": "/" },
  })
);
//using proxy for booking service
app.use(
  "/bookingService",
  createProxyMiddleware({
    target: ServerConfig.BOOKING_SERVICE,
    changeOrigin: true,
    pathRewrite: { "^/bookingService": "/" },
  })
);
app.use("/api", apiRoutes);

app.get("/home",(req,res)=>{
  return res.json({message: "OK"});
});

app.listen(ServerConfig.PORT, () => {
  console.log(`Successfully started server on port:${ServerConfig.PORT}`);
});

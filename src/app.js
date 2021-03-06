import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";
import contentsRoutes from "./routes/contents";
import userRoutes from "./routes/users";
import rolesRoutes from "./routes/roles";
import authRoutes from "./routes/auth";
import dotenv from "dotenv";
import Stripe from "stripe";

const stripe = Stripe(process.env.STRIPE_SECRET);

dotenv.config();


const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/api/v1/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/v1", authRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", contentsRoutes);
app.use("/api/v1", rolesRoutes);

//Stripe
app.post("/api/v1/products", async (req, res) => {
    try {
      const { name, type } = req.body;
      const product = await stripe.products.create({
        name,
        type,
      });
      res.json(product);
    } catch (error) {
      res.status(500).json(error);
    }
  });
  
  app.get("/api/v1/products", async (req, res) => {
    try {
      const products = await stripe.products.list({
        limit: 3,
      });
      res.json(products);
    } catch (error) {
      res.status(500).json(error);
    }
  });
  
  app.post("/api/v1/plans", async (req, res) => {
    const { productId, amount } = req.body;
    const plan = await stripe.plans.create({
      amount,
      currency: "mxn",
      interval: "month",
      product: productId,
    });
    res.json(plan);
  });
  
  app.post("/api/v1/customers", async (req, res) => {
    const { name, address, email } = req.body;
    try {
      const customer = await stripe.customers.create({
        name,
        email,
        address,
      });
      res.json(customer);
    } catch (error) {
      res.status(500).json(error);
    }
  });
  
  app.put("/api/v1/customers/:id/payment_method", async (req, res) => {
      const {id:customerId} = req.params;
      const { paymentMethodId } = req.body;
      try {
        const customer = await stripe.customers.update(
          customerId,
          {invoice_settings: {default_payment_method: paymentMethodId}}
        );
        res.json(customer);
      } catch (error) {
        res.status(500).json(error);
      }
    });
  
  app.post("/api/v1/subscriptions", async (req, res) => {
    const { customer, plan } = req.body;
    try {
      const subscription = await stripe.subscriptions.create({
        customer,
        items: [{ plan }],
      });
      res.json(subscription);
    } catch (error) {
      res.status(500).json(error);
    }
  });
  
  
  app.post("/api/v1/payment_method", async (req, res) => {
      const { number, exp_month, exp_year, cvc} = req.body;
      try {
          const paymentMethod = await stripe.paymentMethods.create({
              type: 'card',
              card: {
                number,
                exp_month,
                exp_year,
                cvc,
              },
          });
        res.json(paymentMethod);
      } catch (error) {
        res.status(500).json(error);
      }
  });
  
  app.post("/api/v1/customers/:id/payment_method", async (req, res) => {
      const { id } = req.params;
      const { paymentMethodId } = req.body;
      try {
          const paymentMethod = await stripe.paymentMethods.attach(
              paymentMethodId,
              {customer: id}
          );
          res.json(paymentMethod);
      } catch (error) {
        res.status(500).json(error);
      }
  });
    
export default app;
// import express from "express";
// import cors from "cors";
// import { StreamChat } from "stream-chat";
// import { v4 as uuidv4 } from "uuid";
// import bcrypt from "bcrypt";
// const app = express();

// app.use(cors());
// app.use(express.json());
// const api_key = "zg3nxyu6p5k5";
// const api_secret =
//   "fuf2uwdedcnp8dfwz87jp2kr3wjx2bbakyywwgbhwukdg2ucxb9z76yuqskhushj";
// const serverClient = StreamChat.getInstance(api_key, api_secret);

// app.post("/signup", async (req, res) => {
//   try {
//     const { firstName, lastName, username, password } = req.body;
//     const userId = uuidv4();
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const token = serverClient.createToken(userId);
//     res.json({ token, userId, firstName, lastName, username, hashedPassword });
//   } catch (error) {
//     res.json(error);
//   }
// });

// app.post("/login", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const { users } = await serverClient.queryUsers({ name: username });
//     if (users.length === 0) return res.json({ message: "User not found" });

//     const token = serverClient.createToken(users[0].id);
//     const passwordMatch = await bcrypt.compare(
//       password,
//       users[0].hashedPassword
//     );

//     if (passwordMatch) {
//       res.json({
//         token,
//         firstName: users[0].firstName,
//         lastName: users[0].lastName,
//         username,
//         userId: users[0].id,
//       });
//     }
//   } catch (error) {
//     res.json(error);
//   }
// });

// app.listen(3003, () => {
//   console.log("Server is running on port 3001");
// });


import express from "express";
import cors from "cors";
import { StreamChat } from "stream-chat";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

const app = express();

app.use(cors());
app.use(express.json());

const api_key = "zg3nxyu6p5k5";
const api_secret = "fuf2uwdedcnp8dfwz87jp2kr3wjx2bbakyywwgbhwukdg2ucxb9z76yuqskhushj";
const serverClient = StreamChat.getInstance(api_key, api_secret);

app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, username, password } = req.body;
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = serverClient.createToken(userId);

    // Create the user in Stream Chat
    await serverClient.upsertUser({
      id: userId,
      name: username,
      firstName,
      lastName,
      hashedPassword,
    });

    res.json({ token, userId, firstName, lastName, username, hashedPassword });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const { users } = await serverClient.queryUsers({ name: username });

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = serverClient.createToken(user.id);
    res.json({
      token,
      firstName: user.firstName,
      lastName: user.lastName,
      username,
      userId: user.id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
